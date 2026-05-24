'use client';

import React from 'react';
import { PawPrint, ShieldCheck } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  FREQUENCY_SUFFIX,
  formatCzk,
  type PetCoverageState,
  type PetPolicyholderState,
  type PetState,
} from '../data';
import { getPetOffers, perPeriodPrice } from '../offers';

interface PetStepPolicyholderProps {
  pet: PetState;
  coverage: PetCoverageState;
  value: PetPolicyholderState;
  onChange: (next: PetPolicyholderState) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PetStepPolicyholder({
  pet,
  coverage,
  value,
  onChange,
  onNext,
  onBack,
}: PetStepPolicyholderProps) {
  const set = <K extends keyof PetPolicyholderState>(key: K, v: PetPolicyholderState[K]) =>
    onChange({ ...value, [key]: v });

  const offer = getPetOffers(pet.type).find((o) => o.id === coverage.selectedOfferId);
  const period = offer ? perPeriodPrice(offer, coverage) : 0;

  const canContinue = Boolean(
    value.firstName &&
      value.lastName &&
      value.email &&
      value.phone &&
      value.street &&
      value.city &&
      value.zip,
  );

  return (
    <div className="space-y-6">
      {/* Rekapitulace výběru */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Mazlíček</h3>
            </div>
            <div className="text-sm font-medium text-foreground">
              {pet.name || '—'} <span className="font-normal text-muted">({pet.breed || '—'})</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Vybrané pojištění</h3>
            </div>
            {offer ? (
              <div className="text-sm">
                <div className="font-medium text-foreground">
                  {offer.insurer} – {offer.productName}
                </div>
                <div className="mt-0.5 text-muted">
                  {formatCzk(period)} {FREQUENCY_SUFFIX[coverage.frequency]}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted">—</div>
            )}
          </div>
        </div>
      </div>

      {/* Pojistník */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Pojistník</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno" placeholder="Jan" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
          <Input label="Příjmení" placeholder="Novák" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
          <Input label="Datum narození" type="date" value={value.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
          <Input
            label="Rodné číslo"
            placeholder="850620/1234"
            hint="Formát YYMMDD/XXXX"
            value={value.personalId}
            onChange={(e) => set('personalId', e.target.value)}
          />
          <Input label="E-mail" type="email" placeholder="jan.novak@email.cz" value={value.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Telefon" type="tel" placeholder="+420 777 123 456" value={value.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
      </div>

      {/* Adresa */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Adresa</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Ulice" placeholder="Václavské náměstí" value={value.street} onChange={(e) => set('street', e.target.value)} />
          <Input label="Číslo popisné" placeholder="1" value={value.houseNumber} onChange={(e) => set('houseNumber', e.target.value)} />
          <Input label="Město" placeholder="Praha" value={value.city} onChange={(e) => set('city', e.target.value)} />
          <Input label="PSČ" placeholder="11000" value={value.zip} onChange={(e) => set('zip', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext} disabled={!canContinue}>
          Pokračovat na záznam
        </Button>
      </div>
    </div>
  );
}
