import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface InputProps {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function Input({ name, label, type = 'text', placeholder, className = '', rules }: InputProps) {
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
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={field.value || ''}
              onChange={(e) => {
                if (type === 'number') {
                  field.onChange(e.target.value ? Number(e.target.value) : '');
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
            {errors[name] && (
              <p className="mt-1 text-sm text-danger">{errors[name]?.message as string}</p>
            )}
          </>
        )}
      />
    </div>
  );
}

