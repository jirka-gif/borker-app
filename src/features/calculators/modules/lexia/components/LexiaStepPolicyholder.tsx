'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  annualPrice,
  formatCzk,
  pillarsFor,
  type LexiaInputState,
  type LexiaPolicyholderState,
} from '../data';

interface Props {
  input: LexiaInputState;
  value: LexiaPolicyholderState;
  onChange: (next: LexiaPolicyholderState) => void;
  onNext: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export function LexiaStepPolicyholder({ input, value, onChange, onNext, onBack, onEdit }: Props) {
  const set = <K extends keyof LexiaPolicyholderState>(key: K, v: LexiaPolicyholderState[K]) =>
    onChange({ ...value, [key]: v });

  const isB2B = input.segment === 'b2b';
  const selectedPillars = pillarsFor(input.segment).filter((p) => p.mandatory || input.selected[p.id]);

  const canContinue = isB2B
    ? Boolean(value.companyName && value.ico && value.email && value.phone)
    : Boolean(value.firstName && value.lastName && value.email && value.phone);

  return (
    <div className="space-y-6">
      {/* Shrnutí */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Právní ochrana Lexia · {isB2B ? 'Podnikatelé & firmy' : input.subject === 'domacnost' ? 'Domácnost' : 'Jednotlivec'}
              </div>
              <div className="mt-0.5 text-xs text-muted">{selectedPillars.map((p) => p.title).join(', ')}</div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-foreground">{formatCzk(annualPrice(input))}</div>
            <div className="text-xs text-muted">/ ročně</div>
            <button type="button" onClick={onEdit} className="mt-1 text-xs font-medium text-brand-600 hover:underline">
              Upravit
            </button>
          </div>
        </div>
      </div>

      {/* Pojistník */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{isB2B ? 'Údaje o firmě' : 'Údaje o pojištěném'}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isB2B ? (
            <>
              <Input label="Název společnosti" value={value.companyName} onChange={(e) => set('companyName', e.target.value)} />
              <Input label="IČO" value={value.ico} onChange={(e) => set('ico', e.target.value)} />
            </>
          ) : (
            <>
              <Input label="Jméno" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
              <Input label="Příjmení" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
              <Input label="Rodné číslo" placeholder="000000/0000" value={value.birthNumber} onChange={(e) => set('birthNumber', e.target.value)} />
            </>
          )}
          <Input label="Kontaktní telefon" type="tel" placeholder="+420 777 123 456" value={value.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="E-mail" type="email" value={value.email} onChange={(e) => set('email', e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Adresa" placeholder="Ulice, č.p., město, PSČ" value={value.address} onChange={(e) => set('address', e.target.value)} />
          </div>
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
