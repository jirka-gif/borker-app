import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  helperText?: string;
  wrapperClassName?: string;
}

const baseInputClass = "block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm h-[42px]";

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  register,
  helperText,
  wrapperClassName,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col ${wrapperClassName || 'mb-4'}`}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          className={`${baseInputClass} ${
            error ? 'border-danger focus:ring-danger focus:border-danger' : ''
          } ${className}`}
          {...register}
          {...props}
        />
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted mt-1">{helperText}</p>}
    </div>
  );
};

