'use client';

import React, { useEffect, useMemo } from 'react';
import { Calendar, Check, ShieldPlus } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  ADDONS,
  FREQUENCY_SUFFIX,
  PAYMENT_FREQUENCIES,
  formatCzk,
  type PetCoverageState,
  type PetState,
} from '../data';
import { getPetOffers, perPeriodPrice, annualTotal } from '../offers';

interface PetStepOffersProps {
  pet: PetState;
  value: PetCoverageState;
  onChange: (next: PetCoverageState) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PetStepOffers({ pet, value, onChange, onNext, onBack }: PetStepOffersProps) {
  const offers = useMemo(() => getPetOffers(pet.type), [pet.type]);
  const set = <K extends keyof PetCoverageState>(key: K, v: PetCoverageState[K]) =>
    onChange({ ...value, [key]: v });

  // Výchozí výběr nejlevnější nabídky.
  useEffect(() => {
    if (!value.selectedOfferId || !offers.some((o) => o.id === value.selectedOfferId)) {
      onChange({ ...value, selectedOfferId: offers[0]?.id ?? '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers]);

  const toggleAddon = (id: string) =>
    onChange({ ...value, addons: { ...value.addons, [id]: !value.addons[id] } });

  const suffix = FREQUENCY_SUFFIX[value.frequency];

  return (
    <div className="space-y-6">
      {/* Nabídky */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Vyberte si pojištění</h2>
        <p className="mb-4 text-sm text-muted">Ceny zohledňují zvolená připojištění i frekvenci platby.</p>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {offers.map((offer) => {
            const selected = value.selectedOfferId === offer.id;
            const period = perPeriodPrice(offer, value);
            const annual = annualTotal(offer, value);
            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => set('selectedOfferId', offer.id)}
                className={`flex flex-col rounded-2xl border bg-surface p-5 text-left shadow-sm transition-all ${
                  selected ? 'border-brand-600 shadow-card-brand' : 'border-border hover:border-border-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xs font-medium uppercase tracking-wide text-subtle">
                      {offer.insurer}
                    </div>
                    <div className="text-base font-semibold text-foreground">{offer.productName}</div>
                  </div>
                  <span
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? 'border-brand-600 bg-brand-600' : 'border-border-strong'
                    }`}
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-surface" />}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {offer.coverages.map((cov) => (
                    <div key={cov.label} className="flex items-center justify-between gap-3 border-b border-border py-1.5 text-sm last:border-0">
                      <span className="flex items-center gap-1.5 text-muted">
                        {cov.included && <Check className="h-3.5 w-3.5 text-brand-600" />}
                        {cov.label}
                      </span>
                      <span className="font-medium text-foreground">{cov.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-border pt-3 text-center">
                  <div className="text-xl font-bold text-foreground">
                    {formatCzk(period)}
                    <span className="text-sm font-medium text-muted"> {suffix}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted">{formatCzk(annual)} ročně</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doplňková pojištění */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldPlus className="h-5 w-5 text-brand-600" />
          <h2 className="text-base font-semibold text-foreground">Doplňková pojištění</h2>
        </div>
        <div className="mt-4 space-y-3">
          {ADDONS.map((a) => {
            const on = Boolean(value.addons[a.id]);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAddon(a.id)}
                className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                  on ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      on ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong'
                    }`}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{a.desc}</p>
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-foreground">
                  + {formatCzk(a.price)}
                  <span className="text-xs font-normal text-muted"> / rok</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frekvence + začátek */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Frekvence platby</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {PAYMENT_FREQUENCIES.map((f) => {
              const active = value.frequency === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => set('frequency', f.value)}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-foreground hover:border-border-strong'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Začátek pojištění</h2>
          <div className="mt-4">
            <Input
              type="date"
              value={value.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
            />
          </div>
        </div>
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
