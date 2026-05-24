"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, hint, error, leftIcon, rightElement, id, ...props },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            className={cn(
              "h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-foreground transition-colors",
              "placeholder:text-subtle",
              "focus-visible:border-brand-500 focus-visible:shadow-focus",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
              leftIcon && "pl-10",
              rightElement && "pr-11",
              hasError
                ? "border-danger focus-visible:border-danger"
                : "border-border hover:border-border-strong",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {hasError ? (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-sm text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
