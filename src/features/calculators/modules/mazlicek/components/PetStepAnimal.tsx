'use client';

import React, { useMemo, useState } from 'react';
import { Cat, Check, Dog, Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { breedsFor, type PetState, type PetType } from '../data';

interface PetStepAnimalProps {
  value: PetState;
  onChange: (next: PetState) => void;
  onNext: () => void;
}

export function PetStepAnimal({ value, onChange, onNext }: PetStepAnimalProps) {
  const [query, setQuery] = useState('');
  const set = <K extends keyof PetState>(key: K, v: PetState[K]) =>
    onChange({ ...value, [key]: v });

  const breeds = breedsFor(value.type);
  const filtered = useMemo(
    () => breeds.filter((b) => b.toLowerCase().includes(query.trim().toLowerCase())),
    [breeds, query],
  );

  const chooseType = (t: PetType) => {
    // Změna druhu vynuluje plemeno (jiný číselník).
    onChange({ ...value, type: t, breed: '' });
    setQuery('');
  };

  const canContinue = Boolean(value.breed && value.name && value.birthDate && value.chipNumber);

  return (
    <div className="space-y-6">
      {/* Druh mazlíčka */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Druh mazlíčka</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(
            [
              { t: 'pes' as PetType, label: 'Pes', Icon: Dog },
              { t: 'kocka' as PetType, label: 'Kočka', Icon: Cat },
            ]
          ).map(({ t, label, Icon }) => {
            const active = value.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => chooseType(t)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <Icon className={`h-7 w-7 ${active ? 'text-brand-600' : 'text-muted'}`} />
                <span className={`text-sm font-medium ${active ? 'text-brand-700' : 'text-foreground'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plemeno */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Plemeno</h2>
        <div className="mt-4">
          <Input
            label="Vyhledat plemeno"
            placeholder="Začněte psát…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <p className="mt-1.5 text-xs text-muted">
            {filtered.length} z {breeds.length} dostupných plemen
          </p>
          <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-border">
            {filtered.map((b) => {
              const selected = value.breed === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => set('breed', b)}
                  className={`flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 ${
                    selected ? 'bg-brand-50 font-medium text-brand-700' : 'text-foreground hover:bg-surface-muted'
                  }`}
                >
                  {b}
                  {selected && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted">Žádné plemeno neodpovídá hledání.</div>
            )}
          </div>
        </div>
      </div>

      {/* Údaje o mazlíčkovi */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Údaje o mazlíčkovi</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Jméno mazlíčka"
            placeholder="Rex"
            value={value.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <Input
            label="Datum narození"
            type="date"
            value={value.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Pohlaví</label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { v: 'samecek', label: 'Sameček' },
                { v: 'samicka', label: 'Samička' },
              ] as const
            ).map(({ v, label }) => {
              const active = value.sex === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('sex', v)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-foreground hover:border-border-strong'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={value.neutered}
          onClick={() => set('neutered', !value.neutered)}
          className="mt-4 flex items-center gap-3 text-left"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              value.neutered ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
            }`}
          >
            {value.neutered && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-sm text-foreground">Mazlíček je kastrovaný / vykastrovaná</span>
        </button>

        <div className="mt-4">
          <Input
            label="Číslo čipu"
            placeholder="900000000000001"
            hint="15 číslic ISO 11784/11785, najdete v očkovacím průkazu"
            value={value.chipNumber}
            onChange={(e) => set('chipNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canContinue}>
          Pokračovat
        </Button>
      </div>
    </div>
  );
}
