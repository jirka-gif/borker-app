'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  ADDON_HOSPITALIZACE_PRICE,
  ADDON_SPORTY_PRICE,
  FREQUENCY_OPTIONS,
  ZIVOT_OFFERS,
  formatCzk,
  frequencySuffix,
  monthlyTotal,
  perPeriod,
  type ZivotSelectionState,
} from '../data';

interface Props {
  value: ZivotSelectionState;
  onChange: (next: ZivotSelectionState) => void;
  onNext: () => void;
  onBack: () => void;
}

function AddonToggle({ on, label, price, onToggle }: { on: boolean; label: string; price: number; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${on ? 'text-success' : 'text-subtle'}`}>+ {formatCzk(price)}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? 'bg-brand-600' : 'bg-border-strong'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}

export function ZivotStepOffers({ value, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof ZivotSelectionState>(key: K, v: ZivotSelectionState[K]) => onChange({ ...value, [key]: v });

  const annual = (id: string) => {
    const o = ZIVOT_OFFERS.find((x) => x.id === id)!;
    return monthlyTotal(o, value) * 12;
  };
  const maxAnnual = Math.max(...ZIVOT_OFFERS.map((o) => annual(o.id)), 1);

  return (
    <div className="space-y-6">
      {/* Frekvence */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-foreground">Dostupné nabídky</h2>
        <div className="inline-flex items-center gap-2">
          <span className="text-sm text-muted">Frekvence plateb:</span>
          <div className="inline-flex rounded-full bg-surface-muted p-1">
            {FREQUENCY_OPTIONS.map((f) => {
              const active = value.frequency === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => set('frequency', f.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${active ? 'bg-brand-600 text-white shadow-sm' : 'text-muted'}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nabídky */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {ZIVOT_OFFERS.map((offer) => {
          const selected = value.selectedOfferId === offer.id;
          const period = perPeriod(offer, value);
          return (
            <div
              key={offer.id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition-all ${
                selected ? 'border-brand-600 shadow-card-brand' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-2xs font-bold text-brand-700">
                  {offer.logoText}
                </span>
                <div className="text-base font-semibold text-foreground">{offer.productName}</div>
              </div>

              <div className="px-5">
                {offer.coverages.map((c) => (
                  <div key={c.label} className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
                    <span className="text-muted">{c.label}</span>
                    <span className="font-semibold text-foreground">{c.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-border px-5 py-3">
                <div className="mb-1 text-sm font-semibold text-foreground">Připojištění</div>
                <AddonToggle on={value.addonSporty} label="Sporty" price={ADDON_SPORTY_PRICE} onToggle={() => set('addonSporty', !value.addonSporty)} />
                <AddonToggle on={value.addonHospitalizace} label="Hospitalizace" price={ADDON_HOSPITALIZACE_PRICE} onToggle={() => set('addonHospitalizace', !value.addonHospitalizace)} />
              </div>

              <div className="mt-2 border-t border-border bg-surface-muted px-5 py-4 text-center">
                <div className="text-xl font-bold text-foreground">
                  {formatCzk(period)} <span className="text-sm font-medium text-muted">{frequencySuffix(value.frequency)}</span>
                </div>
                <Button
                  fullWidth
                  variant={selected ? 'primary' : 'outline'}
                  className="mt-3"
                  onClick={() => {
                    set('selectedOfferId', offer.id);
                    onNext();
                  }}
                >
                  {selected ? 'Vybráno – pokračovat' : 'Vybrat'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Porovnání */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">Porovnání všech nabídek (ročně)</h3>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex h-48 items-end gap-3">
            {ZIVOT_OFFERS.map((o) => {
              const a = annual(o.id);
              const h = (a / maxAnnual) * 100;
              const selected = value.selectedOfferId === o.id;
              return (
                <div key={o.id} className="flex min-w-0 flex-1 cursor-pointer flex-col items-center" onClick={() => set('selectedOfferId', o.id)}>
                  <div className={`mb-1 text-xs font-semibold ${selected ? 'text-brand-700' : 'text-foreground'}`}>{formatCzk(a)}</div>
                  <div
                    className={`w-full rounded-t transition-all ${selected ? 'bg-gradient-to-t from-brand-600 to-brand-400' : 'bg-border-strong'}`}
                    style={{ height: `${Math.max(h, 4)}%` }}
                  />
                  <div className={`mt-2 truncate text-center text-xs ${selected ? 'font-semibold text-brand-700' : 'text-muted'}`}>{o.insurer}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext}>Pokračovat</Button>
      </div>
    </div>
  );
}
