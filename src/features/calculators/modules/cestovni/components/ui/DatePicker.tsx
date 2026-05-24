import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface DatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function DatePicker({ name, label, placeholder, className = '', rules }: DatePickerProps) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            <div className="relative">
              <input
                type="date"
                {...field}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-brand-500 focus:border-brand-500 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
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

