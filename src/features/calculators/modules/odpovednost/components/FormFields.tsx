'use client';

import React from 'react';
import { Check, Info, Search } from 'lucide-react';
import { Input } from '@/components/ui';
import type { AddressValue } from '../data';

const STATES = ['Česká republika', 'Slovensko', 'Polsko', 'Německo', 'Rakousko'];

/** Wine-stylovaný checkbox sjednocený s designem hubu. */
export function Checkbox({
  checked,
  onChange,
  label,
  info,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  info?: boolean;
}) {
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
      <span className="flex items-center gap-1.5 text-sm text-foreground">
        {label}
        {info && <Info className="h-4 w-4 text-subtle" />}
      </span>
    </button>
  );
}

/** Stát s lupou – stejný vizuál jako na frenkee.cz. */
export function StateSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-border bg-surface pl-10 pr-9 text-sm text-foreground transition-colors hover:border-border-strong focus-visible:border-brand-500 focus-visible:shadow-focus"
      >
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AddressFields({
  value,
  onChange,
}: {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
}) {
  const set = (key: keyof AddressValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });
  return (
    <div className="space-y-4">
      <Input label="Ulice" placeholder="Václavské náměstí" value={value.street} onChange={set('street')} />
      <Input label="Číslo popisné" placeholder="1" value={value.houseNumber} onChange={set('houseNumber')} />
      <Input label="Město" placeholder="Praha" value={value.city} onChange={set('city')} />
      <Input label="PSČ" placeholder="11000" value={value.zip} onChange={set('zip')} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Stát</label>
        <StateSelect value={value.state} onChange={(state) => onChange({ ...value, state })} />
      </div>
    </div>
  );
}

/** Pomocná funkce pro zobrazení adresy v jednom řádku (souhrny, PDF). */
export function formatAddress(a: AddressValue): string {
  const line = [a.street, a.houseNumber].filter(Boolean).join(' ');
  const city = [a.zip, a.city].filter(Boolean).join(' ');
  return [line, city, a.state].filter(Boolean).join(', ');
}
