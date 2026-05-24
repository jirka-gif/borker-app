import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export interface PillOption {
  value: string;
  label: string;
}

export interface PillSelectFieldProps {
  name: string;
  options: PillOption[];
  className?: string;
}

export function PillSelectField({ name, options, className = '' }: PillSelectFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => field.onChange(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                field.value === option.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-muted text-foreground hover:bg-surface-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    />
  );
}

