import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

/**
 * Stepper sjednocený s kalkulačkou majetku: aktivní krok má vínový gradient,
 * kolečka spojuje průběžná čára vedená jejich středem.
 */
export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="relative w-full px-4">
      {/* Průběžná spojovací čára vedená středem koleček */}
      <div className="pointer-events-none absolute left-8 right-8 top-4 h-0.5 bg-border-strong" />
      <ol className="relative flex w-full items-start justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;

          return (
            <li
              key={index}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => onStepClick && onStepClick(stepNumber)}
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
                className={`mt-1.5 whitespace-nowrap text-xs font-medium ${
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
};
