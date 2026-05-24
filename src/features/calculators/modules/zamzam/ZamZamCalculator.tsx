'use client';

import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { ZamZamStepCoverage } from './components/ZamZamStepCoverage';
import { ZamZamStepPolicyholder } from './components/ZamZamStepPolicyholder';
import { ZamZamContractPage } from './components/ZamZamContractPage';
import { RecordStep } from '../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../shared/record/types';
import { openRecordPdf } from '../../shared/record/recordPrint';
import {
  formatCzk,
  initialZamZamInput,
  initialZamZamPolicyholder,
  tierFor,
  type ZamZamInputState,
  type ZamZamPolicyholderState,
} from './data';
import { buildZamZamRecordInput } from './zamzamRecordInput';

/**
 * Vložená kalkulačka ZamZam – pojištění odpovědnosti zaměstnance z výkonu
 * povolání (sjednává ČSOB). Flow: 1) Údaje o pojištění → 2) Osobní údaje →
 * 3) Záznam z jednání → 4) Smlouva a dokumenty.
 */
const STEPS = ['Údaje o pojištění', 'Osobní údaje', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function ZamZamCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState<ZamZamInputState>(initialZamZamInput);
  const [policyholder, setPolicyholder] = useState<ZamZamPolicyholderState>(initialZamZamPolicyholder);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const amountLabel = formatCzk(tierFor(input.coverage)?.annual ?? 0);

  const downloadRecord = () => openRecordPdf({ input: buildZamZamRecordInput(input, policyholder), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && (
          <ZamZamStepCoverage value={input} onChange={setInput} onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <ZamZamStepPolicyholder
            input={input}
            onInputChange={setInput}
            value={policyholder}
            onChange={setPolicyholder}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onEdit={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <RecordStep
            input={buildZamZamRecordInput(input, policyholder)}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(2)}
            onConclude={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 4 && (
          <ZamZamContractPage
            amountLabel={amountLabel}
            onBack={() => setCurrentStep(3)}
            onDownloadRecord={downloadRecord}
          />
        )}
      </div>
    </div>
  );
}

export default ZamZamCalculator;
