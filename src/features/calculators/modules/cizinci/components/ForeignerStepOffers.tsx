'use client';

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  DURATIONS,
  formatCzk,
  type DurationMonths,
  type ForeignerInputState,
  type ForeignerSelectionState,
} from '../data';
import { getForeignerOffers, monthlyPrice, totalPrice } from '../offers';

interface ForeignerStepOffersProps {
  input: ForeignerInputState;
  value: ForeignerSelectionState;
  onChange: (next: ForeignerSelectionState) => void;
  onNext: () => void;
  onBack: () => void;
}

function durationLabel(m: number): string {
  return m === 3 ? '3 měsíce' : `${m} měsíců`;
}

export function ForeignerStepOffers({ input, value, onChange, onNext, onBack }: ForeignerStepOffersProps) {
  const offers = getForeignerOffers();
  const set = <K extends keyof ForeignerSelectionState>(key: K, v: ForeignerSelectionState[K]) =>
    onChange({ ...value, [key]: v });

  useEffect(() => {
    if (!value.selectedOfferId) onChange({ ...value, selectedOfferId: offers[0]?.id ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Doba trvání */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Doba trvání pojištění</h2>
        <p className="mt-1 text-sm text-muted">Cena se přepočítá podle zvolené délky pojištění.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DURATIONS.map((m) => {
            const active = value.durationMonths === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => set('durationMonths', m as DurationMonths)}
                className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <div className={`text-lg font-bold ${active ? 'text-brand-700' : 'text-foreground'}`}>{m}</div>
                <div className="text-xs text-muted">{m === 3 ? 'měsíce' : 'měsíců'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nabídky */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const selected = value.selectedOfferId === offer.id;
          const monthly = monthlyPrice(offer, input, value.durationMonths);
          const total = totalPrice(offer, input, value.durationMonths);
          return (
            <div
              key={offer.id}
              className={`rounded-2xl border bg-surface p-5 shadow-sm transition-all md:p-6 ${
                selected ? 'border-brand-600 shadow-card-brand' : 'border-border'
              }`}
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr_auto]">
                <div>
                  <div className="text-2xs font-medium uppercase tracking-wide text-subtle">
                    {offer.insurer}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{offer.productName}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{offer.description}</p>
                </div>

                <div className="space-y-1.5">
                  {offer.coverages.map((cov) => (
                    <div
                      key={cov.label}
                      className="flex items-center justify-between gap-3 border-b border-border py-1.5 text-sm last:border-0"
                    >
                      <span className="text-muted">{cov.label}</span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        {cov.included && <Check className="h-3.5 w-3.5 text-brand-600" />}
                        {cov.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cena – výrazný panel */}
                <div
                  className={`flex w-full flex-col items-center justify-center rounded-xl border p-4 text-center lg:w-48 ${
                    selected ? 'border-brand-600 bg-brand-50' : 'border-border bg-surface-muted'
                  }`}
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-subtle">Cena pojištění</span>
                  <div className="mt-1">
                    <span className="text-3xl font-extrabold text-brand-700">{formatCzk(monthly)}</span>
                  </div>
                  <span className="text-xs font-medium text-muted">/ měsíčně</span>
                  <div className="mt-1 text-xs text-muted">
                    {formatCzk(total)} za {durationLabel(value.durationMonths)}
                  </div>
                  <Button
                    fullWidth
                    variant={selected ? 'primary' : 'outline'}
                    onClick={() => set('selectedOfferId', offer.id)}
                    className="mt-3"
                  >
                    {selected ? 'Vybráno' : 'Vybrat'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext} disabled={!value.selectedOfferId}>
          Pokračovat
        </Button>
      </div>
    </div>
  );
}
