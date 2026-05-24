'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Percent, Plus } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
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
import { NewCompanyModal } from '@/features/admin/components/NewCompanyModal';
import { CompanyCommissionsModal } from '@/features/admin/components/CompanyCommissionsModal';
import type { Company } from '@/features/admin/types';

const editFields: Field<Company>[] = [
  { key: 'name', label: 'Název', full: true },
  { key: 'ico', label: 'IČO' },
  { key: 'dic', label: 'DIČ' },
  { key: 'legalForm', label: 'Právní forma', full: true },
  { key: 'address', label: 'Adresa', full: true },
  { key: 'email', label: 'Kontaktní e-mail', type: 'email' },
  { key: 'phone', label: 'Telefon', type: 'tel' },
  { key: 'responsiblePerson', label: 'Odpovědná osoba' },
  { key: 'responsibleEmail', label: 'E-mail odpovědné osoby', type: 'email' },
  { key: 'commissionPercent', label: 'Celková provize firmy (%)', type: 'number' },
  { key: 'cnbRegistrationNumber', label: 'Registrační číslo ČNB' },
  { key: 'cnbAuthorizationType', label: 'Typ oprávnění' },
  { key: 'cnbValid', label: 'Platná registrace ČNB' },
  {
    key: 'status',
    label: 'Stav firmy',
    type: 'select',
    options: [
      { value: 'aktivni', label: 'Aktivní' },
      { value: 'neaktivni', label: 'Neaktivní' },
    ],
  },
];

export default function CompaniesPage() {
  const { companies, users, saveCompany, removeCompany } = useAdminData();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [toDelete, setToDelete] = useState<Company | null>(null);
  const [commissionsFor, setCommissionsFor] = useState<Company | null>(null);

  const userCount = (id: string) => users.filter((u) => u.companyId === id).length;

  const rows = useMemo(
    () =>
      companies.filter(
        (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.ico.includes(query),
      ),
    [companies, query],
  );

  const columns: Column<Company>[] = [
    {
      key: 'name',
      label: 'Firma',
      render: (r) => (
        <div>
          <div className="font-medium text-foreground">{r.name}</div>
          <div className="text-xs text-subtle">IČO {r.ico} · {r.responsiblePerson}</div>
        </div>
      ),
    },
    { key: 'users', label: 'Uživatelé', render: (r) => `${userCount(r.id)}` },
    { key: 'insurers', label: 'Pojišťovny', render: (r) => `${r.insurerIds?.length ?? 0}` },
    {
      key: 'cnb',
      label: 'ČNB',
      render: (r) =>
        r.cnbValid ? (
          <Badge tone="success">Ověřeno</Badge>
        ) : (
          <Badge tone="warning">Neověřeno</Badge>
        ),
    },
    { key: 'status', label: 'Stav', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Firmy"
        description="Makléřské společnosti (tenanty) na platformě."
        action={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Založit firmu
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat firmu nebo IČO…" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(r) => (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              title="Otevřít administraci firmy"
              onClick={() => router.push(`/firma?company=${r.id}`)}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Provize firmy"
              onClick={() => setCommissionsFor(r)}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <Percent className="h-4 w-4" />
            </button>
            <RowActions
              active={r.status === 'aktivni'}
              onEdit={() => setEditing(r)}
              onToggle={() => saveCompany({ ...r, status: r.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
              onDelete={() => setToDelete(r)}
            />
          </div>
        )}
      />

      <NewCompanyModal open={newOpen} onClose={() => setNewOpen(false)} />
      <CompanyCommissionsModal company={commissionsFor} onClose={() => setCommissionsFor(null)} />

      {editing && (
        <FormModal
          open
          title="Upravit firmu"
          fields={editFields}
          value={editing}
          onChange={setEditing}
          onSubmit={() => saveCompany(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat firmu"
        message={`Opravdu smazat „${toDelete?.name}"? Smažou se i vazby na uživatele.`}
        onConfirm={() => toDelete && removeCompany(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
