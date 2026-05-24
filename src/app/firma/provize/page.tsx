'use client';

import React from 'react';
import { useFirmaCompany } from '@/features/admin/FirmaCompanyProvider';
import { PageHeader } from '@/features/admin/components/primitives';
import { CompanyCommissionsPanel } from '@/features/admin/components/CompanyCommissionsPanel';

export default function FirmaCommissionsPage() {
  const company = useFirmaCompany();
  if (!company) return <p className="text-sm text-muted">Firma nenalezena.</p>;

  return (
    <div>
      <PageHeader
        title="Provize"
        description="Provize firmy per pojišťovna a produkt – celková i vyplácená poradcům."
      />
      <CompanyCommissionsPanel companyId={company.id} />
    </div>
  );
}
