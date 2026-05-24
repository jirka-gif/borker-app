'use client';

import React, { useState } from 'react';
import { Stepper } from './components/controls';
import { ZivotStepInsured } from './components/ZivotStepInsured';
import { ZivotStepFinance } from './components/ZivotStepFinance';
import { ZivotStepHealth } from './components/ZivotStepHealth';
import { ZivotStepOffers } from './components/ZivotStepOffers';
import { ZivotContractPage } from './components/ZivotContractPage';
import { RecordStep } from '../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../shared/record/types';
import { openRecordPdf } from '../../shared/record/recordPrint';
import {
  ZIVOT_OFFERS,
  formatCzk,
  monthlyTotal,
  initialFinance,
  initialHealth,
  initialInsured,
  initialSelection,
  type ZivotFinanceState,
  type ZivotHealthState,
  type ZivotInsuredState,
  type ZivotSelectionState,
} from './data';
import { buildZivotRecordInput } from './zivotRecordInput';

/**
 * Vložená kalkulačka životního pojištění. Původních 8 kroků sloučeno do 6:
 * 1) Pojištěný → 2) Finance → 3) Zdraví & rizika → 4) Nabídka →
 * 5) Záznam z jednání → 6) Smlouva a dokumenty.
 */
const STEPS = ['Pojištěný', 'Finance', 'Zdraví', 'Nabídka', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function ZivotCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [insured, setInsured] = useState<ZivotInsuredState>(initialInsured);
  const [finance, setFinance] = useState<ZivotFinanceState>(initialFinance);
  const [health, setHealth] = useState<ZivotHealthState>(initialHealth);
  const [selection, setSelection] = useState<ZivotSelectionState>(initialSelection);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const offer = ZIVOT_OFFERS.find((o) => o.id === selection.selectedOfferId) ?? ZIVOT_OFFERS[0];
  const amountLabel = `${formatCzk(monthlyTotal(offer, selection) * 12)} ročně`;

  const downloadRecord = () => openRecordPdf({ input: buildZivotRecordInput(insured, finance, health, selection), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && <ZivotStepInsured value={insured} onChange={setInsured} onNext={() => setCurrentStep(2)} />}
        {currentStep === 2 && (
          <ZivotStepFinance value={finance} onChange={setFinance} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
        )}
        {currentStep === 3 && (
          <ZivotStepHealth value={health} onChange={setHealth} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
        )}
        {currentStep === 4 && (
          <ZivotStepOffers value={selection} onChange={setSelection} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />
        )}
        {currentStep === 5 && (
          <RecordStep
            input={buildZivotRecordInput(insured, finance, health, selection)}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(4)}
            onConclude={() => setCurrentStep(6)}
          />
        )}
        {currentStep === 6 && (
          <ZivotContractPage
            insurer={offer.insurer}
            amountLabel={amountLabel}
            onBack={() => setCurrentStep(5)}
            onDownloadRecord={downloadRecord}
          />
        )}
      </div>
    </div>
  );
}

export default ZivotCalculator;
