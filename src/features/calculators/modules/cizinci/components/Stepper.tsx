'use client';

import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

/** Stepper sjednocený s ostatními kalkulačkami. */
export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
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
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-500 text-white'
                    : 'bg-surface-muted text-muted'
                }`}
              >
                {stepNumber}
              </div>
              <span
                className={`mt-1.5 max-w-[7rem] text-center text-xs font-medium ${
                  isActive ? 'text-brand-600' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
