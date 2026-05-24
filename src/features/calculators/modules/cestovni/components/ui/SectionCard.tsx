import React from 'react';

export interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border p-6 shadow-sm ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-600 mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

