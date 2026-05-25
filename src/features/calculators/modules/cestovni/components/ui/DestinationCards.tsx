import React from 'react';
import { Check } from 'lucide-react';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export interface DestinationOption {
  value: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}

export interface DestinationCardsProps {
  name: string;
  options: DestinationOption[];
  label?: string;
  className?: string;
  rules?: RegisterOptions;
}

export function DestinationCards({ name, options, label, className = '', rules }: DestinationCardsProps) {
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {options.map((option) => {
                const isSelected = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => field.onChange(option.value)}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 shadow-sm'
                        : 'border-border bg-surface hover:border-border-strong'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center">
                        {option.icon}
                      </div>
                      <h3
                        className={`mb-1 text-sm font-bold leading-tight ${
                          isSelected ? 'text-brand-700' : 'text-foreground'
                        }`}
                      >
                        {option.label}
                      </h3>
                      <p className="text-xs leading-tight text-muted">{option.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors[name] && (
              <p className="mt-2 text-sm text-danger">{errors[name]?.message as string}</p>
            )}
          </>
        )}
      />
    </div>
  );
}

