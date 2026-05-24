import React from 'react';
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden">
              {options.map((option, index) => {
                const isSelected = field.value === option.value;
                // Střídající se pozadí: 0=šedé, 1=šedé, 2=bílé, 3=šedé
                const bgColor = isSelected 
                  ? 'bg-surface' 
                  : (index === 0 || index === 1 || index === 3)
                    ? 'bg-surface-muted' 
                    : 'bg-surface';
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={`p-5 border-r border-border last:border-r-0 transition-all text-left ${bgColor} ${
                      isSelected ? 'ring-2 ring-brand-600 ring-inset' : 'hover:bg-surface-muted'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex items-center justify-center h-14 w-14">
                        {option.icon}
                      </div>
                      <h3 className="font-bold text-foreground mb-1 text-sm leading-tight">
                        {option.label}
                      </h3>
                      <p className="text-xs text-muted leading-tight">
                        {option.subtitle}
                      </p>
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

