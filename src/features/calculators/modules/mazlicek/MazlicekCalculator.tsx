'use client';

import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { PetStepAnimal } from './components/PetStepAnimal';
import { PetStepOffers } from './components/PetStepOffers';
import { PetStepPolicyholder } from './components/PetStepPolicyholder';
import { PetContractPage } from './components/PetContractPage';
import { RecordStep } from '../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../shared/record/types';
import { openRecordPdf } from '../../shared/record/recordPrint';
import {
  formatCzk,
  initialPet,
  initialPetCoverage,
  initialPetPolicyholder,
  type PetCoverageState,
  type PetPolicyholderState,
  type PetState,
} from './data';
import { annualTotal, getPetOffers } from './offers';
import { buildPetRecordInput } from './petRecordInput';

/**
 * Vložená kalkulačka pojištění domácích mazlíčků.
 *
 * Flow: 1) Mazlíček → 2) Nabídka (výběr produktu + připojištění) →
 * 3) Pojistník (až po výběru) → 4) Záznam z jednání → 5) Smlouva a dokumenty.
 * Veškerý stav drží wrapper.
 */
const STEPS = ['Mazlíček', 'Nabídka', 'Pojistník', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function MazlicekCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pet, setPet] = useState<PetState>(initialPet);
  const [coverage, setCoverage] = useState<PetCoverageState>(initialPetCoverage);
  const [policyholder, setPolicyholder] = useState<PetPolicyholderState>(initialPetPolicyholder);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const selectedOffer =
    getPetOffers(pet.type).find((o) => o.id === coverage.selectedOfferId) ?? getPetOffers(pet.type)[0];
  const amountLabel = selectedOffer
    ? `${formatCzk(annualTotal(selectedOffer, coverage))} ročně`
    : '—';

  const downloadRecord = () =>
    openRecordPdf({ input: buildPetRecordInput(pet, coverage, policyholder), record });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      <div>
        {currentStep === 1 && (
          <PetStepAnimal value={pet} onChange={setPet} onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <PetStepOffers
            pet={pet}
            value={coverage}
            onChange={setCoverage}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <PetStepPolicyholder
            pet={pet}
            coverage={coverage}
            value={policyholder}
            onChange={setPolicyholder}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <RecordStep
            input={buildPetRecordInput(pet, coverage, policyholder)}
            record={record}
            onRecordChange={setRecord}
            onBack={() => setCurrentStep(3)}
            onConclude={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 5 && (
          <PetContractPage
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

export default MazlicekCalculator;
