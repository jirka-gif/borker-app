import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  register?: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
  control?: any;
}

export function SelectField({ 
  label,
  errorMessage,
  wrapperClassName,
  className,
  children,
  register,
  options,
  control,
  ...props
}: SelectFieldProps) {
  const isDisabled = props.disabled;

  return (
    <div className={wrapperClassName ?? "flex flex-col gap-1"}>
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...register}
          {...props}
          className={`
            block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle
            focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition
            hover:border-border-strong
            ${isDisabled ? 'bg-surface-muted text-subtle cursor-not-allowed' : ''}
            ${className || ''}
          `}
        >
          {options ? (
            options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
            ))
          ) : (
            children
          )}
        </select>

        {/* chevron icon */}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-subtle"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {errorMessage && (
        <p className="text-xs text-danger mt-0.5">{errorMessage}</p>
      )}
    </div>
  );
}

