'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { useFirmaCompany } from '@/features/admin/FirmaCompanyProvider';
import { PageHeader } from '@/features/admin/components/primitives';

export default function FirmaSettingsPage() {
  const company = useFirmaCompany();
  const { saveCompany } = useAdminData();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (company) {
      setEmail(company.email);
      setPhone(company.phone);
      setAddress(company.address);
    }
  }, [company]);

  if (!company) return <p className="text-sm text-muted">Firma nenalezena.</p>;

  return (
    <div>
      <PageHeader title="Nastavení firmy" description="Kontaktní údaje a regulatorní informace." />

      {/* Kontaktní údaje (editovatelné) */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Kontaktní údaje</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Kontaktní e-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefon" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Adresa" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => saveCompany({ ...company, email, phone, address })}>Uložit změny</Button>
        </div>
      </div>

      {/* Regulatorní údaje (z registru, jen pro čtení) */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">Údaje z registru ČNB</h2>
        <dl className="text-sm">
          {[
            ['Název', company.name],
            ['IČO', company.ico],
            ['DIČ', company.dic],
            ['Právní forma', company.legalForm],
            ['Typ subjektu', company.cnbSubjectType],
            ['Typ oprávnění', company.cnbAuthorizationType],
            ['Registrační číslo', company.cnbRegistrationNumber],
            ['Oprávnění od', company.cnbAuthorizationFrom],
            ['Oprávnění platné do', company.cnbAuthorizationUntil],
            ['Přeshraniční služby', company.cnbCrossBorder.join('; ')],
            ['Pokuty a sankce', company.cnbSanctions],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-0.5 border-b border-border py-2 last:border-0 sm:grid-cols-[220px_1fr] sm:gap-3"
            >
              <dt className="font-medium text-muted">{label}</dt>
              <dd className="text-foreground">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
