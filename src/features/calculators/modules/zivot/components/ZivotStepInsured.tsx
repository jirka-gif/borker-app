'use client';

import React from 'react';
import { Button, Input, Select } from '@/components/ui';
import {
  CITIZENSHIP_LABELS,
  EMPLOYMENT_LABELS,
  type Citizenship,
  type Employment,
  type ZivotInsuredState,
} from '../data';

interface Props {
  value: ZivotInsuredState;
  onChange: (next: ZivotInsuredState) => void;
  onNext: () => void;
}

export function ZivotStepInsured({ value, onChange, onNext }: Props) {
  const set = <K extends keyof ZivotInsuredState>(key: K, v: ZivotInsuredState[K]) =>
    onChange({ ...value, [key]: v });

  const canContinue = Boolean(value.firstName && value.lastName && value.birthDate);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Údaje o pojištěném</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
          <Input label="Příjmení" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
          <Input label="Datum narození" type="date" value={value.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Jaké je vaše zaměstnání?</h2>
        <div className="mt-4 inline-flex rounded-full bg-surface-muted p-1">
          {(Object.keys(EMPLOYMENT_LABELS) as Employment[]).map((e) => {
            const active = value.employment === e;
            return (
              <button
                key={e}
                type="button"
                onClick={() => set('employment', e)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-600 text-white shadow-sm' : 'text-muted'
                }`}
              >
                {EMPLOYMENT_LABELS[e]}
              </button>
            );
          })}
        </div>

        {value.employment !== 'bez' && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Input label="Profese / zaměstnání" placeholder="Programátor" value={value.profession} onChange={(e) => set('profession', e.target.value)} />
            <Input label="Popis" placeholder="Stručný popis činnosti" value={value.professionDesc} onChange={(e) => set('professionDesc', e.target.value)} />
          </div>
        )}

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Občanství</label>
          <div className="inline-flex rounded-full bg-surface-muted p-1">
            {(Object.keys(CITIZENSHIP_LABELS) as Citizenship[]).map((c) => {
              const active = value.citizenship === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('citizenship', c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'bg-brand-600 text-white shadow-sm' : 'text-muted'
                  }`}
                >
                  {CITIZENSHIP_LABELS[c]}
                </button>
              );
            })}
          </div>
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
