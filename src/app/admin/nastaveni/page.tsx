'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, Plug, ShieldCheck } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { PageHeader } from '@/features/admin/components/primitives';

export default function SettingsPage() {
  const { log } = useAdminData();
  const [platformName, setPlatformName] = useState('Star Insurance Group');
  const [contactEmail, setContactEmail] = useState('info@starinsurance.cz');
  const [currency, setCurrency] = useState('CZK');

  const integrations = [
    { name: 'ARES', desc: 'Načítání firem podle IČO', status: 'Připojeno (mock)', tone: 'success' as const },
    { name: 'ČNB / JERS', desc: 'Ověření oprávnění k distribuci', status: 'Připojeno (mock)', tone: 'success' as const },
    { name: 'Platební brána', desc: 'Online platby pojistného', status: 'Připraveno', tone: 'warning' as const },
    { name: 'E-sign', desc: 'Elektronický podpis dokumentů', status: 'Připraveno', tone: 'warning' as const },
  ];

  const security = [
    { label: 'Tenant isolation (oddělení dat firem)', ready: true },
    { label: 'Role-based access control', ready: true },
    { label: 'Chráněné admin routy', ready: true },
    { label: 'Audit log změn', ready: true },
    { label: 'Vícefaktorové ověření (MFA)', ready: false },
  ];

  return (
    <div>
      <PageHeader title="Nastavení" description="Globální konfigurace platformy a integrace." />

      <div className="space-y-6">
        {/* Obecné */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Obecné</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Název platformy" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
            <Input label="Kontaktní e-mail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <Input label="Výchozí měna" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          <div className="mt-4">
            <Button onClick={() => log('upraveno', 'Nastavení', 'Upraveno globální nastavení platformy')}>
              Uložit nastavení
            </Button>
          </div>
        </div>

        {/* Integrace */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plug className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-foreground">Integrace a registry</h2>
          </div>
          <div className="space-y-3">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{i.name}</p>
                  <p className="text-xs text-muted">{i.desc}</p>
                </div>
                <Badge tone={i.tone}>{i.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Bezpečnost */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-foreground">Bezpečnost</h2>
          </div>
          <div className="space-y-2.5">
            {security.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 text-sm">
                {s.ready ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Clock className="h-4 w-4 text-warning" />
                )}
                <span className="text-foreground">{s.label}</span>
                {!s.ready && <span className="text-xs text-muted">(připravujeme)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Budoucí rozšíření */}
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted/40 p-6">
          <h2 className="text-base font-semibold text-foreground">Připraveno pro budoucí rozšíření</h2>
          <p className="mt-1 text-sm text-muted">
            Architektura počítá s více zeměmi a regulatorními registry, marketplace produktů, API pro
            partnery, CRM integracemi, dokument managementem, workflow a approval flow, e-signem,
            onboardingem distributorů, produkčním reportingem i AI asistentem pro poradce.
          </p>
        </div>
      </div>
    </div>
  );
}
