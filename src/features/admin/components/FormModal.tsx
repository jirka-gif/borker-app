'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button, Input, Modal, Select } from '@/components/ui';

export type FieldType = 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox' | 'multiselect';

export interface Field<T> {
  key: keyof T & string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  /** Šířka v 2sloupcovém gridu. */
  full?: boolean;
}

interface FormModalProps<T extends { id: string }> {
  open: boolean;
  title: string;
  fields: Field<T>[];
  value: T;
  onChange: (next: T) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel?: string;
}

export function FormModal<T extends { id: string }>({
  open,
  title,
  fields,
  value,
  onChange,
  onSubmit,
  onClose,
  submitLabel = 'Uložit',
}: FormModalProps<T>) {
  const set = (key: keyof T & string, v: unknown) => onChange({ ...value, [key]: v } as T);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const type = f.type ?? 'text';
          const raw = value[f.key];
          const cls = f.full ? 'sm:col-span-2' : '';

          if (type === 'checkbox') {
            const checked = Boolean(raw);
            return (
              <div key={f.key} className={cls}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => set(f.key, !checked)}
                  className="flex items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="text-sm text-foreground">{f.label}</span>
                </button>
                {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
              </div>
            );
          }

          if (type === 'select') {
            return (
              <div key={f.key} className={cls}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{f.label}</label>
                <Select
                  value={String(raw ?? '')}
                  onChange={(e) => set(f.key, e.target.value)}
                  options={f.options ?? []}
                />
                {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
              </div>
            );
          }

          if (type === 'multiselect') {
            const arr = Array.isArray(raw) ? (raw as string[]) : [];
            const toggle = (v: string) =>
              set(f.key, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
            return (
              <div key={f.key} className={cls}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{f.label}</label>
                <div className="flex flex-wrap gap-2">
                  {(f.options ?? []).map((o) => {
                    const on = arr.includes(o.value);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggle(o.value)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-foreground hover:border-border-strong'
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
              </div>
            );
          }

          if (type === 'textarea') {
            return (
              <div key={f.key} className={cls}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{f.label}</label>
                <textarea
                  value={String(raw ?? '')}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-subtle hover:border-border-strong focus-visible:border-brand-500 focus-visible:shadow-focus"
                />
              </div>
            );
          }

          return (
            <div key={f.key} className={cls}>
              <Input
                label={f.label}
                type={type}
                placeholder={f.placeholder}
                hint={f.hint}
                value={String(raw ?? '')}
                onChange={(e) => set(f.key, type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
