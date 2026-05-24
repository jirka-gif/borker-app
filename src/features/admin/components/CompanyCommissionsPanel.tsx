'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui';
import { useAdminData, genId } from '../AdminDataProvider';
import { PRODUCT_TYPE_LABELS, type CompanyCommission, type ProductType } from '../types';

/** Typy produktů, pro které se nastavuje provize. */
const COMMISSION_PRODUCT_TYPES: ProductType[] = [
  'auta',
  'majetek',
  'cestovni',
  'odpovednost',
  'zdravotni-cizinci',
  'mazlicek',
  'zivotni',
  'podnikatele',
];

/**
 * Provize firmy – rozbalovací po pojišťovnách, u každého typu produktu lze
 * nastavit celkovou a vyplácenou provizi. Sdílené super-adminem i firmou.
 */
export function CompanyCommissionsPanel({ companyId }: { companyId: string }) {
  const { insurers, companies, companyCommissions, setCompanyCommission } = useAdminData();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const company = companies.find((c) => c.id === companyId);
  // Pojišťovny firmy (zapnuté ke sjednání); není-li nic, zobraz všechny.
  const shown =
    company && company.insurerIds.length > 0
      ? insurers.filter((i) => company.insurerIds.includes(i.id))
      : insurers;

  const find = (insurerId: string, productType: ProductType) =>
    companyCommissions.find(
      (c) => c.companyId === companyId && c.insurerId === insurerId && c.productType === productType,
    );

  const setValue = (
    insurerId: string,
    productType: ProductType,
    field: 'totalPercent' | 'payoutPercent',
    value: string,
  ) => {
    const existing = find(insurerId, productType);
    const base: CompanyCommission =
      existing ?? { id: genId('cc'), companyId, insurerId, productType, totalPercent: 0, payoutPercent: 0 };
    setCompanyCommission({ ...base, [field]: Number(value) || 0 });
  };

  const insurerSummary = (insurerId: string) => {
    const rows = companyCommissions.filter((c) => c.companyId === companyId && c.insurerId === insurerId);
    return rows.filter((r) => r.totalPercent > 0 || r.payoutPercent > 0).length;
  };

  return (
    <div className="space-y-3">
      {shown.map((ins) => {
        const isOpen = Boolean(open[ins.id]);
        const count = insurerSummary(ins.id);
        return (
          <div key={ins.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <button
              type="button"
              onClick={() => setOpen((p) => ({ ...p, [ins.id]: !p[ins.id] }))}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-muted/50"
            >
              {isOpen ? (
                <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
              ) : (
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              )}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-brand-700">
                {ins.logoText}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{ins.tradeName}</span>
                <span className="block truncate text-xs text-subtle">{ins.name}</span>
              </span>
              <span className="shrink-0 text-xs text-subtle">{count} produktů s provizí</span>
            </button>

            {isOpen && (
              <div className="border-t border-border">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted/40 text-left text-muted">
                      <th className="px-5 py-2 font-semibold">Produkt</th>
                      <th className="px-3 py-2 text-right font-semibold">Celková provize</th>
                      <th className="px-3 py-2 text-right font-semibold">Vyplácená provize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMISSION_PRODUCT_TYPES.map((pt) => {
                      const rec = find(ins.id, pt);
                      return (
                        <tr key={pt} className="border-b border-border last:border-0">
                          <td className="px-5 py-2 font-medium text-foreground">{PRODUCT_TYPE_LABELS[pt]}</td>
                          <td className="px-3 py-2">
                            <div className="ml-auto flex w-28 items-center">
                              <Input
                                type="number"
                                className="text-right"
                                value={String(rec?.totalPercent ?? 0)}
                                onChange={(e) => setValue(ins.id, pt, 'totalPercent', e.target.value)}
                                rightElement={<span className="text-xs text-muted">%</span>}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="ml-auto flex w-28 items-center">
                              <Input
                                type="number"
                                className="text-right"
                                value={String(rec?.payoutPercent ?? 0)}
                                onChange={(e) => setValue(ins.id, pt, 'payoutPercent', e.target.value)}
                                rightElement={<span className="text-xs text-muted">%</span>}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
      {shown.length === 0 && (
        <p className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-muted">
          Firma nemá zapnuté žádné pojišťovny ke sjednání.
        </p>
      )}
    </div>
  );
}
