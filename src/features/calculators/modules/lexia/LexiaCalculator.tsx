'use client';

import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { LexiaStepCoverage } from './components/LexiaStepCoverage';
import { LexiaStepPolicyholder } from './components/LexiaStepPolicyholder';
import { LexiaContractPage } from './components/LexiaContractPage';
import { RecordStep } from '../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../shared/record/types';
import { openRecordPdf } from '../../shared/record/recordPrint';
import {
  annualPrice,
  formatCzk,
  initialLexiaInput,
  initialLexiaPolicyholder,
  type LexiaInputState,
  type LexiaPolicyholderState,
} from './data';
import { buildLexiaRecordInput } from './lexiaRecordInput';

/**
 * Vložená kalkulačka právní ochrany Lexia. Flow: 1) Rozsah krytí (segment,
 * subjekt, pilíře) → 2) Pojistník → 3) Záznam z jednání → 4) Smlouva a dokumenty.
 */
const STEPS = ['Rozsah krytí', 'Pojistník', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function LexiaCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState<LexiaInputState>(initialLexiaInput);
  const [policyholder, setPolicyholder] = useState<LexiaPolicyholderState>(initialLexiaPolicyholder);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const amountLabel = formatCzk(annualPrice(input));
  const downloadRecord = () => openRecordPdf({ input: buildLexiaRecordInput(input, policyholder), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && (
          <LexiaStepCoverage value={input} onChange={setInput} onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <LexiaStepPolicyholder
            input={input}
            value={policyholder}
            onChange={setPolicyholder}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onEdit={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <RecordStep
            input={buildLexiaRecordInput(input, policyholder)}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(2)}
            onConclude={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 4 && (
          <LexiaContractPage
            amountLabel={amountLabel}
            onBack={() => setCurrentStep(3)}
            onDownloadRecord={downloadRecord}
          />
        )}
      </div>
    </div>
  );
}

export default LexiaCalculator;
