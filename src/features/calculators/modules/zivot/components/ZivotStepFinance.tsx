'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { YesNo } from './controls';
import {
  INCOME_TYPES,
  formatCzk,
  totalExpenses,
  totalIncome,
  type IncomeRow,
  type ZivotFinanceState,
} from '../data';

interface Props {
  value: ZivotFinanceState;
  onChange: (next: ZivotFinanceState) => void;
  onNext: () => void;
  onBack: () => void;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Input
      label={label}
      type="number"
      value={String(value || 0)}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      rightElement={<span className="text-xs text-muted">Kč</span>}
    />
  );
}

export function ZivotStepFinance({ value, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof ZivotFinanceState>(key: K, v: ZivotFinanceState[K]) => onChange({ ...value, [key]: v });

  const updateIncome = (id: string, patch: Partial<IncomeRow>) =>
    set('incomes', value.incomes.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const addIncome = () => set('incomes', [...value.incomes, { id: `inc-${Date.now()}`, type: 'Jiné', amount: 0 }]);
  const removeIncome = (id: string) => set('incomes', value.incomes.filter((i) => i.id !== id));

  return (
    <div className="space-y-6">
      {/* Příjmy */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Příjmy</h2>
        <p className="mt-1 text-sm text-muted">Zadejte všechny měsíční příjmy.</p>
        <div className="mt-4 space-y-3">
          {value.incomes.map((inc) => (
            <div key={inc.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-xl border border-border bg-surface-muted/40 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Typ příjmu</label>
                <Select value={inc.type} onChange={(e) => updateIncome(inc.id, { type: e.target.value })} options={INCOME_TYPES.map((t) => ({ value: t, label: t }))} />
              </div>
              <Input
                label="Měsíční částka (Kč)"
                type="number"
                value={String(inc.amount || 0)}
                onChange={(e) => updateIncome(inc.id, { amount: Number(e.target.value) || 0 })}
              />
              <button
                type="button"
                onClick={() => removeIncome(inc.id)}
                disabled={value.incomes.length <= 1}
                className="mb-1 rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addIncome}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Přidat příjem
          </Button>
        </div>
      </div>

      {/* Výdaje */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Měsíční výdaje</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="Bydlení (hypotéka / nájem)" value={value.expHousing} onChange={(v) => set('expHousing', v)} />
          <NumberField label="Energie" value={value.expEnergy} onChange={(v) => set('expEnergy', v)} />
          <NumberField label="Strava" value={value.expFood} onChange={(v) => set('expFood', v)} />
          <NumberField label="Splátky úvěrů / dluhy" value={value.expDebts} onChange={(v) => set('expDebts', v)} />
          <NumberField label="Životní styl" value={value.expLifestyle} onChange={(v) => set('expLifestyle', v)} />
          <NumberField label="Ostatní" value={value.expOther} onChange={(v) => set('expOther', v)} />
        </div>
      </div>

      {/* Rodinná situace */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Rodinná situace</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Počet dětí" type="number" value={String(value.children || 0)} onChange={(e) => set('children', Number(e.target.value) || 0)} />
          <Input
            label="Odhadované měsíční náklady (Kč)"
            type="number"
            hint="Pokud neuvedete, použije se součet výdajů."
            value={String(value.estimatedCosts || 0)}
            onChange={(e) => set('estimatedCosts', Number(e.target.value) || 0)}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Partner/ka žije ve stejné domácnosti?</span>
          <YesNo value={value.partnerSameHousehold} onChange={(v) => set('partnerSameHousehold', v)} />
        </div>
      </div>

      {/* Souhrn */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-muted/40 px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-subtle">Měsíční příjmy</div>
          <div className="text-xl font-bold text-foreground">{formatCzk(totalIncome(value))}</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface-muted/40 px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-subtle">Měsíční výdaje</div>
          <div className="text-xl font-bold text-foreground">{formatCzk(totalExpenses(value))}</div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext}>Pokračovat</Button>
      </div>
    </div>
  );
}
