'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { ADDONS, INCLUDED, LIMITS, formatCzk } from './data';

interface LiabilityStepCoverageProps {
  limit: string;
  onLimitChange: (value: string) => void;
  added: Record<string, boolean>;
  onToggleAddon: (id: string) => void;
  onNext: () => void;
}

export function LiabilityStepCoverage({
  limit,
  onLimitChange,
  added,
  onToggleAddon,
  onNext,
}: LiabilityStepCoverageProps) {
  const setLimit = onLimitChange;
  const toggleAddon = onToggleAddon;
  const selectedLimit = LIMITS.find((l) => l.value === limit);

  return (
    <div className="space-y-6">
      {/* Výběr limitu */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Jaký chcete limit?</h2>
        <p className="mt-1 text-sm text-muted">
          Zvolte si limit, do kterého budeme hradit škody na majetku a zdraví.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Limit plnění</label>
            <Select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              options={LIMITS.map((l) => ({
                value: l.value,
                label: `${l.label} – ${l.desc}`,
              }))}
            />
          </div>
          <div className="sm:pb-1 sm:text-right">
            <span className="text-lg font-bold text-foreground">
              {selectedLimit ? formatCzk(selectedLimit.price) : '—'}
            </span>
            <span className="text-sm font-normal text-muted"> / rok</span>
          </div>
        </div>
      </div>

      {/* Krytí v základu */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Tohle máte u mě už v základu</h3>
        <div className="mt-4 space-y-4">
          {INCLUDED.map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dokupitelná připojištění */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">
          Připojištění, které si můžete dokoupit
        </h3>
        <div className="mt-4 space-y-3">
          {ADDONS.map((a) => {
            const on = Boolean(added[a.id]);
            return (
              <div
                key={a.id}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  on ? 'border-brand-600 bg-brand-50' : 'border-border'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{a.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-foreground">+ {formatCzk(a.price)}</p>
                  <p className="text-xs text-muted">/ rok</p>
                  <button
                    type="button"
                    onClick={() => toggleAddon(a.id)}
                    className={`mt-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      on
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-brand-600 text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    {on ? 'Přidáno' : 'Přidat'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Pokračovat</Button>
      </div>
    </div>
  );
}
