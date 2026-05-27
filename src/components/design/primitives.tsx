/**
 * UI primitivy sdílené napříč kalkulačkami v novém designu.
 * Zrcadlí komponenty z Claude Design preview (Sec, Field, SegCtl, …)
 * a používají třídy z `src/styles/design/*.css`.
 */

'use client';

import React from 'react';
import { ChevronDown, Download } from 'lucide-react';

/** Sekce s nadpisem (kapitálky), volitelným podtitulkem a obsahem.
 *  Třídy odpovídají Claude Design preview (`.sec`, `.sec-head`, …). */
export function Sec({
  num,
  title,
  sub,
  children,
  dense,
  actions,
  foot,
}: {
  num?: number | string;
  title: string;
  sub?: string;
  children: React.ReactNode;
  dense?: boolean;
  actions?: React.ReactNode;
  foot?: React.ReactNode;
}) {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">
          {num !== undefined && <span className="sec-num">{num}</span>}
          {title}
        </h2>
        {sub && <p className="sec-sub">{sub}</p>}
        {actions && <div className="sec-actions">{actions}</div>}
      </div>
      <div className="sec-body" style={dense ? { paddingTop: 12, gap: 10 } : undefined}>
        {children}
      </div>
      {foot && <div className="sec-foot">{foot}</div>}
    </section>
  );
}

/** Řádek formuláře: popisek + (volitelný) hint + obsah. */
export function Field({
  label,
  required,
  hint,
  children,
  full,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className="field" style={full ? { gridColumn: '1 / -1' } : undefined}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export interface SegOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

/** Segmentový přepínač (pojmenovaný „segctl" v designu). */
export function SegCtl<T extends string>({
  value,
  onChange,
  options,
  className = '',
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegOption<T>[];
  className?: string;
}) {
  return (
    <div className={`segctl ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          data-on={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Checkbox s popiskem (třídy `.cbx` + `.cbx-box` z designu). */
export function Checkbox({
  on,
  onChange,
  children,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => onChange(!on)}
      data-on={on}
      className="cbx"
    >
      <span className="cbx-box">
        {on && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} width="11" height="11">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </button>
  );
}

/** Input s vedlejší akcí (např. „Načíst"). */
export function InputWithAction({
  value,
  placeholder,
  onChange,
  action,
  type = 'text',
}: {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action?: { label: string; onClick: () => void };
  type?: string;
}) {
  return (
    <div className="input-group">
      <input className="input" type={type} value={value || ''} placeholder={placeholder} onChange={onChange} />
      {action && (
        <button type="button" className="btn btn-sm btn-ghost" onClick={action.onClick}>
          <Download className="h-3.5 w-3.5" />
          {action.label}
        </button>
      )}
    </div>
  );
}

/** Tlačítko v designovém stylu. */
export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
}) {
  return (
    <button
      {...rest}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {children}
    </button>
  );
}

/** Účelově menší „chevron" pro rozbalovací sekce. */
export function ChevronToggle({ open }: { open: boolean }) {
  return <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />;
}
