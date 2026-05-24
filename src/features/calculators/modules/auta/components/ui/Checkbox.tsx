import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  register,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start gap-2 mb-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register}
          {...props}
          className="sr-only peer"
        />
        <div className="h-4 w-4 rounded border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] peer-checked:bg-[#A82844] transition-colors flex-shrink-0 mt-0.5">
          <svg
            className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-sm text-foreground">{label}</span>
      </label>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

