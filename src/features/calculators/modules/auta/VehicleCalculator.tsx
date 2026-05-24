"use client";

import { useState } from "react";
import { VehicleInsuranceBasicDataPage } from "./pages/VehicleInsuranceBasicDataPage";
import { VehicleInsuranceAdditionalPage } from "./pages/VehicleInsuranceAdditionalPage";
import { VehicleInsuranceCalculationPage } from "./pages/VehicleInsuranceCalculationPage";
import { VehicleInsuranceSummaryPage } from "./pages/VehicleInsuranceSummaryPage";
import { VehicleInsuranceContractPage } from "./pages/VehicleInsuranceContractPage";
import { buildVehicleRecordInput } from "./pages/vehicleRecordInput";
import { initialRecord, type RecordState } from "../../shared/record/types";
import { openRecordPdf } from "../../shared/record/recordPrint";

/**
 * Vložená kalkulačka pojištění vozidel (původně samostatná Vite appka „CarCoolka").
 *
 * Wrapper drží stav aktuálního kroku a postupně vykresluje 5 kroků průvodce:
 * Základní údaje → Parametry → Kalkulace → Záznam z jednání → Smlouva a dokumenty.
 * Stav „Záznamu z jednání" drží wrapper, aby přežil přepínání kroků a šel
 * vygenerovat do PDF i v kroku 5.
 */
export function VehicleCalculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const downloadRecord = () =>
    openRecordPdf({ input: buildVehicleRecordInput(), record });

  return (
    <div className="vehicle-calculator">
      {currentStep === 1 && (
        <VehicleInsuranceBasicDataPage onStepChange={setCurrentStep} />
      )}
      {currentStep === 2 && (
        <VehicleInsuranceAdditionalPage onStepChange={setCurrentStep} />
      )}
      {currentStep === 3 && (
        <VehicleInsuranceCalculationPage onStepChange={setCurrentStep} />
      )}
      {currentStep === 4 && (
        <VehicleInsuranceSummaryPage
          onStepChange={setCurrentStep}
          record={record}
          onRecordChange={setRecord}
        />
      )}
      {currentStep === 5 && (
        <VehicleInsuranceContractPage
          onStepChange={setCurrentStep}
          onDownloadRecord={downloadRecord}
        />
      )}
    </div>
  );
}

export default VehicleCalculator;
