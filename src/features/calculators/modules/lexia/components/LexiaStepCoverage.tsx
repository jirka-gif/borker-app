'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  annualPrice,
  formatCzk,
  pillarsFor,
  type LexiaInputState,
  type Segment,
  type Subject,
} from '../data';

interface Props {
  value: LexiaInputState;
  onChange: (next: LexiaInputState) => void;
  onNext: () => void;
}

function SelectCard({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border p-4 text-left transition-colors ${
        active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-sm font-semibold ${active ? 'text-brand-700' : 'text-foreground'}`}>{title}</span>
        {active && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
      </div>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </button>
  );
}

export function LexiaStepCoverage({ value, onChange, onNext }: Props) {
  const pillars = pillarsFor(value.segment);
  const total = annualPrice(value);

  const setSegment = (s: Segment) => onChange({ ...value, segment: s });
  const setSubject = (s: Subject) => onChange({ ...value, subject: s });
  const togglePillar = (id: string) =>
    onChange({ ...value, selected: { ...value.selected, [id]: !value.selected[id] } });

  return (
    <div className="space-y-6">
      {/* 1. Pro koho */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">1. Pro koho právní ochrana je</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <SelectCard active={value.segment === 'b2c'} title="Jednotlivci & domácnosti" subtitle="B2C, rodiny" onClick={() => setSegment('b2c')} />
          <SelectCard active={value.segment === 'b2b'} title="Podnikatelé & firmy" subtitle="B2B, OSVČ → korporáty" onClick={() => setSegment('b2b')} />
        </div>
      </div>

      {/* 2. Sám / domácnost – pouze B2C */}
      {value.segment === 'b2c' && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">2. Sám / domácnost</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <SelectCard active={value.subject === 'jednotlivec'} title="Jednotlivec" subtitle="1 osoba" onClick={() => setSubject('jednotlivec')} />
            <SelectCard active={value.subject === 'domacnost'} title="Domácnost" subtitle="až 5 členů rodiny" onClick={() => setSubject('domacnost')} />
          </div>
        </div>
      )}

      {/* 3. Co krýt – pilíře */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {value.segment === 'b2c' ? '3.' : '2.'} Co všechno chceš krýt
          </h2>
          <p className="mt-1 text-sm text-muted">
            Pilíř I je povinný — zahrnuje právníka 24/7 a ALL-RISK garanci. Další pilíře jsou volitelné dle tvých rizik.
          </p>
          <div className="mt-4 space-y-3">
            {pillars.map((p) => {
              const on = p.mandatory || Boolean(value.selected[p.id]);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => !p.mandatory && togglePillar(p.id)}
                  disabled={p.mandatory}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    on ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-border-strong'
                  } ${p.mandatory ? 'cursor-default' : ''}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      on ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong'
                    }`}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{p.title}</span>
                      {p.mandatory && (
                        <span className="rounded-md bg-brand-600 px-1.5 py-0.5 text-2xs font-semibold uppercase text-white">
                          Povinné
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{p.desc}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-foreground">
                    {formatCzk(p.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      {/* Souhrn ceny */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-brand-600/20 bg-brand-50 px-6 py-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-subtle">Cena pojistného</div>
          <div className="mt-0.5">
            <span className="text-2xl font-bold text-foreground">{formatCzk(total)}</span>
            <span className="text-sm font-medium text-muted"> / ročně</span>
          </div>
          <div className="mt-0.5 text-xs text-subtle">Bez závazku · Kalkulace dle tarifů Lexia</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Pokračovat</Button>
      </div>
    </div>
  );
}
