import React from 'react';
import { UseFormRegisterReturn, useWatch } from 'react-hook-form';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
  horizontal?: boolean;
  /** Roztáhne segmenty na celou šířku (stejně široké). */
  fullWidth?: boolean;
  control?: any;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  register,
  error,
  className = '',
  horizontal = false,
  fullWidth = false,
  control,
}) => {
  const currentValue = control ? useWatch({ control, name }) : undefined;

  if (horizontal) {
    return (
      <div className={`flex flex-col mb-4 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-foreground mb-3">
            {label}
          </label>
        )}
        <div
          className={`${
            fullWidth ? 'flex w-full' : 'inline-flex flex-wrap'
          } items-center gap-1 rounded-full bg-surface-muted p-1`}
        >
          {options.map((option) => {
            const isChecked = currentValue === option.value;
            return (
              <label
                key={option.value}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm cursor-pointer transition-all border ${
                  fullWidth ? 'flex-1 text-center' : ''
                } ${
                  isChecked
                    ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register}
                  className="sr-only"
                  checked={isChecked}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
        {error && <p className="text-danger text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="radio"
              value={option.value}
              {...register}
              className="sr-only peer"
            />
            <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
              <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};



