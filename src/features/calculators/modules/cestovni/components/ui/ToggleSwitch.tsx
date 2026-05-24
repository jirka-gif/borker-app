import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export interface ToggleSwitchProps {
  name: string;
  label: string;
  className?: string;
}

export function ToggleSwitch({ name, label, className = '' }: ToggleSwitchProps) {
  const { control } = useFormContext();

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = field.value === true;

          return (
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${!value ? 'text-foreground' : 'text-subtle'}`}>
                Ne
              </span>
              <button
                type="button"
                onClick={() => field.onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  value ? 'bg-brand-600' : 'bg-border-strong'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${value ? 'text-foreground' : 'text-subtle'}`}>
                Ano
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
