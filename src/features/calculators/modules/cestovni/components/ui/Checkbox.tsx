import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export interface CheckboxProps {
  name: string;
  label: string;
  className?: string;
}

export function Checkbox({ name, label, className = '' }: CheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
          <input
            type="checkbox"
            checked={field.value || false}
            onChange={(e) => field.onChange(e.target.checked)}
            className="w-4 h-4 text-brand-600 border-border rounded focus:ring-brand-500"
          />
          <span className="text-sm text-foreground">{label}</span>
        </label>
      )}
    />
  );
}

