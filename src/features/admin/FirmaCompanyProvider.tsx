'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useAdminData } from './AdminDataProvider';
import type { Company } from './types';

const STORAGE_KEY = 'firmaCompanyId';

interface FirmaContextValue {
  company: Company | null;
}

const FirmaContext = createContext<FirmaContextValue | undefined>(undefined);

/**
 * Určí aktivní firmu pro administraci firmy:
 *  1) ?company=<id> v URL (super admin „otevře" konkrétní firmu) – uloží se,
 *  2) uložená volba z localStorage,
 *  3) firma přihlášeného uživatele (dle e-mailu),
 *  4) první firma (fallback pro demo).
 */
export function FirmaCompanyProvider({ children }: { children: React.ReactNode }) {
  const { companies, users } = useAdminData();
  const { user } = useAuth();
  const params = useSearchParams();
  const paramCompany = params.get('company');

  useEffect(() => {
    if (paramCompany) {
      try {
        window.localStorage.setItem(STORAGE_KEY, paramCompany);
      } catch {
        /* ignore */
      }
    }
  }, [paramCompany]);

  const company = useMemo<Company | null>(() => {
    const stored = (() => {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const byUser = user ? users.find((u) => u.email === user.email)?.companyId : undefined;
    const candidate = paramCompany || stored || byUser;
    return companies.find((c) => c.id === candidate) ?? companies[0] ?? null;
  }, [companies, users, user, paramCompany]);

  return <FirmaContext.Provider value={{ company }}>{children}</FirmaContext.Provider>;
}

export function useFirmaCompany(): Company | null {
  const ctx = useContext(FirmaContext);
  if (!ctx) throw new Error('useFirmaCompany musí být uvnitř <FirmaCompanyProvider>.');
  return ctx.company;
}
