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
import { SCOPE_LEVEL_LABELS, type Discount, type ScopeLevel } from '@/features/admin/types';

const emptyDiscount: Discount = {
  id: '',
  name: '',
  scope: 'produkt',
  percent: 0,
  target: '',
  status: 'aktivni',
};

const fields: Field<Discount>[] = [
  { key: 'name', label: 'Název slevy', full: true },
  {
    key: 'scope',
    label: 'Úroveň',
    type: 'select',
    options: (Object.keys(SCOPE_LEVEL_LABELS) as ScopeLevel[]).map((s) => ({ value: s, label: SCOPE_LEVEL_LABELS[s] })),
  },
  { key: 'percent', label: 'Sleva (%)', type: 'number' },
  { key: 'target', label: 'Vázáno na (název)', full: true },
  {
    key: 'status',
    label: 'Stav',
    type: 'select',
    options: [
      { value: 'aktivni', label: 'Aktivní' },
      { value: 'neaktivni', label: 'Neaktivní' },
    ],
  },
];

export default function DiscountsPage() {
  const { discounts, saveDiscount, removeDiscount } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Discount | null>(null);
  const [toDelete, setToDelete] = useState<Discount | null>(null);

  const rows = useMemo(
    () => discounts.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
    [discounts, query],
  );

  const columns: Column<Discount>[] = [
    { key: 'name', label: 'Sleva', render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
    { key: 'scope', label: 'Úroveň', render: (r) => `${SCOPE_LEVEL_LABELS[r.scope]} · ${r.target}` },
    { key: 'percent', label: 'Výše', render: (r) => <span className="font-semibold text-foreground">{r.percent} %</span> },
    { key: 'status', label: 'Stav', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Slevy"
        description="Slevy per pojišťovna, produkt, firma i uživatel."
        action={
          <Button onClick={() => setEditing({ ...emptyDiscount, id: genId('ds') })}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat slevu
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat slevu…" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(r) => (
          <RowActions
            active={r.status === 'aktivni'}
            onEdit={() => setEditing(r)}
            onToggle={() => saveDiscount({ ...r, status: r.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
            onDelete={() => setToDelete(r)}
          />
        )}
      />

      {editing && (
        <FormModal
          open
          title={discounts.some((d) => d.id === editing.id) ? 'Upravit slevu' : 'Nová sleva'}
          fields={fields}
          value={editing}
          onChange={setEditing}
          onSubmit={() => saveDiscount(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat slevu"
        message={`Opravdu smazat „${toDelete?.name}"?`}
        onConfirm={() => toDelete && removeDiscount(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
