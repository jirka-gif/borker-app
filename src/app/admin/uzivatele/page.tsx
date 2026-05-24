'use client';

import React, { useMemo, useState } from 'react';
import { KeyRound, Plus } from 'lucide-react';
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
import { UserFormModal } from '@/features/admin/components/UserFormModal';
import { COMPANY_ROLE_LABELS, DISTRIBUTOR_TYPE_LABELS, type AdminUser } from '@/features/admin/types';

const emptyUser: AdminUser = {
  id: '',
  companyId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'poradce',
  status: 'aktivni',
  commissionPercent: 50,
  allowedCalculators: [],
  distributorType: 'zamestnanec',
  ico: '',
  birthDate: '',
  address: '',
  cnbAuthorizationType: 'Zápis do registru',
  cnbRegistrationNumber: '',
  cnbAuthorizationFrom: '',
  cnbAuthorizationUntil: '',
  expertiseGroups: [],
  canReceivePremium: false,
  cnbVerified: false,
};

export default function UsersPage() {
  const { users, companies, saveUser, removeUser, log } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? '—';

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [users, query],
  );

  const isExpired = (u: AdminUser) =>
    Boolean(u.cnbAuthorizationUntil) && new Date(u.cnbAuthorizationUntil) < new Date();

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      label: 'Uživatel',
      render: (r) => (
        <div>
          <div className="font-medium text-foreground">
            {r.firstName} {r.lastName}
          </div>
          <div className="text-xs text-subtle">{r.email}</div>
        </div>
      ),
    },
    { key: 'company', label: 'Firma', render: (r) => companyName(r.companyId) },
    {
      key: 'distributor',
      label: 'Typ / role',
      render: (r) => (
        <div className="space-y-1">
          <Badge tone="brand">{COMPANY_ROLE_LABELS[r.role]}</Badge>
          <div className="text-xs text-subtle">{DISTRIBUTOR_TYPE_LABELS[r.distributorType]}</div>
        </div>
      ),
    },
    {
      key: 'cnb',
      label: 'ČNB',
      render: (r) =>
        isExpired(r) ? (
          <Badge tone="danger">Vypršelo</Badge>
        ) : r.cnbVerified ? (
          <Badge tone="success">Ověřeno · do {r.cnbAuthorizationUntil || '—'}</Badge>
        ) : (
          <Badge tone="warning">Neověřeno</Badge>
        ),
    },
    { key: 'status', label: 'Stav', render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Uživatelé"
        description="Správa uživatelů, jejich oprávnění dle ČNB a přístupů."
        action={
          <Button onClick={() => setEditing({ ...emptyUser, id: genId('u'), companyId: companies[0]?.id ?? '' })}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat uživatele
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat jméno nebo e-mail…" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={(r) => (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              title="Resetovat heslo"
              onClick={() => log('systemova-akce', 'Uživatel', `Reset hesla – odeslán odkaz na ${r.email}`)}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <KeyRound className="h-4 w-4" />
            </button>
            <RowActions
              active={r.status === 'aktivni'}
              onEdit={() => setEditing(r)}
              onToggle={() => saveUser({ ...r, status: r.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
              onDelete={() => setToDelete(r)}
            />
          </div>
        )}
      />

      {editing && (
        <UserFormModal
          open
          value={editing}
          companies={companies}
          isNew={!users.some((u) => u.id === editing.id)}
          onChange={setEditing}
          onSubmit={() => saveUser(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat uživatele"
        message={`Opravdu smazat „${toDelete?.firstName} ${toDelete?.lastName}"?`}
        onConfirm={() => toDelete && removeUser(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
