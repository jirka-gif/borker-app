'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  Mail,
  MessageSquare,
  PenLine,
  Send,
  XCircle,
} from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
  INTERMEDIARY,
  INTERMEDIARY_MODE_LABELS,
  INTERMEDIARY_VARIANT_LABELS,
} from '@/config/intermediary';
import {
  CONTRACT_METHODS,
  SIGNING_METHODS,
  type RecordInput,
  type RecordState,
  type SuggestContext,
} from './types';
import { CNB_NOTE } from './texts';
import { AiSuggestField } from './AiSuggestField';
import { openRecordPdf } from './recordPrint';

interface RecordStepProps {
  input: RecordInput;
  record: RecordState;
  onRecordChange: (next: RecordState) => void;
  onBack: () => void;
  /** Vlastní akce „Sjednat smlouvu". Pokud chybí, zobrazí se interní potvrzení. */
  onConclude?: () => void;
  backLabel?: string;
}

/* --------------------------- pomocné komponenty --------------------------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="border-b border-border pb-2 text-base font-semibold uppercase tracking-wide text-brand-700">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function ReadRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[220px_1fr] sm:gap-3">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="text-sm text-foreground">{value || '—'}</div>
    </div>
  );
}

function formatCzDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('cs-CZ');
}

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 font-medium text-success">
      <CheckCircle2 className="h-4 w-4" /> Ano
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 font-medium text-danger">
      <XCircle className="h-4 w-4" /> Ne
    </span>
  );
}

export function RecordStep({
  input,
  record: r,
  onRecordChange,
  onBack,
  onConclude,
  backLabel = 'Zpět',
}: RecordStepProps) {
  const { user } = useAuth();
  const [concluded, setConcluded] = useState(false);
  const [signRequestSent, setSignRequestSent] = useState(false);

  const set = <K extends keyof RecordState>(key: K, v: RecordState[K]) =>
    onRecordChange({ ...r, [key]: v });

  // Digitální podpis zprostředkovatele (dle přihlášení) + předvyplnění kontaktu klienta.
  const signAsAdvisor = () => {
    const today = new Date().toISOString().slice(0, 10);
    onRecordChange({
      ...r,
      advisorSignedAt: today,
      advisorSignedName: r.representativeName || user?.name || 'Zprostředkovatel',
      clientSignContact:
        r.clientSignContact ||
        (r.clientSignMethod === 'sms' ? input.customer.phone : input.customer.email),
    });
    setSignRequestSent(false);
  };

  // Potvrzení podpisu klientem – datum je shodné s podpisem zprostředkovatele.
  const confirmClientSignature = () =>
    onRecordChange({ ...r, clientSigned: true, clientSignedAt: r.advisorSignedAt });

  const resetSignature = () => {
    onRecordChange({
      ...r,
      advisorSignedAt: '',
      advisorSignedName: '',
      clientSigned: false,
      clientSignedAt: '',
    });
    setSignRequestSent(false);
  };

  const methodLabel = r.clientSignMethod === 'sms' ? 'SMS na číslo' : 'e-mailu';

  // Zastoupená osoba se vždy tahá z administrace dle přihlášeného uživatele.
  // Zároveň jednorázově předvyplníme produktové výchozí hodnoty.
  useEffect(() => {
    const next: RecordState = { ...r };
    if (user) {
      const a = user.advisor;
      next.representativeName = user.name;
      next.representativeEmail = user.email;
      next.representativeIco = a?.ico ?? '';
      next.representativeAddress = a?.address ?? '';
      next.representativePhone = a?.phone ?? '';
      next.intermediaryVariant = a?.intermediaryType ?? r.intermediaryVariant;
    }
    if (!next.recommendedProduct) next.recommendedProduct = input.recommendedProductDefault;
    if (!next.insuredInterest && input.defaultInsuredInterest) {
      next.insuredInterest = input.defaultInsuredInterest;
    }
    const changed = (Object.keys(next) as Array<keyof RecordState>).some((k) => next[k] !== r[k]);
    if (changed) onRecordChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const aiCtx: SuggestContext = {
    customerName: input.customer.name || 'Zákazník',
    productName: input.productName,
    recommendedProduct: r.recommendedProduct || input.recommendedProductDefault,
    scopeSummary:
      input.scope.rows.map((row) => `${row.label.toLowerCase()}: ${row.value}`).join(', ') ||
      input.productName.toLowerCase(),
    totalLabel: input.scope.totalLabel ?? '',
  };

  const handleConclude = () => {
    if (onConclude) onConclude();
    else setConcluded(true);
  };

  return (
    <div className="space-y-6">
      {/* Hlavička */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand-600/20 bg-brand-50 px-6 py-4">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <div>
          <h1 className="text-lg font-bold text-foreground">Záznam z jednání</h1>
          <p className="mt-0.5 text-sm text-muted">
            ve smyslu ust. § 77 a 79 zákona č. 170/2018 Sb., o distribuci pojištění a zajištění
            (ZDPZ). Údaje jsou předvyplněné z předchozích kroků – doplňte volná pole a vygenerujte
            PDF k archivaci.
          </p>
        </div>
      </div>

      {/* Zprostředkovatel */}
      <Card title="Samostatný zprostředkovatel">
        <ReadRow label="Název společnosti" value={INTERMEDIARY.companyName} />
        <ReadRow label="IČ" value={INTERMEDIARY.ico} />
        <ReadRow label="Sídlo" value={INTERMEDIARY.address} />
        <ReadRow label="Tel. / Email" value={`${INTERMEDIARY.phone} / ${INTERMEDIARY.email}`} />
        <p className="text-xs leading-relaxed text-subtle">
          {CNB_NOTE} ({INTERMEDIARY.cnbRegistryUrl})
        </p>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Postavení v tomto případě (§ 6 ZDPZ)
          </label>
          <Select
            value={r.mode}
            onChange={(e) => set('mode', e.target.value as RecordState['mode'])}
            options={(
              Object.keys(INTERMEDIARY_MODE_LABELS) as Array<keyof typeof INTERMEDIARY_MODE_LABELS>
            ).map((k) => ({ value: k, label: INTERMEDIARY_MODE_LABELS[k] }))}
          />
        </div>

        {/* Zastoupená – z administrace dle přihlášeného uživatele (needitovatelné) */}
        <div className="rounded-xl border border-border bg-surface-muted p-5">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Zastoupená</h3>
            <span className="rounded-full bg-surface px-2 py-0.5 text-2xs font-medium text-subtle">
              z administrace
            </span>
          </div>
          <div className="space-y-3">
            <ReadRow label="Jméno a příjmení" value={r.representativeName} />
            <ReadRow
              label="Typ zprostředkovatele"
              value={INTERMEDIARY_VARIANT_LABELS[r.intermediaryVariant]}
            />
            <ReadRow label="IČ" value={r.representativeIco} />
            <ReadRow label="Adresa / Sídlo" value={r.representativeAddress} />
            <ReadRow
              label="Tel. / Email"
              value={[r.representativePhone, r.representativeEmail].filter(Boolean).join(' / ')}
            />
          </div>
        </div>
      </Card>

      {/* Zákazník */}
      <Card title="Zájemce o pojištění (zákazník)">
        <ReadRow label="Jméno / Název" value={input.customer.name} />
        <ReadRow label={input.customer.idLabel} value={input.customer.idValue} />
        <ReadRow label="Korespondenční adresa" value={input.customer.address} />
        <ReadRow label="Telefon" value={input.customer.phone} />
        <ReadRow label="E-mail" value={input.customer.email} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Způsob jednání</label>
            <Select
              value={r.contractMethod}
              onChange={(e) => set('contractMethod', e.target.value)}
              options={CONTRACT_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Sjednání pojistné smlouvy
            </label>
            <Select
              value={r.signingMethod}
              onChange={(e) => set('signingMethod', e.target.value)}
              options={SIGNING_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </div>
        </div>
      </Card>

      {/* Požadavky, potřeby a cíle */}
      <Card title="Požadavky, potřeby a cíle zákazníka">
        <ReadRow label="Druh požadovaného pojištění" value={input.insuranceKind} />
        <ReadRow label="Předmět pojištění" value={input.subjectLabel} />
        <ReadRow label="Pojištěné osoby" value={input.insuredPersons} />
        {input.insuredPlace && <ReadRow label="Adresa místa pojištění" value={input.insuredPlace} />}

        <div className="rounded-xl border border-border bg-surface-muted p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Požadovaný rozsah pojištění (z kalkulačky)
          </h3>
          <div className="space-y-1.5 text-sm">
            {input.scope.rows.map((row, i) => (
              <div key={i} className="flex justify-between gap-4">
                <span className="text-muted">{row.label}</span>
                <span className="text-right font-medium text-foreground">{row.value}</span>
              </div>
            ))}
            {input.scope.totalLabel && (
              <div className="flex justify-between border-t border-border pt-1.5">
                <span className="font-semibold text-foreground">Roční pojistné</span>
                <span className="font-bold text-foreground">{input.scope.totalLabel}</span>
              </div>
            )}
          </div>
        </div>

        <AiSuggestField
          label="Jiné potřeby, přání a cíle zákazníka"
          placeholder="Volný text. Když necháte prázdné, do záznamu se vloží, že zákazník další informace neposkytl."
          value={r.otherNeeds}
          onChange={(v) => set('otherNeeds', v)}
          field="otherNeeds"
          ctx={aiCtx}
        />
        <AiSuggestField
          label="Pojistný zájem"
          value={r.insuredInterest}
          onChange={(v) => set('insuredInterest', v)}
          field="insuredInterest"
          ctx={aiCtx}
          rows={2}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {input.amountBasis && <ReadRow label="Pojistná částka" value={input.amountBasis} />}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Pojištění do (volitelné)
            </label>
            <Input
              type="date"
              value={r.insuredEnd}
              onChange={(e) => set('insuredEnd', e.target.value)}
              rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
            />
          </div>
          <Input
            label="Frekvence placení"
            value={r.paymentFrequency}
            onChange={(e) => set('paymentFrequency', e.target.value)}
          />
        </div>
      </Card>

      {/* Doporučení */}
      <Card title="Doporučení pojistného produktu">
        {input.offers && input.offers.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Navrhovaná řešení</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-600 text-white">
                    <th className="px-4 py-2.5 text-left font-semibold">Pojišťovna</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Produkt</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Pojistné (ročně)</th>
                    <th className="px-4 py-2.5 text-center font-semibold">Doporučeno</th>
                    <th className="px-4 py-2.5 text-center font-semibold">Volba zákazníka</th>
                  </tr>
                </thead>
                <tbody>
                  {input.offers.map((o, i) => (
                    <tr
                      key={i}
                      className={`border-t border-border ${
                        o.recommended ? 'bg-brand-50' : 'bg-surface'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">{o.insurer}</td>
                      <td className="px-4 py-2.5 text-muted">{o.product}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                        {o.priceLabel}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <YesNo value={o.recommended} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <YesNo value={o.chosen} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-subtle">
              Detailní porovnání vlastností nabídek obsahuje dokument „Detail porovnání nabídek",
              který je nedílnou přílohou tohoto Záznamu z jednání.
            </p>
          </div>
        )}

        <Input
          label="Doporučený pojistitel a produkt"
          value={r.recommendedProduct}
          onChange={(e) => set('recommendedProduct', e.target.value)}
        />
        <AiSuggestField
          label="Odůvodnění doporučení"
          placeholder="Proč byl tento produkt zákazníkovi doporučen…"
          value={r.recommendationReason}
          onChange={(v) => set('recommendationReason', v)}
          field="recommendationReason"
          ctx={aiCtx}
        />
      </Card>

      {/* Nesrovnalosti */}
      <Card title="Dopady a nesrovnalosti">
        <p className="text-sm text-muted">
          Upozornění (ve smyslu § 2789 zák. č. 89/2012 Sb., občanského zákoníku) na nesrovnalosti
          mezi požadavky zákazníka a nabízeným pojištěním.
        </p>
        <button
          type="button"
          role="checkbox"
          aria-checked={r.hasDiscrepancies}
          onClick={() => set('hasDiscrepancies', !r.hasDiscrepancies)}
          className="flex w-full items-start gap-3 text-left"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              r.hasDiscrepancies
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-border-strong bg-surface'
            }`}
          >
            {r.hasDiscrepancies && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-sm text-foreground">
            Byly zjištěny nesrovnalosti, které je třeba popsat.
          </span>
        </button>
        {r.hasDiscrepancies ? (
          <AiSuggestField
            label="Výčet a důvody nesrovnalostí"
            value={r.discrepancies}
            onChange={(v) => set('discrepancies', v)}
            field="discrepancies"
            ctx={aiCtx}
          />
        ) : (
          <div className="rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted">
            Zákazník ani zprostředkovatel si nejsou vědomi žádných nesrovnalostí mezi požadavky
            zákazníka a nabízeným pojištěním.
          </div>
        )}
      </Card>

      {/* Rozhodnutí zákazníka */}
      <Card title="Rozhodnutí zákazníka">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="record-decision"
              checked={r.customerAccepts}
              onChange={() => set('customerAccepts', true)}
              className="mt-1 accent-brand-600"
            />
            <span className="text-sm text-foreground">
              Zákazník souhlasí se zvoleným rozsahem pojištění a s uzavřením smlouvy. Rozsah
              odpovídá zjištěným potřebám, požadavkům a pojistnému zájmu.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="record-decision"
              checked={!r.customerAccepts}
              onChange={() => set('customerAccepts', false)}
              className="mt-1 accent-brand-600"
            />
            <span className="text-sm text-foreground">
              Zákazník odmítl doporučení a požaduje jiné řešení (byl upozorněn na nevhodnost).
            </span>
          </label>
        </div>
        <AiSuggestField
          label="Poznámka k rozhodnutí (volitelné)"
          value={r.decisionNote}
          onChange={(v) => set('decisionNote', v)}
          field="decisionNote"
          ctx={aiCtx}
          rows={2}
        />
      </Card>

      {/* Závěr */}
      <Card title="Závěr">
        <button
          type="button"
          role="checkbox"
          aria-checked={r.electronicConsent}
          onClick={() => set('electronicConsent', !r.electronicConsent)}
          className="flex w-full items-start gap-3 text-left"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              r.electronicConsent
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-border-strong bg-surface'
            }`}
          >
            {r.electronicConsent && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-sm text-foreground">
            Souhlas se zasíláním informací v elektronické podobě
            {r.electronicConsent && input.customer.email ? ` na e-mail ${input.customer.email}` : ''}.
          </span>
        </button>
        {!r.electronicConsent && (
          <div className="rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
            Bez souhlasu s elektronickou komunikací je nutný fyzický podpis zákazníka na
            dokumentech v listinné podobě.
          </div>
        )}
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Datum vystavení záznamu
          </label>
          <Input
            type="date"
            value={r.issueDate}
            onChange={(e) => set('issueDate', e.target.value)}
            rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
          />
        </div>
        <p className="text-xs text-muted">
          Dokument je vystaven ve dvou vyhotoveních – jedno náleží zákazníkovi a jedno
          zprostředkovateli.
        </p>
      </Card>

      {/* Podpis záznamu */}
      <Card title="Podpis záznamu">
        {!r.advisorSignedAt ? (
          <>
            <p className="text-sm text-muted">
              Po vyplnění záznam digitálně podepište. Klientovi následně odešleme ověřovací odkaz
              (e-mailem) nebo SMS – uznávaný způsob podpisu na dálku.
            </p>
            <div>
              <button
                type="button"
                onClick={signAsAdvisor}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <PenLine className="h-4 w-4" />
                Podepsat
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {/* Podpis zprostředkovatele */}
            <div className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm">
              <span className="font-medium text-foreground">
                Dne {formatCzDate(r.advisorSignedAt)} podepsal {r.advisorSignedName}
              </span>
              <span className="text-muted"> (zprostředkovatel, digitální podpis dle přihlášení)</span>
            </div>

            {r.clientSigned ? (
              <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-bg px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Podepsáno</span> ověřením v {methodLabel}{' '}
                  <span className="font-medium">{r.clientSignContact}</span> dne{' '}
                  {formatCzDate(r.clientSignedAt)}.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Podpis klienta</h3>
                <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(
                    [
                      { v: 'email' as const, label: 'Ověřovací odkaz e-mailem', Icon: Mail },
                      { v: 'sms' as const, label: 'Podpis přes SMS', Icon: MessageSquare },
                    ]
                  ).map(({ v, label, Icon }) => {
                    const active = r.clientSignMethod === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          onRecordChange({
                            ...r,
                            clientSignMethod: v,
                            clientSignContact: v === 'sms' ? input.customer.phone : input.customer.email,
                          });
                          setSignRequestSent(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-border text-foreground hover:border-border-strong'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <Input
                  label={r.clientSignMethod === 'sms' ? 'Telefon klienta' : 'E-mail klienta'}
                  type={r.clientSignMethod === 'sms' ? 'tel' : 'email'}
                  value={r.clientSignContact}
                  onChange={(e) => set('clientSignContact', e.target.value)}
                  placeholder={r.clientSignMethod === 'sms' ? '+420 777 123 456' : 'klient@email.cz'}
                />

                {!signRequestSent ? (
                  <button
                    type="button"
                    onClick={() => setSignRequestSent(true)}
                    disabled={!r.clientSignContact}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {r.clientSignMethod === 'sms' ? 'Odeslat ověřovací SMS' : 'Odeslat ověřovací odkaz'}
                  </button>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-muted">
                      Odesláno na <span className="font-medium text-foreground">{r.clientSignContact}</span> – čeká
                      na potvrzení klientem.
                    </p>
                    <button
                      type="button"
                      onClick={confirmClientSignature}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Potvrdit ověření (simulace)
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={resetSignature}
              className="text-xs font-medium text-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              Zrušit podpis a začít znovu
            </button>
          </div>
        )}
      </Card>

      {concluded && (
        <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success-bg px-5 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-semibold text-foreground">Smlouva byla odeslána ke sjednání</p>
            <p className="mt-0.5 text-sm text-muted">
              Záznam z jednání je uložen u sjednání. Nezapomeňte zákazníkovi předat kopii (PDF výše).
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          {backLabel}
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => openRecordPdf({ input, record: r })}>
            <Download className="mr-2 h-4 w-4" />
            Stáhnout PDF záznamu
          </Button>
          <Button onClick={handleConclude}>
            <FileSignature className="mr-2 h-4 w-4" />
            Sjednat smlouvu
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RecordStep;
