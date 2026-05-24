'use client';

import React, { useState } from 'react';
import { Check, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { Button, Input, Modal, Select } from '@/components/ui';
import { CALCULATORS } from '@/config/calculators';
import { cnbVerifyPerson } from '../integrations';
import {
  COMPANY_ROLE_LABELS,
  DISTRIBUTOR_TYPE_LABELS,
  EXPERTISE_GROUPS,
  type AdminUser,
  type CompanyRole,
  type Company,
  type DistributorType,
} from '../types';

const calcOptions = CALCULATORS.map((c) => ({ value: c.slug, label: c.name }));

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 text-left"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}

interface UserFormModalProps {
  open: boolean;
  value: AdminUser;
  companies: Company[];
  isNew: boolean;
  onChange: (next: AdminUser) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function UserFormModal({ open, value, companies, isNew, onChange, onSubmit, onClose }: UserFormModalProps) {
  const [verifying, setVerifying] = useState(false);
  const set = <K extends keyof AdminUser>(key: K, v: AdminUser[K]) => onChange({ ...value, [key]: v });

  const toggleGroup = (id: number) =>
    set(
      'expertiseGroups',
      value.expertiseGroups.includes(id)
        ? value.expertiseGroups.filter((g) => g !== id)
        : [...value.expertiseGroups, id].sort((a, b) => a - b),
    );

  const verifyCnb = async () => {
    setVerifying(true);
    try {
      const res = await cnbVerifyPerson(value.firstName, value.lastName, value.cnbRegistrationNumber);
      onChange({
        ...value,
        cnbVerified: res.found,
        cnbRegistrationNumber: res.registrationNumber || value.cnbRegistrationNumber,
        cnbAuthorizationType: res.authorizationType || value.cnbAuthorizationType,
        cnbAuthorizationFrom: res.validFrom || value.cnbAuthorizationFrom,
        cnbAuthorizationUntil: res.validUntil || value.cnbAuthorizationUntil,
      });
    } finally {
      setVerifying(false);
    }
  };

  const expired =
    value.cnbAuthorizationUntil && new Date(value.cnbAuthorizationUntil) < new Date();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Nový uživatel' : 'Upravit uživatele'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Uložit
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Osobní údaje */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">Osobní údaje</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Jméno" value={value.firstName} onChange={(e) => set('firstName', e.target.value)} />
            <Input label="Příjmení" value={value.lastName} onChange={(e) => set('lastName', e.target.value)} />
            <Input label="E-mail" type="email" value={value.email} onChange={(e) => set('email', e.target.value)} />
            <Input label="Telefon" type="tel" placeholder="+420 777 123 456" value={value.phone} onChange={(e) => set('phone', e.target.value)} />
            <Input label="Datum narození" type="date" value={value.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
            <div className="sm:col-span-2">
              <Input label="Adresa sídla / bydliště" value={value.address} onChange={(e) => set('address', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Zařazení v platformě */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">Zařazení</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Firma</label>
              <Select
                value={value.companyId}
                onChange={(e) => set('companyId', e.target.value)}
                options={companies.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role v platformě</label>
              <Select
                value={value.role}
                onChange={(e) => set('role', e.target.value as CompanyRole)}
                options={(Object.keys(COMPANY_ROLE_LABELS) as CompanyRole[]).map((r) => ({ value: r, label: COMPANY_ROLE_LABELS[r] }))}
              />
            </div>
            <Input
              label="Provize uživatele (%)"
              type="number"
              hint="Podíl z celkové provize firmy"
              value={String(value.commissionPercent)}
              onChange={(e) => set('commissionPercent', Number(e.target.value))}
            />
          </div>
        </section>

        {/* Regulatorní postavení dle ČNB */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle">Oprávnění dle ČNB</h3>
            <button
              type="button"
              onClick={verifyCnb}
              disabled={verifying || !value.lastName}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-2.5 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-60"
            >
              {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Ověřit v ČNB / JERS
            </button>
          </div>

          {value.cnbVerified && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success-bg px-3 py-2 text-xs text-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Ověřeno v registru ČNB · reg. č. {value.cnbRegistrationNumber || '—'}
            </div>
          )}
          {expired && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              <XCircle className="h-4 w-4" />
              Oprávnění vypršelo ({value.cnbAuthorizationUntil}). Zkontrolujte registraci v ČNB / JERS.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Typ subjektu</label>
              <Select
                value={value.distributorType}
                onChange={(e) => set('distributorType', e.target.value as DistributorType)}
                options={(Object.keys(DISTRIBUTOR_TYPE_LABELS) as DistributorType[]).map((d) => ({ value: d, label: DISTRIBUTOR_TYPE_LABELS[d] }))}
              />
            </div>
            <Input label="IČO (pokud má)" value={value.ico} onChange={(e) => set('ico', e.target.value)} />
            <Input label="Typ oprávnění k činnosti" value={value.cnbAuthorizationType} onChange={(e) => set('cnbAuthorizationType', e.target.value)} />
            <Input label="Registrační číslo ČNB" value={value.cnbRegistrationNumber} onChange={(e) => set('cnbRegistrationNumber', e.target.value)} />
            <Input label="Datum vzniku oprávnění" type="date" value={value.cnbAuthorizationFrom} onChange={(e) => set('cnbAuthorizationFrom', e.target.value)} />
            <Input label="Oprávnění platné do" type="date" value={value.cnbAuthorizationUntil} onChange={(e) => set('cnbAuthorizationUntil', e.target.value)} />
          </div>
        </section>

        {/* Skupiny odbornosti */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">
            Skupiny odbornosti (zák. č. 170/2018 Sb.)
          </h3>
          <div className="space-y-2.5">
            {EXPERTISE_GROUPS.map((g) => (
              <CheckRow
                key={g.id}
                checked={value.expertiseGroups.includes(g.id)}
                onChange={() => toggleGroup(g.id)}
                label={
                  <span>
                    <span className="font-medium">{g.id}.</span> {g.label}
                  </span>
                }
              />
            ))}
            <div className="border-t border-border pt-2.5">
              <CheckRow
                checked={value.canReceivePremium}
                onChange={(v) => set('canReceivePremium', v)}
                label="Oprávnění přijímat pojistné nebo zprostředkovávat plnění"
              />
            </div>
          </div>
        </section>

        {/* Přístup ke kalkulačkám */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">
            Přístup ke kalkulačkám (prázdné = vše)
          </h3>
          <div className="flex flex-wrap gap-2">
            {calcOptions.map((o) => {
              const on = value.allowedCalculators.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    set(
                      'allowedCalculators',
                      on
                        ? value.allowedCalculators.filter((x) => x !== o.value)
                        : [...value.allowedCalculators, o.value],
                    )
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-foreground hover:border-border-strong'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Stav */}
        <section>
          <div className="max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Stav</label>
            <Select
              value={value.status}
              onChange={(e) => set('status', e.target.value as AdminUser['status'])}
              options={[
                { value: 'aktivni', label: 'Aktivní' },
                { value: 'neaktivni', label: 'Neaktivní' },
              ]}
            />
          </div>
        </section>
      </div>
    </Modal>
  );
}
