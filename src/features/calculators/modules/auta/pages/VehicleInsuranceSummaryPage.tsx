import React from 'react';
import { Stepper } from '../components/Stepper';
import { RecordStep } from '../../../shared/record/RecordStep';
import type { RecordState } from '../../../shared/record/types';
import { VEHICLE_STEPS } from './vehicleSteps';
import { buildVehicleRecordInput } from './vehicleRecordInput';

interface VehicleInsuranceSummaryPageProps {
  onStepChange?: (step: number) => void;
  record: RecordState;
  onRecordChange: (next: RecordState) => void;
}

export const VehicleInsuranceSummaryPage: React.FC<VehicleInsuranceSummaryPageProps> = ({
  onStepChange,
  record,
  onRecordChange,
}) => {
  const input = buildVehicleRecordInput();

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper currentStep={4} steps={VEHICLE_STEPS} onStepClick={onStepChange} />
      </div>

      <RecordStep
        input={input}
        record={record}
        onRecordChange={onRecordChange}
        onBack={() => onStepChange?.(3)}
        onConclude={() => onStepChange?.(5)}
      />
    </div>
  );
};
