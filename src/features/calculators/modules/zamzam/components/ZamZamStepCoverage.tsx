'use client';

import React from 'react';
import { Calendar, CarFront, Info, Truck } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  COVERAGE_TIERS,
  DRIVING_OPTIONS,
  SPOLUUCAST_OPTIONS,
  formatCzk,
  type DrivingStatus,
  type Spoluucast,
  type ZamZamInputState,
} from '../data';

interface Props {
  value: ZamZamInputState;
  onChange: (next: ZamZamInputState) => void;
  onNext: () => void;
}

const DRIVING_ICONS: Record<DrivingStatus, React.ComponentType<{ className?: string }>> = {
  neridim: CarFront,
  obcas: CarFront,
  ridic: Truck,
};

export function ZamZamStepCoverage({ value, onChange, onNext }: Props) {
  const set = <K extends keyof ZamZamInputState>(key: K, v: ZamZamInputState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      {/* Řízení v práci */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          Řídíte v práci? <Info className="h-4 w-4 text-subtle" />
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DRIVING_OPTIONS.map((o) => {
            const active = value.driving === o.value;
            const Icon = DRIVING_ICONS[o.value];
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => set('driving', o.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <Icon className={`h-7 w-7 ${active ? 'text-brand-600' : 'text-muted'}`} />
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    active ? 'border-brand-600' : 'border-border-strong'
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                </span>
                <span className={`text-sm font-medium ${active ? 'text-brand-700' : 'text-foreground'}`}>
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spoluúčast */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          Spoluúčast <Info className="h-4 w-4 text-subtle" />
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
          {SPOLUUCAST_OPTIONS.map((s) => {
            const active = value.spoluucast === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => set('spoluucast', s.value as Spoluucast)}
                className={`rounded-xl border p-5 text-center transition-colors ${
                  active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                }`}
              >
                <div className="text-2xl font-bold text-brand-600">{s.value} %</div>
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="mt-1 text-xs text-muted">({s.note})</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Výše krytí */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Na jakou výši se chcete pojistit?</h2>
        <div className="mt-3 flex gap-3 rounded-xl border border-info/20 bg-info-bg px-4 py-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" />
          <p className="text-sm text-muted">
            Doporučuji <strong className="text-foreground">4,5násobek průměrného hrubého platu</strong>. Na to má
            tvůj zaměstnavatel nárok dle zákona.
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-2 border-b border-border bg-surface-muted/50 px-4 py-2 text-xs font-semibold text-muted">
            <span>Krytí</span>
            <span>Hrubý měsíční plat</span>
            <span className="text-right">Roční pojistné</span>
          </div>
          {COVERAGE_TIERS.map((t) => {
            const active = value.coverage === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('coverage', t.value)}
                className={`grid w-full grid-cols-[1fr_1.2fr_1fr] items-center gap-2 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 ${
                  active ? 'bg-brand-50' : 'hover:bg-surface-muted/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? 'border-brand-600' : 'border-border-strong'
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                  </span>
                  <span className="font-medium text-foreground">{formatCzk(t.value)}</span>
                </span>
                <span className="text-muted">{t.salaryRange}</span>
                <span className="text-right font-semibold text-foreground">{formatCzk(t.annual)} / rok</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Počátek */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Počátek pojištění</h2>
        <div className="mt-4 max-w-xs">
          <Input
            type="date"
            value={value.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Pokračovat</Button>
      </div>
    </div>
  );
}
