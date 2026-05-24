'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
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
import {
  COMMISSION_TYPE_LABELS,
  SCOPE_LEVEL_LABELS,
  type Commission,
  type CommissionType,
  type ScopeLevel,
} from '@/features/admin/types';

const emptyCommission: Commission = {
  id: '',
  name: '',
  type: 'fixni-procento',
  scope: 'produkt',
  value: 0,
  target: '',
  status: 'aktivni',
};

const fields: Field<Commission>[] = [
  { key: 'name', label: 'Název', full: true },
  {
    key: 'type',
    label: 'Typ provize',
    type: 'select',
    options: (Object.keys(COMMISSION_TYPE_LABELS) as CommissionType[]).map((t) => ({ value: t, label: COMMISSION_TYPE_LABELS[t] })),
  },
  {
    key: 'scope',
    label: 'Úroveň',
    type: 'select',
    options: (Object.keys(SCOPE_LEVEL_LABELS) as ScopeLevel[]).map((s) => ({ value: s, label: SCOPE_LEVEL_LABELS[s] })),
  },
  { key: 'value', label: 'Hodnota (% nebo Kč)', type: 'number' },
  { key: 'target', label: 'Vázáno na (název)', full: true, placeholder: 'Kooperativa / Pojištění vozidel / Frenkee…' },
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

function valueLabel(c: Commission): string {
  if (c.type === 'fixni-castka' || c.type === 'produkcni-bonus') return `${c.value.toLocaleString('cs-CZ')} Kč`;
  return `${c.value} %`;
}

export default function CommissionsPage() {
  const { commissions, saveCommission, removeCommission } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Commission | null>(null);
  const [toDelete, setToDelete] = useState<Commission | null>(null);

  const rows = useMemo(
    () => commissions.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [commissions, query],
  );

  const columns: Column<Commission>[] = [
    { key: 'name', label: 'Provize', render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
    { key: 'type', label: 'Typ', render: (r) => <Badge tone="brand">{COMMISSION_TYPE_LABELS[r.type]}</Badge> },
    { key: 'scope', label: 'Úroveň', render: (r) => `${SCOPE_LEVEL_LABELS[r.scope]} · ${r.target}` },
    { key: 'value', label: 'Hodnota', render: (r) => <span className="font-semibold text-foreground">{valueLabel(r)}</span> },
    { key: 'status', label: 'Stav', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Provize"
        description="Provize per pojišťovna, produkt, firma i uživatel."
        action={
          <Button onClick={() => setEditing({ ...emptyCommission, id: genId('cm') })}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat provizi
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat provizi…" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(r) => (
          <RowActions
            active={r.status === 'aktivni'}
            onEdit={() => setEditing(r)}
            onToggle={() => saveCommission({ ...r, status: r.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
            onDelete={() => setToDelete(r)}
          />
        )}
      />

      {editing && (
        <FormModal
          open
          title={commissions.some((c) => c.id === editing.id) ? 'Upravit provizi' : 'Nová provize'}
          fields={fields}
          value={editing}
          onChange={setEditing}
          onSubmit={() => saveCommission(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat provizi"
        message={`Opravdu smazat „${toDelete?.name}"?`}
        onConfirm={() => toDelete && removeCommission(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
