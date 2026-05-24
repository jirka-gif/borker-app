'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth';
import type {
  AdminUser,
  AuditAction,
  AuditEntry,
  Commission,
  Company,
  CompanyCommission,
  Discount,
  Insurer,
  Product,
} from './types';
import {
  MOCK_AUDIT,
  MOCK_COMMISSIONS,
  MOCK_COMPANIES,
  MOCK_COMPANY_COMMISSIONS,
  MOCK_DISCOUNTS,
  MOCK_INSURERS,
  MOCK_PRODUCTS,
  MOCK_USERS,
} from './mockData';

export function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

interface AdminDataValue {
  insurers: Insurer[];
  products: Product[];
  companies: Company[];
  users: AdminUser[];
  commissions: Commission[];
  discounts: Discount[];
  audit: AuditEntry[];
  companyCommissions: CompanyCommission[];
  /** Uživatelem přidané (zatím prázdné) produktové oblasti, klíč = id pojišťovny. */
  extraCategories: Record<string, string[]>;
  addCategory: (insurerId: string, name: string) => void;

  saveCompanyCommission: (item: CompanyCommission) => void;
  /** Tichý upsert (bez auditu) – pro inline editaci v tabulce provizí. */
  setCompanyCommission: (item: CompanyCommission) => void;
  removeCompanyCommission: (id: string) => void;

  saveInsurer: (item: Insurer) => void;
  removeInsurer: (id: string) => void;
  saveProduct: (item: Product) => void;
  removeProduct: (id: string) => void;
  saveCompany: (item: Company) => void;
  removeCompany: (id: string) => void;
  saveUser: (item: AdminUser) => void;
  removeUser: (id: string) => void;
  saveCommission: (item: Commission) => void;
  removeCommission: (id: string) => void;
  saveDiscount: (item: Discount) => void;
  removeDiscount: (id: string) => void;

  /** Zaloguje libovolnou systémovou akci (např. odeslání pozvánky). */
  log: (action: AuditAction, entity: string, summary: string) => void;
}

const AdminDataContext = createContext<AdminDataValue | undefined>(undefined);

function nowStamp(): string {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const who = user?.name ?? 'Super Admin';

  const [insurers, setInsurers] = useState<Insurer[]>(MOCK_INSURERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS);
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [audit, setAudit] = useState<AuditEntry[]>(MOCK_AUDIT);
  const [companyCommissions, setCompanyCommissions] = useState<CompanyCommission[]>(MOCK_COMPANY_COMMISSIONS);
  const [extraCategories, setExtraCategories] = useState<Record<string, string[]>>({});

  const log = useCallback(
    (action: AuditAction, entity: string, summary: string) => {
      setAudit((prev) => [
        { id: genId('a'), at: nowStamp(), who, action, entity, summary },
        ...prev,
      ]);
    },
    [who],
  );

  /** Generická upsert + audit helper. */
  function makeSave<T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    entity: string,
    label: (item: T) => string,
  ) {
    return (item: T) => {
      setter((prev) => {
        const exists = prev.some((x) => x.id === item.id);
        return exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      });
      setAudit((prev) => {
        // Heuristika: pokud id už existovalo, je to úprava.
        return [
          {
            id: genId('a'),
            at: nowStamp(),
            who,
            action: 'upraveno' as AuditAction,
            entity,
            summary: `Uloženo: ${label(item)}`,
          },
          ...prev,
        ];
      });
    };
  }

  function makeRemove<T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    entity: string,
    label: (item: T) => string,
    source: T[],
  ) {
    return (id: string) => {
      const item = source.find((x) => x.id === id);
      setter((prev) => prev.filter((x) => x.id !== id));
      if (item) log('smazano', entity, `Smazáno: ${label(item)}`);
    };
  }

  const addCategory = useCallback(
    (insurerId: string, name: string) => {
      const clean = name.trim();
      if (!clean) return;
      setExtraCategories((prev) => {
        const existing = prev[insurerId] ?? [];
        if (existing.includes(clean)) return prev;
        return { ...prev, [insurerId]: [...existing, clean] };
      });
      log('vytvoreno', 'Produktová oblast', `Přidána oblast „${clean}"`);
    },
    [log],
  );

  const value = useMemo<AdminDataValue>(
    () => ({
      insurers,
      products,
      companies,
      users,
      commissions,
      discounts,
      audit,
      companyCommissions,
      extraCategories,
      addCategory,
      saveCompanyCommission: makeSave(setCompanyCommissions, 'Provize firmy', (c) => `${c.totalPercent}/${c.payoutPercent} %`),
      setCompanyCommission: (item: CompanyCommission) =>
        setCompanyCommissions((prev) =>
          prev.some((x) => x.id === item.id) ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev],
        ),
      removeCompanyCommission: makeRemove(setCompanyCommissions, 'Provize firmy', (c) => `${c.totalPercent}/${c.payoutPercent} %`, companyCommissions),
      saveInsurer: makeSave(setInsurers, 'Pojišťovna', (i) => i.name),
      removeInsurer: makeRemove(setInsurers, 'Pojišťovna', (i) => i.name, insurers),
      saveProduct: makeSave(setProducts, 'Produkt', (p) => p.name),
      removeProduct: makeRemove(setProducts, 'Produkt', (p) => p.name, products),
      saveCompany: makeSave(setCompanies, 'Firma', (c) => c.name),
      removeCompany: makeRemove(setCompanies, 'Firma', (c) => c.name, companies),
      saveUser: makeSave(setUsers, 'Uživatel', (u) => `${u.firstName} ${u.lastName}`),
      removeUser: makeRemove(setUsers, 'Uživatel', (u) => `${u.firstName} ${u.lastName}`, users),
      saveCommission: makeSave(setCommissions, 'Provize', (c) => c.name),
      removeCommission: makeRemove(setCommissions, 'Provize', (c) => c.name, commissions),
      saveDiscount: makeSave(setDiscounts, 'Sleva', (d) => d.name),
      removeDiscount: makeRemove(setDiscounts, 'Sleva', (d) => d.name, discounts),
      log,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [insurers, products, companies, users, commissions, discounts, audit, companyCommissions, extraCategories, who],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData musí být uvnitř <AdminDataProvider>.');
  return ctx;
}
