import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export interface CounterProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}

export function Counter({ name, label, min = 0, max = 99, className = '' }: CounterProps) {
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
          const value = Number(field.value) || 0;

          const handleDecrement = () => {
            if (value > min) {
              field.onChange(value - 1);
            }
          };

          const handleIncrement = () => {
            if (value < max) {
              field.onChange(value + 1);
            }
          };

          return (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={value <= min}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed text-muted"
              >
                −
              </button>
              <span className="w-12 text-center font-medium text-foreground">
                {value}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={value >= max}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed text-muted"
              >
                +
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}



