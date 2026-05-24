'use client';

import React from 'react';
import { Pencil, Power, Search, Trash2 } from 'lucide-react';
import { Badge, Button, Input, Modal } from '@/components/ui';
import type { EntityStatus } from '../types';

/* ------------------------------- PageHeader ------------------------------- */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* -------------------------------- StatCard -------------------------------- */

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        {icon && <span className="text-brand-600">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-subtle">{hint}</div>}
    </div>
  );
}

/* ------------------------------- StatusPill ------------------------------- */

export function StatusPill({ status }: { status: EntityStatus }) {
  return (
    <Badge tone={status === 'aktivni' ? 'success' : 'neutral'} dot>
      {status === 'aktivni' ? 'Aktivní' : 'Neaktivní'}
    </Badge>
  );
}

/* -------------------------------- DataTable ------------------------------- */

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  actions,
  empty = 'Žádné záznamy.',
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  actions?: (row: T) => React.ReactNode;
  empty?: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60">
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 text-left font-semibold text-muted ${c.className ?? ''}`}>
                  {c.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold text-muted">Akce</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-muted">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-border last:border-0 ${
                    onRowClick ? 'cursor-pointer hover:bg-surface-muted/50' : ''
                  }`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-middle text-foreground ${c.className ?? ''}`}>
                      {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as React.ReactNode}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------- SearchInput ------------------------------ */

export function SearchInput({ value, onChange, placeholder = 'Hledat…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="w-full sm:max-w-xs">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
      />
    </div>
  );
}

/* ------------------------------- RowActions ------------------------------- */

export function RowActions({
  active,
  onEdit,
  onToggle,
  onDelete,
}: {
  active?: boolean;
  onEdit?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Upravit"
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          title={active ? 'Deaktivovat' : 'Aktivovat'}
          className={`rounded-lg p-1.5 transition-colors hover:bg-surface-muted ${
            active ? 'text-success' : 'text-subtle'
          }`}
        >
          <Power className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Smazat"
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------ ConfirmDialog ----------------------------- */

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = 'Smazat',
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">{message}</p>
    </Modal>
  );
}
