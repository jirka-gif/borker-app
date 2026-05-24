'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAdminData, genId } from '@/features/admin/AdminDataProvider';
import {
  ConfirmDialog,
  DataTable,
  PageHeader,
  RowActions,
  SearchInput,
  StatusPill,
  type Column,
} from '@/features/admin/components/primitives';
import { FormModal, type Field } from '@/features/admin/components/FormModal';
import type { Insurer } from '@/features/admin/types';

const emptyInsurer: Insurer = {
  id: '',
  name: '',
  tradeName: '',
  logoText: '',
  ico: '',
  address: '',
  web: '',
  email: '',
  phone: '',
  status: 'aktivni',
  note: '',
};

const fields: Field<Insurer>[] = [
  { key: 'name', label: 'Název', full: true },
  { key: 'tradeName', label: 'Obchodní název' },
  { key: 'logoText', label: 'Zkratka loga', placeholder: 'KO' },
  { key: 'ico', label: 'IČO' },
  { key: 'web', label: 'Web' },
  { key: 'email', label: 'E-mail', type: 'email' },
  { key: 'phone', label: 'Telefon', type: 'tel' },
  { key: 'address', label: 'Adresa', full: true },
  {
    key: 'status',
    label: 'Stav',
    type: 'select',
    options: [
      { value: 'aktivni', label: 'Aktivní' },
      { value: 'neaktivni', label: 'Neaktivní' },
    ],
  },
  { key: 'note', label: 'Interní poznámka', type: 'textarea', full: true },
];

export default function InsurersPage() {
  const { insurers, products, saveInsurer, removeInsurer } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Insurer | null>(null);
  const [toDelete, setToDelete] = useState<Insurer | null>(null);

  const rows = useMemo(
    () =>
      insurers.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.ico.includes(query),
      ),
    [insurers, query],
  );

  const productCount = (id: string) => products.filter((p) => p.insurerId === id).length;

  const columns: Column<Insurer>[] = [
    {
      key: 'name',
      label: 'Pojišťovna',
      render: (r) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-brand-700">
            {r.logoText}
          </span>
          <div>
            <div className="font-medium text-foreground">{r.tradeName}</div>
            <div className="text-xs text-subtle">{r.name}</div>
          </div>
        </div>
      ),
    },
    { key: 'ico', label: 'IČO' },
    { key: 'products', label: 'Produkty', render: (r) => `${productCount(r.id)}` },
    { key: 'status', label: 'Stav', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Pojišťovny"
        description="Správa pojišťoven a jejich produktů."
        action={
          <Button onClick={() => setEditing({ ...emptyInsurer, id: genId('ins') })}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat pojišťovnu
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat název nebo IČO…" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(r) => (
          <RowActions
            active={r.status === 'aktivni'}
            onEdit={() => setEditing(r)}
            onToggle={() => saveInsurer({ ...r, status: r.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
            onDelete={() => setToDelete(r)}
          />
        )}
      />

      {editing && (
        <FormModal
          open
          title={insurers.some((i) => i.id === editing.id) ? 'Upravit pojišťovnu' : 'Nová pojišťovna'}
          fields={fields}
          value={editing}
          onChange={setEditing}
          onSubmit={() => saveInsurer(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat pojišťovnu"
        message={`Opravdu smazat „${toDelete?.tradeName}"? Tuto akci nelze vrátit.`}
        onConfirm={() => toDelete && removeInsurer(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
