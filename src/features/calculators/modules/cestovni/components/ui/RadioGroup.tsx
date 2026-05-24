import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  label?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function RadioGroup({ name, options, label, className = '', rules }: RadioGroupProps) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                    className="w-4 h-4 text-brand-600 border-border focus:ring-brand-500"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
            {errors[name] && (
              <p className="mt-1 text-sm text-danger">{errors[name]?.message as string}</p>
            )}
          </>
        )}
      />
    </div>
  );
}

