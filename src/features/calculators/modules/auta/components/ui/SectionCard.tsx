import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <section className={`bg-surface border border-border rounded-2xl shadow-sm px-6 py-6 md:px-8 md:py-7 ${className}`}>
      <header className="mb-4 md:mb-5">
        <h2 className="text-base md:text-lg font-semibold text-[#A82844]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs md:text-sm text-muted">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
};








