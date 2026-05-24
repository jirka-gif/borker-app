'use client';

import React from 'react';
import { Button, Input, Select } from '@/components/ui';
import { QuestionRow, YesNo } from './controls';
import { SPORT_LEVELS, type ZivotHealthState } from '../data';

interface Props {
  value: ZivotHealthState;
  onChange: (next: ZivotHealthState) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ZivotStepHealth({ value, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof ZivotHealthState>(key: K, v: ZivotHealthState[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      {/* Zdravotní údaje */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Zdravotní údaje</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Výška (cm)" type="number" value={String(value.heightCm || 0)} onChange={(e) => set('heightCm', Number(e.target.value) || 0)} />
          <Input label="Váha (kg)" type="number" value={String(value.weightKg || 0)} onChange={(e) => set('weightKg', Number(e.target.value) || 0)} />
          <Input label="Rok narození" type="number" value={String(value.birthYear)} onChange={(e) => set('birthYear', Number(e.target.value) || 0)} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">Pobíráte invalidní důchod?</span>
          <YesNo value={value.invalidPension} onChange={(v) => set('invalidPension', v)} />
        </div>
      </div>

      {/* Doplňující informace */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Doplňující informace</h2>

        <QuestionRow question="Sportujete?" value={value.doesSport} onChange={(v) => set('doesSport', v)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Hlavní sport" placeholder="Fotbal" value={value.sport} onChange={(e) => set('sport', e.target.value)} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Úroveň</label>
              <Select value={value.sportLevel} onChange={(e) => set('sportLevel', e.target.value)} options={SPORT_LEVELS.map((l) => ({ value: l, label: l }))} />
            </div>
          </div>
        </QuestionRow>

        <QuestionRow question="Léčíte se s něčím dlouhodobě?" value={value.longTermTreatment} onChange={(v) => set('longTermTreatment', v)}>
          <Input label="S čím?" value={value.treatmentWhat} onChange={(e) => set('treatmentWhat', e.target.value)} />
        </QuestionRow>

        <QuestionRow question="Berete pravidelně léky?" value={value.medications} onChange={(v) => set('medications', v)}>
          <Input label="Jaké?" value={value.medicationsWhich} onChange={(e) => set('medicationsWhich', e.target.value)} />
        </QuestionRow>

        <QuestionRow
          question="Byl/a jste v posledních 10 letech v pracovní neschopnosti déle než 14 dní?"
          value={value.sickLeaveHistory}
          onChange={(v) => set('sickLeaveHistory', v)}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Důvod" value={value.sickLeaveReason} onChange={(e) => set('sickLeaveReason', e.target.value)} />
            <Input label="Ve kterém roce?" value={value.sickLeaveYear} onChange={(e) => set('sickLeaveYear', e.target.value)} />
          </div>
        </QuestionRow>

        <div className="flex items-center justify-between gap-3 border-b border-border py-4">
          <span className="text-sm font-semibold text-foreground">Jste momentálně v pracovní neschopnosti?</span>
          <YesNo value={value.currentlySick} onChange={(v) => set('currentlySick', v)} />
        </div>

        <div className="flex items-center justify-between gap-3 py-4">
          <span className="text-sm font-semibold text-foreground">Kouříte? (včetně e-cigaret)</span>
          <YesNo value={value.smoker} onChange={(v) => set('smoker', v)} />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext}>Spočítat nabídky</Button>
      </div>
    </div>
  );
}
