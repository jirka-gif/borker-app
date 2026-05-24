'use client';

import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { ForeignerStepDetails } from './components/ForeignerStepDetails';
import { ForeignerStepOffers } from './components/ForeignerStepOffers';
import { ForeignerStepPolicyholder } from './components/ForeignerStepPolicyholder';
import { ForeignerContractPage } from './components/ForeignerContractPage';
import { RecordStep } from '../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../shared/record/types';
import { openRecordPdf } from '../../shared/record/recordPrint';
import {
  formatCzk,
  initialForeignerInput,
  initialForeignerPolicyholder,
  initialForeignerSelection,
  type ForeignerInputState,
  type ForeignerPolicyholderState,
  type ForeignerSelectionState,
} from './data';
import { getForeignerOffers, totalPrice } from './offers';
import { buildForeignerRecordInput } from './foreignerRecordInput';

/**
 * Vložená kalkulačka zdravotního pojištění cizinců.
 *
 * Flow: 1) Údaje o pojištění → 2) Doba trvání a nabídka → 3) Osobní údaje (až
 * po výběru) → 4) Záznam z jednání → 5) Smlouva a dokumenty.
 */
const STEPS = ['Údaje o pojištění', 'Doba a nabídka', 'Osobní údaje', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function ForeignerCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState<ForeignerInputState>(initialForeignerInput);
  const [selection, setSelection] = useState<ForeignerSelectionState>(initialForeignerSelection);
  const [policyholder, setPolicyholder] = useState<ForeignerPolicyholderState>(initialForeignerPolicyholder);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const selectedOffer =
    getForeignerOffers().find((o) => o.id === selection.selectedOfferId) ?? getForeignerOffers()[0];
  const amountLabel = selectedOffer
    ? formatCzk(totalPrice(selectedOffer, input, selection.durationMonths))
    : '—';

  const downloadRecord = () =>
    openRecordPdf({ input: buildForeignerRecordInput(input, selection, policyholder), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && (
          <ForeignerStepDetails value={input} onChange={setInput} onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <ForeignerStepOffers
            input={input}
            value={selection}
            onChange={setSelection}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <ForeignerStepPolicyholder
            input={input}
            selection={selection}
            value={policyholder}
            onChange={setPolicyholder}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <RecordStep
            input={buildForeignerRecordInput(input, selection, policyholder)}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(3)}
            onConclude={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 5 && (
          <ForeignerContractPage
            insurer={selectedOffer?.insurer ?? 'pojišťovny'}
            amountLabel={amountLabel}
            onBack={() => setCurrentStep(4)}
            onDownloadRecord={downloadRecord}
          />
        )}
      </div>
    </div>
  );
}

export default ForeignerCalculator;
