'use client';

import React from 'react';
import { Calendar, Check, GraduationCap, Info, User, UserRound } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import {
  CARE_TYPES,
  INSURED_TYPES,
  type ForeignerInputState,
  type InsuredType,
} from '../data';

interface ForeignerStepDetailsProps {
  value: ForeignerInputState;
  onChange: (next: ForeignerInputState) => void;
  onNext: () => void;
}

const TYPE_ICONS: Record<InsuredType, typeof User> = {
  zena: UserRound,
  muz: User,
  student: GraduationCap,
};

export function ForeignerStepDetails({ value, onChange, onNext }: ForeignerStepDetailsProps) {
  const set = <K extends keyof ForeignerInputState>(key: K, v: ForeignerInputState[K]) =>
    onChange({ ...value, [key]: v });

  const canContinue = Boolean(value.birthDate && value.startDate);

  return (
    <div className="space-y-6">
      {/* Vybrané pojištění */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Vybrané pojištění</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CARE_TYPES.map((c) => {
            const active = value.careType === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => set('careType', c.value)}
                className={`rounded-xl border p-5 text-center transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <span
                  className={`mx-auto mb-2 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active ? 'border-brand-600 bg-brand-600' : 'border-border-strong'
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-surface" />}
                </span>
                <div className="text-sm font-semibold text-foreground">{c.title}</div>
                <div className="mt-1 text-sm text-muted">{c.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typ pojištění */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Typ pojištění</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {INSURED_TYPES.map((t) => {
            const active = value.insuredType === t.value;
            const Icon = TYPE_ICONS[t.value];
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('insuredType', t.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <Icon className={`h-7 w-7 ${active ? 'text-brand-600' : 'text-muted'}`} />
                <span className={`text-sm font-medium ${active ? 'text-brand-700' : 'text-foreground'}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {value.insuredType === 'zena' && (
          <button
            type="button"
            role="checkbox"
            aria-checked={value.pregnancyPlanned}
            onClick={() => set('pregnancyPlanned', !value.pregnancyPlanned)}
            className="mt-5 flex w-full items-center gap-3 border-t border-border pt-4 text-left"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                value.pregnancyPlanned ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
              }`}
            >
              {value.pregnancyPlanned && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              Jste těhotná, nebo plánujete otěhotnět v době trvání pojištění?
              <Info className="h-4 w-4 text-subtle" />
            </span>
          </button>
        )}
      </div>

      {/* Datumy + zdraví */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Datum narození"
            type="date"
            value={value.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
            rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
          />
          <Input
            label="Počátek pojištění"
            type="date"
            value={value.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
          />
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={value.professionalAthlete}
            onClick={() => set('professionalAthlete', !value.professionalAthlete)}
            className="flex w-full items-center gap-3 text-left"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                value.professionalAthlete ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
              }`}
            >
              {value.professionalAthlete && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="text-sm text-foreground">Jste profesionální sportovec?</span>
          </button>

          <button
            type="button"
            role="checkbox"
            aria-checked={value.underTreatment}
            onClick={() => set('underTreatment', !value.underTreatment)}
            className="flex w-full items-center gap-3 text-left"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                value.underTreatment ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
              }`}
            >
              {value.underTreatment && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              Léčíte se? <Info className="h-4 w-4 text-subtle" />
            </span>
          </button>
        </div>

        <div className="mt-4 max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Jste zdráv?</label>
          <Select
            value={value.healthy ? 'ano' : 'ne'}
            onChange={(e) => set('healthy', e.target.value === 'ano')}
            options={[
              { value: 'ano', label: 'Ano' },
              { value: 'ne', label: 'Ne' },
            ]}
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
