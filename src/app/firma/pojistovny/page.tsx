'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { useFirmaCompany } from '@/features/admin/FirmaCompanyProvider';
import { PageHeader, SearchInput } from '@/features/admin/components/primitives';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-brand-600' : 'bg-border-strong'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${
          on ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function FirmaInsurersPage() {
  const company = useFirmaCompany();
  const { insurers, saveCompany } = useAdminData();
  const [query, setQuery] = useState('');

  if (!company) return <p className="text-sm text-muted">Firma nenalezena.</p>;

  const enabled = new Set(company.insurerIds ?? []);
  const filtered = insurers.filter(
    (i) => i.tradeName.toLowerCase().includes(query.toLowerCase()) || i.name.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (id: string) => {
    const next = enabled.has(id)
      ? (company.insurerIds ?? []).filter((x) => x !== id)
      : [...(company.insurerIds ?? []), id];
    saveCompany({ ...company, insurerIds: next });
  };

  return (
    <div>
      <PageHeader
        title="Pojišťovny ke sjednání"
        description="Zapněte nebo vypněte pojišťovny, se kterými může firma sjednávat pojištění."
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat pojišťovnu…" />
        <span className="text-sm text-muted">{enabled.size} zapnuto</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {filtered.map((ins) => {
          const on = enabled.has(ins.id);
          return (
            <div key={ins.id} className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 last:border-0">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-brand-700">
                  {ins.logoText}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">{ins.tradeName}</div>
                  <div className="text-xs text-subtle">{ins.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${on ? 'text-brand-600' : 'text-muted'}`}>
                  {on ? 'Zapnuto' : 'Vypnuto'}
                </span>
                <Toggle on={on} onToggle={() => toggle(ins.id)} />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="px-5 py-10 text-center text-muted">Nic neodpovídá hledání.</div>}
      </div>
    </div>
  );
}
