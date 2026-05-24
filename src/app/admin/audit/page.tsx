'use client';

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { DataTable, PageHeader, SearchInput, type Column } from '@/features/admin/components/primitives';
import type { AuditAction, AuditEntry } from '@/features/admin/types';
import type { StatusTone } from '@/config/status';

const ACTION_META: Record<AuditAction, { label: string; tone: StatusTone }> = {
  vytvoreno: { label: 'Vytvořeno', tone: 'success' },
  upraveno: { label: 'Upraveno', tone: 'info' },
  smazano: { label: 'Smazáno', tone: 'danger' },
  aktivovano: { label: 'Aktivováno', tone: 'success' },
  deaktivovano: { label: 'Deaktivováno', tone: 'warning' },
  'systemova-akce': { label: 'Systém', tone: 'brand' },
};

export default function AuditPage() {
  const { audit } = useAdminData();
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      audit.filter(
        (a) =>
          a.summary.toLowerCase().includes(query.toLowerCase()) ||
          a.who.toLowerCase().includes(query.toLowerCase()) ||
          a.entity.toLowerCase().includes(query.toLowerCase()),
      ),
    [audit, query],
  );

  const columns: Column<AuditEntry>[] = [
    { key: 'at', label: 'Čas', className: 'whitespace-nowrap', render: (r) => <span className="text-subtle">{r.at}</span> },
    {
      key: 'action',
      label: 'Akce',
      render: (r) => <Badge tone={ACTION_META[r.action].tone}>{ACTION_META[r.action].label}</Badge>,
    },
    { key: 'entity', label: 'Entita' },
    { key: 'summary', label: 'Popis', render: (r) => <span className="text-foreground">{r.summary}</span> },
    { key: 'who', label: 'Kdo', render: (r) => <span className="text-muted">{r.who}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Všechny změny v platformě – kdo, kdy a co změnil."
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat v auditu…" />
      </div>

      <DataTable columns={columns} rows={rows} empty="Žádné záznamy v auditu." />
    </div>
  );
}
