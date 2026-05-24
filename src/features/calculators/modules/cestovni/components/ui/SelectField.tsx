import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function SelectField({
  name,
  options,
  label,
  placeholder,
  className = '',
  rules,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
              <select
                {...field}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none cursor-pointer pr-10"
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-subtle"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors[name] && (
              <p className="mt-1 text-sm text-danger">
                {errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}




