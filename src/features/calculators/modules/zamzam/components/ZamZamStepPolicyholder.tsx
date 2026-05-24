'use client';

import React from 'react';
import { Calendar, Check, ShieldCheck, Umbrella, UserRound } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import {
  DRIVING_OPTIONS,
  SPOLUUCAST_OPTIONS,
  formatCzk,
  tierFor,
  type ZamZamInputState,
  type ZamZamPolicyholderState,
} from '../data';

const COUNTRIES = ['Česká republika', 'Slovensko', 'Polsko', 'Německo', 'Rakousko'];

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 text-left"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}

interface Props {
  input: ZamZamInputState;
  onInputChange: (next: ZamZamInputState) => void;
  value: ZamZamPolicyholderState;
  onChange: (next: ZamZamPolicyholderState) => void;
  onNext: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export function ZamZamStepPolicyholder({ input, onInputChange, value, onChange, onNext, onBack, onEdit }: Props) {
  const set = <K extends keyof ZamZamPolicyholderState>(key: K, v: ZamZamPolicyholderState[K]) =>
    onChange({ ...value, [key]: v });

  const tier = tierFor(input.coverage);
  const drivingLabel = DRIVING_OPTIONS.find((d) => d.value === input.driving)?.label ?? '—';
  const spoluLabel = SPOLUUCAST_OPTIONS.find((s) => s.value === input.spoluucast)?.label ?? '';

  const canContinue = Boolean(value.firstName && value.lastName && value.email && value.phone && value.street && value.city);

  return (
    <div className="space-y-6">
      {/* Shrnutí */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Shrnutí</h2>
          <button type="button" onClick={onEdit} className="text-sm font-medium text-brand-600 hover:underline">
            Upravit
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Krytí</div>
              <div className="text-sm font-medium text-foreground">{formatCzk(input.coverage)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Řízení v práci</div>
              <div className="text-sm font-medium text-foreground">{drivingLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-xs text-muted">Spoluúčast</div>
              <div className="text-sm font-medium text-foreground">{input.spoluucast} % – min. 5 000 Kč</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs text-muted">Částka</div>
              <div className="text-sm font-bold text-foreground">{tier ? formatCzk(tier.annual) : '—'} / rok</div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-2xs text-subtle">{spoluLabel}</div>
      </div>

      {/* Souhlas se skórováním */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <Checkbox
          checked={input.scoringConsent}
          onChange={(v) => onInputChange({ ...input, scoringConsent: v })}
          label="Souhlasím se skórováním"
        />
      </div>

      {/* Údaje o pojištěném */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Údaje o pojištěném</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
          <Input label="Příjmení" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
          {value.noBirthNumber ? (
            <Input label="Datum narození" type="date" value={value.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
          ) : (
            <Input label="Rodné číslo" placeholder="000000/0000" value={value.birthNumber} onChange={(e) => set('birthNumber', e.target.value)} />
          )}
          <div className="flex items-end pb-2">
            <Checkbox checked={value.noBirthNumber} onChange={(v) => set('noBirthNumber', v)} label="Nemám rodné číslo (jsem cizinec)." />
          </div>
          <Input label="Kontaktní telefon" type="tel" placeholder="+420 777 123 456" value={value.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="E-mail" type="email" value={value.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      </div>

      {/* Adresa */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Adresa pojištěného</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Ulice" value={value.street} onChange={(e) => set('street', e.target.value)} />
          <Input label="Číslo popisné" value={value.houseNumber} onChange={(e) => set('houseNumber', e.target.value)} />
          <Input label="PSČ" value={value.zip} onChange={(e) => set('zip', e.target.value)} />
          <Input label="Město" value={value.city} onChange={(e) => set('city', e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Stát</label>
            <Select
              value={value.country}
              onChange={(e) => set('country', e.target.value)}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>
      </div>

      {/* Údaje do smlouvy */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Zadejte potřebné údaje do smlouvy</h2>
        <div className="mt-4 space-y-3">
          <Checkbox
            checked={value.differentMailing}
            onChange={(v) => set('differentMailing', v)}
            label="Chci zadat jinou korespondenční adresu."
          />
          {value.differentMailing && (
            <Input
              placeholder="Korespondenční adresa (ulice, č.p., město, PSČ)"
              value={value.mailingAddress}
              onChange={(e) => set('mailingAddress', e.target.value)}
            />
          )}
          <Checkbox
            checked={value.differentPolicyholder}
            onChange={(v) => set('differentPolicyholder', v)}
            label="Pojištění sjednávám pro někoho – zadat jiného pojistníka."
          />
          {value.differentPolicyholder && (
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Pojistník</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Jméno a příjmení" value={value.phName} onChange={(e) => set('phName', e.target.value)} />
                <Input label="E-mail" type="email" value={value.phEmail} onChange={(e) => set('phEmail', e.target.value)} />
                <Input label="Telefon" type="tel" value={value.phPhone} onChange={(e) => set('phPhone', e.target.value)} />
              </div>
            </div>
          )}
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
