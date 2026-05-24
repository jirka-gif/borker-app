'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Home,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { Stepper } from '../components/Stepper';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { VEHICLE_STEPS } from './vehicleSteps';

interface VehicleInsuranceContractPageProps {
  onStepChange?: (step: number) => void;
  /** Spustí stažení PDF Záznamu z jednání (z kroku 4). */
  onDownloadRecord?: () => void;
}

// Mock data (v reálu z API pojišťovny po sjednání).
const contractNumber = '8061234567';
const insurer = 'Kooperativa pojišťovna';
const amount = '27 871 Kč';
const variableSymbol = '8061234567';
const paymentUrl = 'https://platebnibrana.example/pay/8061234567';
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
  paymentUrl,
)}`;

interface DocItem {
  name: string;
  desc: string;
  /** Záznam z jednání generujeme my, ostatní „dodá" pojišťovna. */
  source: 'Pojišťovna' | 'Star Insurance Group';
  onClick?: () => void;
}

export const VehicleInsuranceContractPage: React.FC<VehicleInsuranceContractPageProps> = ({
  onStepChange,
  onDownloadRecord,
}) => {
  const router = useRouter();
  const documents: DocItem[] = [
    { name: 'Pojistná smlouva', desc: 'Smlouva o pojištění vozidla', source: 'Pojišťovna' },
    {
      name: 'Informační dokument o pojistném produktu (IPID)',
      desc: 'Přehled základních vlastností pojištění',
      source: 'Pojišťovna',
    },
    {
      name: 'Pojistné podmínky',
      desc: 'Všeobecné a doplňkové pojistné podmínky',
      source: 'Pojišťovna',
    },
    {
      name: 'Záznam z jednání',
      desc: 'Záznam dle § 77 a 79 ZDPZ vytvořený v kroku 4',
      source: 'Star Insurance Group',
      onClick: onDownloadRecord,
    },
  ];

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper currentStep={5} steps={VEHICLE_STEPS} onStepClick={onStepChange} />
      </div>

      <div className="space-y-6">
        {/* Potvrzení sjednání + číslo smlouvy */}
        <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success-bg px-6 py-5">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Smlouva byla sjednána</h1>
            <p className="mt-0.5 text-sm text-muted">
              Pojištění u {insurer} je připravené. Pro aktivaci uhraďte první pojistné.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              <span className="text-muted">Číslo smlouvy:</span>
              <span className="font-semibold text-foreground">{contractNumber}</span>
            </div>
          </div>
        </div>

        {/* Platba */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold uppercase tracking-wide text-brand-700">
              Údaje pro platbu
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted">Částka k úhradě</span>
                <span className="text-lg font-bold text-foreground">{amount}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted">Variabilní symbol</span>
                <span className="text-sm font-medium text-foreground">{variableSymbol}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted">Příjemce</span>
                <span className="text-sm font-medium text-foreground">{insurer}</span>
              </div>
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <PrimaryButton type="button" className="mt-2">
                  <CreditCard className="mr-2 inline h-4 w-4" />
                  Přejít na platební bránu
                </PrimaryButton>
              </a>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface-muted p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                <QrCode className="h-4 w-4" />
                Naskenujte pro platbu
              </div>
              {/* QR míří na platební bránu; v produkci nahradí QR platba (SPD) z banky. */}
              <img
                src={qrUrl}
                alt="QR kód pro platbu"
                width={180}
                height={180}
                className="rounded-lg bg-white p-2"
              />
            </div>
          </div>
        </div>

        {/* Dokumenty */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold uppercase tracking-wide text-brand-700">
              Dokumenty ke sjednání
            </h2>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{doc.desc}</p>
                    <span className="mt-1 inline-block rounded-full bg-surface-muted px-2 py-0.5 text-2xs font-medium text-subtle">
                      {doc.source}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={doc.onClick}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
                >
                  <Download className="h-4 w-4" />
                  Stáhnout
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SecondaryButton onClick={() => onStepChange?.(4)}>Zpět na záznam</SecondaryButton>
          <PrimaryButton type="button" onClick={() => router.push('/dashboard')}>
            <Home className="mr-2 inline h-4 w-4" />
            Ukončit, návrat na dashboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
