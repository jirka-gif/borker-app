'use client';

import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Download, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { Badge, Button, Input, Select } from '@/components/ui';
import { Modal } from '@/components/ui';
import { useAdminData, genId } from '../AdminDataProvider';
import { aresLookup, cnbVerifyCompany, type AresResult, type CnbCompanyResult } from '../integrations';
import { COMPANY_ROLE_LABELS, EXPERTISE_GROUPS, type Company, type CompanyRole } from '../types';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-0.5 border-b border-border py-2 last:border-0 sm:grid-cols-[200px_1fr] sm:gap-3">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

export function NewCompanyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { insurers, saveCompany, saveUser, log } = useAdminData();

  const [step, setStep] = useState(1);
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);
  const [ico, setIco] = useState('');
  const [responsibleFirstName, setResponsibleFirstName] = useState('');
  const [responsibleLastName, setResponsibleLastName] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [responsiblePhone, setResponsiblePhone] = useState('');
  const [responsibleRole, setResponsibleRole] = useState<CompanyRole>('firma-admin');
  const [ares, setAres] = useState<AresResult | null>(null);
  const [cnb, setCnb] = useState<CnbCompanyResult | null>(null);
  const [loadingAres, setLoadingAres] = useState(false);
  const [loadingCnb, setLoadingCnb] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setStep(1);
    setIco('');
    setResponsibleFirstName('');
    setResponsibleLastName('');
    setResponsibleEmail('');
    setResponsiblePhone('');
    setResponsibleRole('firma-admin');
    setSelectedInsurers([]);
    setAres(null);
    setCnb(null);
    setError('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleAres = async () => {
    setError('');
    setLoadingAres(true);
    setAres(null);
    setCnb(null);
    try {
      setAres(await aresLookup(ico));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Načtení z ARES selhalo.');
    } finally {
      setLoadingAres(false);
    }
  };

  // Po vstupu na krok 2 automaticky ověř v ČNB / JERS.
  useEffect(() => {
    if (step === 2 && ares && !cnb && !loadingCnb) {
      setLoadingCnb(true);
      cnbVerifyCompany(ares.ico, ares.name)
        .then((res) => {
          setCnb(res);
          setSelectedInsurers(res.related.insurerIds);
        })
        .finally(() => setLoadingCnb(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleCreate = () => {
    if (!ares) return;
    const responsibleName = `${responsibleFirstName} ${responsibleLastName}`.trim();
    const company: Company = {
      id: genId('co'),
      name: ares.name,
      ico: ares.ico,
      dic: ares.dic,
      legalForm: ares.legalForm,
      address: ares.address,
      email: responsibleEmail,
      phone: '',
      status: 'aktivni',
      createdAt: new Date().toISOString().slice(0, 10),
      responsiblePerson: responsibleName,
      responsibleEmail,
      commissionPercent: 0,
      cnbSubjectType: cnb?.subjectType ?? '',
      cnbRegistrationNumber: cnb?.registrationNumber ?? '',
      cnbAuthorizationType: cnb?.authorizationType ?? '',
      cnbAuthorizationFrom: cnb?.validFrom ?? '',
      cnbAuthorizationUntil: cnb?.validUntil ?? '',
      cnbExpertiseGroups: cnb?.expertiseGroups ?? [],
      cnbCrossBorder: cnb?.crossBorder ?? [],
      cnbSanctions: cnb?.sanctions ?? '',
      cnbValid: cnb?.active ?? false,
      insurerIds: selectedInsurers,
    };
    saveCompany(company);

    saveUser({
      id: genId('u'),
      companyId: company.id,
      firstName: responsibleFirstName,
      lastName: responsibleLastName,
      email: responsibleEmail,
      phone: responsiblePhone,
      role: responsibleRole,
      status: 'aktivni',
      commissionPercent: 100,
      allowedCalculators: [],
      distributorType: 'vazany-zastupce',
      ico: company.ico,
      birthDate: '',
      address: company.address,
      cnbAuthorizationType: company.cnbAuthorizationType,
      cnbRegistrationNumber: company.cnbRegistrationNumber,
      cnbAuthorizationFrom: company.cnbAuthorizationFrom,
      cnbAuthorizationUntil: company.cnbAuthorizationUntil,
      expertiseGroups: company.cnbExpertiseGroups,
      canReceivePremium: true,
      cnbVerified: company.cnbValid,
    });

    log('systemova-akce', 'Pozvánka', `Odeslány přístupové údaje (dočasné heslo) na ${responsibleEmail}`);
    close();
  };

  const STEPS = ['IČO a ARES', 'Registr ČNB / JERS', 'Odpovědná osoba', 'Pojišťovny'];

  const footer =
    step === 1 ? (
      <>
        <Button variant="secondary" onClick={close}>
          Zrušit
        </Button>
        <Button disabled={!ares} onClick={() => setStep(2)}>
          Pokračovat
        </Button>
      </>
    ) : step === 2 ? (
      <>
        <Button variant="secondary" onClick={() => setStep(1)}>
          Zpět
        </Button>
        <Button disabled={!cnb} onClick={() => setStep(3)}>
          Pokračovat
        </Button>
      </>
    ) : step === 3 ? (
      <>
        <Button variant="secondary" onClick={() => setStep(2)}>
          Zpět
        </Button>
        <Button
          disabled={!responsibleFirstName || !responsibleLastName || !responsibleEmail}
          onClick={() => setStep(4)}
        >
          Pokračovat
        </Button>
      </>
    ) : (
      <>
        <Button variant="secondary" onClick={() => setStep(3)}>
          Zpět
        </Button>
        <Button onClick={handleCreate}>
          <Building2 className="mr-2 h-4 w-4" />
          Založit firmu
        </Button>
      </>
    );

  return (
    <Modal open={open} onClose={close} title="Registrace makléřské firmy" size="xl" footer={footer}>
      {/* Kroky */}
      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    active ? 'bg-brand-600 text-white' : done ? 'bg-brand-100 text-brand-700' : 'bg-surface-muted text-muted'
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : n}
                </span>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted'}`}>{label}</span>
              </div>
              {n < STEPS.length && <span className="h-px flex-1 bg-border" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Krok 1 – IČO + ARES */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Zadejte IČO firmy. Základní údaje se načtou z registru ARES.
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input label="IČO firmy" placeholder="07346204" value={ico} onChange={(e) => setIco(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={handleAres} disabled={loadingAres || ico.length < 6}>
              {loadingAres ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Načíst z ARES
            </Button>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          {ares && (
            <div className="rounded-xl border border-border bg-surface-muted p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" /> Načteno z ARES
              </div>
              <dl>
                <Row label="Název" value={<span className="font-medium">{ares.name}</span>} />
                <Row label="IČO" value={ares.ico} />
                <Row label="Právní forma" value={ares.legalForm} />
                <Row label="DIČ" value={ares.dic} />
                <Row label="Adresa sídla" value={ares.address} />
                <Row label="Datum vzniku" value={ares.createdAt} />
                <Row label="Stav subjektu" value={ares.status} />
              </dl>
            </div>
          )}
        </div>
      )}

      {/* Krok 2 – ČNB / JERS profil */}
      {step === 2 && (
        <div className="space-y-4">
          {loadingCnb && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Ověřuji v registru ČNB / JERS…
            </div>
          )}
          {cnb && !cnb.found && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <XCircle className="h-4 w-4" /> Firma nebyla v registru ČNB nalezena – registraci nelze dokončit.
            </div>
          )}
          {cnb && cnb.found && (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-bg px-3 py-2 text-sm text-foreground">
                <ShieldCheck className="h-4 w-4 text-success" /> Subjekt nalezen v registru ČNB / JERS
              </div>
              <dl className="rounded-xl border border-border bg-surface-muted p-4">
                <Row label="Typ subjektu" value={cnb.subjectType} />
                <Row label="Typ oprávnění k činnosti" value={cnb.authorizationType} />
                <Row label="Registrační číslo" value={cnb.registrationNumber} />
                <Row label="Datum oprávnění k činnosti" value={cnb.validFrom} />
                <Row label="Doba trvání oprávnění" value={cnb.validUntil} />
                <Row
                  label="Povolené činnosti"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {cnb.expertiseGroups.map((g) => (
                        <Badge key={g} tone="brand">
                          {g}. {EXPERTISE_GROUPS.find((e) => e.id === g)?.label.split(' ').slice(0, 3).join(' ')}…
                        </Badge>
                      ))}
                    </div>
                  }
                />
                <Row
                  label="Související vazby"
                  value={
                    <span className="text-foreground">
                      Odpovědná osoba [{cnb.related.responsiblePersons}] · Vázaní zástupci [{cnb.related.vazaniZastupci}] ·
                      Pojišťovny [{cnb.related.pojistovny}] · Pobočky zahr. pojišťoven [{cnb.related.pobocky}]
                    </span>
                  }
                />
                <Row label="Přeshraniční služby" value={cnb.crossBorder.join('; ')} />
                <Row label="Pokuty a sankce" value={cnb.sanctions} />
              </dl>
            </>
          )}
        </div>
      )}

      {/* Krok 3 – odpovědná osoba */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Doplňte odpovědnou osobu firmy – stane se hlavním administrátorem a obdrží přístupové údaje e-mailem.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Jméno"
              placeholder="Jan"
              value={responsibleFirstName}
              onChange={(e) => setResponsibleFirstName(e.target.value)}
            />
            <Input
              label="Příjmení"
              placeholder="Novák"
              value={responsibleLastName}
              onChange={(e) => setResponsibleLastName(e.target.value)}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="jan.novak@firma.cz"
              hint="Na tento e-mail odejdou přístupové údaje."
              value={responsibleEmail}
              onChange={(e) => setResponsibleEmail(e.target.value)}
            />
            <Input
              label="Telefon"
              type="tel"
              placeholder="+420 777 123 456"
              value={responsiblePhone}
              onChange={(e) => setResponsiblePhone(e.target.value)}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role ve firmě</label>
              <Select
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value as CompanyRole)}
                options={(Object.keys(COMPANY_ROLE_LABELS) as CompanyRole[]).map((r) => ({
                  value: r,
                  label: COMPANY_ROLE_LABELS[r],
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Krok 4 – spolupracující pojišťovny */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Pojišťovny dle registru ČNB jsou předvybrané. Upravte, se kterými firma spolupracuje.
            </p>
            <span className="shrink-0 text-sm font-medium text-foreground">{selectedInsurers.length} vybráno</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedInsurers(insurers.map((i) => i.id))}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Vybrat vše
            </button>
            <span className="text-border-strong">·</span>
            <button
              type="button"
              onClick={() => setSelectedInsurers([])}
              className="text-xs font-medium text-muted hover:underline"
            >
              Zrušit výběr
            </button>
          </div>
          <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-xl border border-border p-2">
            {insurers.map((ins) => {
              const on = selectedInsurers.includes(ins.id);
              return (
                <button
                  key={ins.id}
                  type="button"
                  onClick={() =>
                    setSelectedInsurers((prev) =>
                      prev.includes(ins.id) ? prev.filter((x) => x !== ins.id) : [...prev, ins.id],
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    on ? 'border-brand-600 bg-brand-50' : 'border-transparent hover:bg-surface-muted'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      on ? 'border-brand-600 bg-brand-600 text-white' : 'border-border-strong bg-surface'
                    }`}
                  >
                    {on && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-2xs font-bold text-brand-700">
                    {ins.logoText}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{ins.tradeName}</span>
                    <span className="block truncate text-xs text-subtle">{ins.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
