import React from 'react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface CTAOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectableCTAButtonsProps {
  name: string;
  options: CTAOption[];
  label?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function SelectableCTAButtons({ name, options, label, className = '', rules }: SelectableCTAButtonsProps) {
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-4 text-sm font-medium transition-colors border-2 text-center ${
                        field.value === option.value
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-surface text-foreground border-border hover:border-brand-300 hover:bg-brand-50'
                      }`}
                    >
                      {option.icon && (
                        <span className="flex h-6 w-6 items-center justify-center">
                          {option.icon}
                        </span>
                      )}
                      <span>{option.label}</span>
                    </button>
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

