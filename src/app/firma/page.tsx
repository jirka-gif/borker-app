'use client';

import React from 'react';
import Link from 'next/link';
import { Percent, ShieldCheck, Users } from 'lucide-react';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { useFirmaCompany } from '@/features/admin/FirmaCompanyProvider';
import { PageHeader, StatCard, StatusPill } from '@/features/admin/components/primitives';

export default function FirmaDashboardPage() {
  const company = useFirmaCompany();
  const { users, companyCommissions } = useAdminData();

  if (!company) {
    return <p className="text-sm text-muted">Firma nenalezena.</p>;
  }

  const myUsers = users.filter((u) => u.companyId === company.id);
  const myCommissions = companyCommissions.filter((c) => c.companyId === company.id);

  return (
    <div>
      <PageHeader title={company.name} description="Administrace firmy – přehled." />

      {/* Karta firmy */}
      <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-foreground">{company.name}</div>
            <div className="text-sm text-muted">IČO {company.ico} · {company.legalForm}</div>
            <div className="text-sm text-muted">{company.address}</div>
            <div className="text-sm text-muted">{company.email} · {company.phone}</div>
          </div>
          <div className="text-right">
            <StatusPill status={company.status} />
            <div className="mt-2 text-xs text-muted">
              Odpovědná osoba: <span className="text-foreground">{company.responsiblePerson}</span>
            </div>
            {company.cnbValid && (
              <div className="mt-1 text-xs text-success">ČNB ověřeno · do {company.cnbAuthorizationUntil}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Uživatelé" value={myUsers.length} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Spolupracující pojišťovny" value={company.insurerIds?.length ?? 0} icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="Nastavené provize" value={myCommissions.length} icon={<Percent className="h-5 w-5" />} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-foreground">Co můžete spravovat</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { href: '/firma/uzivatele', label: 'Uživatelé firmy', icon: Users },
            { href: '/firma/pojistovny', label: 'Pojišťovny ke sjednání', icon: ShieldCheck },
            { href: '/firma/provize', label: 'Provize', icon: Percent },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-600 hover:bg-brand-50"
            >
              <Icon className="h-4 w-4 text-brand-600" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
