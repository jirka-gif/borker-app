import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface PillSelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register?: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
}

export function PillSelectField({
  register,
  options,
  children,
  className = '',
  ...props
}: PillSelectFieldProps) {
  return (
    <div className="relative inline-flex">
      <select
        {...register}
        {...props}
        className={`
          appearance-none rounded-full border border-[#A82844] bg-surface px-3 py-1.5 pr-8 text-xs md:text-sm text-[#A82844] font-medium
          focus:outline-none focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0
          hover:bg-brand-50 transition-colors
          ${className}
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
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg
          className="h-3 w-3 text-[#A82844]"
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
  );
}

