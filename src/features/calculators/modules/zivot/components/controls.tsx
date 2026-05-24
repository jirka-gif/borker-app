'use client';

import React from 'react';

export function Stepper({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="relative w-full px-4">
      <div className="pointer-events-none absolute left-8 right-8 top-4 h-0.5 bg-border-strong" />
      <ol className="relative flex w-full items-start justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          return (
            <li
              key={index}
              className={`flex flex-col items-center ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick?.(stepNumber)}
            >
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isActive ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-500 text-white' : 'bg-surface-muted text-muted'
                }`}
              >
                {stepNumber}
              </div>
              <span className={`mt-1.5 max-w-[6rem] text-center text-2xs font-medium ${isActive ? 'text-brand-600' : 'text-muted'}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Segmentovaný přepínač Ne / Ano. */
export function YesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="inline-flex rounded-full bg-surface-muted p-1">
      {[
        { v: false, label: 'Ne' },
        { v: true, label: 'Ano' },
      ].map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              active ? 'bg-brand-600 text-white shadow-sm' : 'text-muted'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Řádek otázka + Ano/Ne. */
export function QuestionRow({
  question,
  value,
  onChange,
  children,
}: {
  question: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{question}</span>
        <YesNo value={value} onChange={onChange} />
      </div>
      {value && children && <div className="mt-3">{children}</div>}
    </div>
  );
}
