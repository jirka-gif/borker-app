import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  icon?: React.ReactNode;
  helperText?: string;
  wrapperClassName?: string;
}

const baseInputClass = "block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm";

export const Input: React.FC<InputProps> = ({
  label,
  error,
  register,
  icon,
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
          className={`${baseInputClass} ${
            error ? 'border-danger focus:ring-danger focus:border-danger' : ''
          } ${className}`}
          {...register}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtle pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted mt-1">{helperText}</p>}
    </div>
  );
};








