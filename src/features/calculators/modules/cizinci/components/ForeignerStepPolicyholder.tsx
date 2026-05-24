'use client';

import React, { useEffect } from 'react';
import { CalendarDays, Check, ShieldCheck, Umbrella } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import {
  CARE_TYPES,
  NATIONALITIES,
  formatCzk,
  type ForeignerInputState,
  type ForeignerPolicyholderState,
  type ForeignerSelectionState,
} from '../data';
import { getForeignerOffers, totalPrice } from '../offers';

interface ForeignerStepPolicyholderProps {
  input: ForeignerInputState;
  selection: ForeignerSelectionState;
  value: ForeignerPolicyholderState;
  onChange: (next: ForeignerPolicyholderState) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ForeignerStepPolicyholder({
  input,
  selection,
  value,
  onChange,
  onNext,
  onBack,
}: ForeignerStepPolicyholderProps) {
  const set = <K extends keyof ForeignerPolicyholderState>(key: K, v: ForeignerPolicyholderState[K]) =>
    onChange({ ...value, [key]: v });

  // Předvyplnění data narození z kroku 1.
  useEffect(() => {
    if (!value.birthDate && input.birthDate) set('birthDate', input.birthDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const offer = getForeignerOffers().find((o) => o.id === selection.selectedOfferId);
  const total = offer ? totalPrice(offer, input, selection.durationMonths) : 0;
  const careLabel = CARE_TYPES.find((c) => c.value === input.careType)?.title ?? '—';

  const canContinue = Boolean(
    value.firstName && value.lastName && value.email && value.phone && value.passportNumber && value.addressCz,
  );

  return (
    <div className="space-y-6">
      {/* Rekapitulace */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          <div className="flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Typ</div>
              <div className="text-sm font-medium text-foreground">{careLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Délka pojištění</div>
              <div className="text-sm font-medium text-foreground">{selection.durationMonths} měsíců</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Částka</div>
              <div className="text-sm font-bold text-foreground">{formatCzk(total)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Údaje o pojištěném */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Údaje o pojištěném</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
          <Input label="Příjmení" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
          <Input label="Datum narození" type="date" value={value.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
          <Input label="Kontaktní telefon" type="tel" placeholder="+420 777 123 456" value={value.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="E-mail" type="email" placeholder="jmeno@email.cz" value={value.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Číslo pasu" value={value.passportNumber} onChange={(e) => set('passportNumber', e.target.value)} />
          <Input label="Pas platný od" type="date" value={value.passportValidFrom} onChange={(e) => set('passportValidFrom', e.target.value)} />
          <Input label="Pas platný do" type="date" value={value.passportValidTo} onChange={(e) => set('passportValidTo', e.target.value)} />
          <Input label="Místo narození" value={value.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Státní příslušnost</label>
            <Select
              value={value.nationality}
              onChange={(e) => set('nationality', e.target.value)}
              options={NATIONALITIES.map((n) => ({ value: n, label: n }))}
            />
          </div>
        </div>
      </div>

      {/* Adresa v ČR */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Adresa v ČR</h2>
        <div className="mt-4">
          <Input
            placeholder="Ulice, č.p., město, PSČ"
            value={value.addressCz}
            onChange={(e) => set('addressCz', e.target.value)}
          />
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={value.differentPolicyholder}
          onClick={() => set('differentPolicyholder', !value.differentPolicyholder)}
          className="mt-4 flex items-center gap-3 text-left"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              value.differentPolicyholder ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
            }`}
          >
            {value.differentPolicyholder && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-sm text-foreground">Pojistník je jiná osoba než pojištěný</span>
        </button>

        {value.differentPolicyholder && (
          <div className="mt-4 rounded-xl border border-border bg-surface-muted p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Pojistník</h3>

            {/* Právnická osoba */}
            <button
              type="button"
              role="checkbox"
              aria-checked={value.phIsCompany}
              onClick={() => set('phIsCompany', !value.phIsCompany)}
              className="mb-4 flex items-center gap-3 text-left"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  value.phIsCompany ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
                }`}
              >
                {value.phIsCompany && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="text-sm text-foreground">Právnická osoba</span>
            </button>

            {value.phIsCompany ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Název společnosti" value={value.phCompanyName} onChange={(e) => set('phCompanyName', e.target.value)} />
                <Input label="IČ" value={value.phIco} onChange={(e) => set('phIco', e.target.value)} />
                <Input label="Kontaktní telefon" type="tel" value={value.phPhone} onChange={(e) => set('phPhone', e.target.value)} />
                <Input label="E-mail" type="email" value={value.phEmail} onChange={(e) => set('phEmail', e.target.value)} />
                <div className="sm:col-span-2">
                  <Input label="Adresa / sídlo" placeholder="Ulice, č.p., město, PSČ" value={value.phAddress} onChange={(e) => set('phAddress', e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Jméno" value={value.phFirstName} onChange={(e) => set('phFirstName', e.target.value)} />
                  <Input label="Příjmení" value={value.phLastName} onChange={(e) => set('phLastName', e.target.value)} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Pohlaví</label>
                  <div className="grid max-w-xs grid-cols-2 gap-3">
                    {(
                      [
                        { v: 'muz', label: 'Muž' },
                        { v: 'zena', label: 'Žena' },
                      ] as const
                    ).map(({ v, label }) => {
                      const active = value.phSex === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => set('phSex', v)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                            active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-foreground hover:border-border-strong'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {value.phNoBirthNumber ? (
                  <Input label="Datum narození" type="date" value={value.phBirthDate} onChange={(e) => set('phBirthDate', e.target.value)} />
                ) : (
                  <Input label="Rodné číslo" placeholder="850620/1234" value={value.phBirthNumber} onChange={(e) => set('phBirthNumber', e.target.value)} />
                )}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={value.phNoBirthNumber}
                  onClick={() => set('phNoBirthNumber', !value.phNoBirthNumber)}
                  className="flex items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      value.phNoBirthNumber ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
                    }`}
                  >
                    {value.phNoBirthNumber && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="text-sm text-foreground">Pojistník nemá rodné číslo (cizinec)</span>
                </button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Kontaktní telefon" type="tel" value={value.phPhone} onChange={(e) => set('phPhone', e.target.value)} />
                  <Input label="E-mail" type="email" value={value.phEmail} onChange={(e) => set('phEmail', e.target.value)} />
                </div>
                <Input label="Adresa" placeholder="Ulice, č.p., město, PSČ" value={value.phAddress} onChange={(e) => set('phAddress', e.target.value)} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Státní příslušnost</label>
                  <Select
                    value={value.phNationality}
                    onChange={(e) => set('phNationality', e.target.value)}
                    options={NATIONALITIES.map((n) => ({ value: n, label: n }))}
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
