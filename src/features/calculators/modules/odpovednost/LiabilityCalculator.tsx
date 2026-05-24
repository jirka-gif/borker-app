'use client';

import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { LiabilityStepCoverage } from './LiabilityStepCoverage';
import { LiabilityStepPolicyholder } from './LiabilityStepPolicyholder';
import { LiabilityStepRecord } from './LiabilityStepRecord';
import { LiabilityContractPage } from './LiabilityContractPage';
import { computeTotalPrice, formatCzk, initialPolicyholder, initialRecord } from './data';
import type { PolicyholderState, RecordState } from './data';
import { buildLiabilityRecordInput } from './liabilityRecordInput';
import { openRecordPdf } from '../../shared/record/recordPrint';

/**
 * Vložená kalkulačka pojištění odpovědnosti (funkční kopie kalkulačky z frenkee.cz).
 *
 * Krok 1 – rozsah pojištění. Krok 2 – pojistník. Krok 3 – Záznam z jednání
 * (§ 77/79 ZDPZ). Krok 4 – Smlouva a dokumenty (číslo smlouvy, platba, dokumenty).
 * Veškerý stav drží wrapper, aby přežil přepínání kroků a šel vygenerovat do PDF.
 */
const STEPS = ['Rozsah pojištění', 'Pojistník', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function LiabilityCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [limit, setLimit] = useState('10');
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [policyholder, setPolicyholder] = useState<PolicyholderState>(initialPolicyholder);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const toggleAddon = (id: string) => setAdded((prev) => ({ ...prev, [id]: !prev[id] }));

  const downloadRecord = () =>
    openRecordPdf({ input: buildLiabilityRecordInput(limit, added, policyholder), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && (
          <LiabilityStepCoverage
            limit={limit}
            onLimitChange={setLimit}
            added={added}
            onToggleAddon={toggleAddon}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <LiabilityStepPolicyholder
            limit={limit}
            added={added}
            value={policyholder}
            onChange={setPolicyholder}
            onBack={() => setCurrentStep(1)}
            onEdit={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <LiabilityStepRecord
            limit={limit}
            added={added}
            policyholder={policyholder}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(2)}
            onConclude={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 4 && (
          <LiabilityContractPage
            amountLabel={formatCzk(computeTotalPrice(limit, added))}
            onBack={() => setCurrentStep(3)}
            onDownloadRecord={downloadRecord}
          />
        )}
      </div>
    </div>
  );
}

export default LiabilityCalculator;
