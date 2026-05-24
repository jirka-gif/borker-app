'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Stepper } from '../../components/ui/Stepper';
import { TravelStepDestination } from './steps/TravelStepDestination';
import { TravelStepOffers } from './steps/TravelStepOffers';
import { TravelContractPage } from './TravelContractPage';
import { getTravelQuotes, TravelOffer } from '../../lib/travelQuotes';
import { RecordStep } from '../../../../shared/record/RecordStep';
import { initialRecord, type RecordState } from '../../../../shared/record/types';
import { openRecordPdf } from '../../../../shared/record/recordPrint';
import { buildTravelRecordInput } from '../../travelRecordInput';

export type Traveller = {
  id: string;
  name?: string;
  dateOfBirth?: string;
};

export type TravelFormValues = {
  destinationZone: string;        // 'cz' | 'eu' | 'world' | 'world_with_usa'
  destinationCountry?: string;
  dateFrom: string;
  dateTo: string;
  fullYearInsurance: boolean;    // true = pojištění na celý rok, false = krátkodobá cesta
  fullYearType?: string;          // 'repeated' | 'yearly' - pro celoroční pojištění
  insuranceStartDate?: string;    // počátek pojištění pro celoroční
  transportation: string;         // 'plane' | 'car' | 'car_and_plane' | 'other'
  tripType: string;               // 'work' | 'relax' | 'adrenaline' | 'organized_sport'
  needCancellationCoverage: boolean;  // Potřebuješ pokrýt storno cesty?
  cancellationType?: string;      // 'full' | 'co_payment' - 100% nebo se spoluúčastí
  tripBookingDate?: string;       // Datum pořízení zájezdu
  tripPrice?: number;             // Cena zájezdu

  travellers: Traveller[];

  tripPurpose: string;            // 'holiday' | 'work' | 'study' | 'sport' | 'longstay'
  sportLevel: string;             // 'none' | 'normal' | 'risky' | 'extreme';

  coverageLevel: string;          // 'basic' | 'standard' | 'premium'
  includeBaggage: boolean;
  includeLiability: boolean;
  includeTripCancellation: boolean;
  includeAccident: boolean;
};

const steps = ['Základní údaje', 'Nabídka a připojištění', 'Záznam z jednání', 'Smlouva a dokumenty'];

export function TravelInsuranceCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [offers, setOffers] = useState<TravelOffer[] | null>(null);
  const [record, setRecord] = useState<RecordState>(initialRecord);

  const methods = useForm<TravelFormValues>({
    defaultValues: {
      destinationZone: '',
      destinationCountry: '',
      dateFrom: '',
      dateTo: '',
      fullYearInsurance: false,
      fullYearType: '',
      insuranceStartDate: '',
      transportation: '',
      tripType: '',
      needCancellationCoverage: false,
      cancellationType: '',
      tripBookingDate: '',
      tripPrice: undefined,
      travellers: [{ id: 'traveller-1', name: '', dateOfBirth: '' }],
      tripPurpose: '',
      sportLevel: 'none',
      coverageLevel: 'standard',
      includeBaggage: false,
      includeLiability: false,
      includeTripCancellation: false,
      includeAccident: false,
    },
    mode: 'onChange',
  });

  const { trigger, getValues } = methods;

  const handleNext = async () => {
    let fieldsToValidate: (keyof TravelFormValues)[] = [];

    if (currentStep === 1) {
      const formData = getValues();
      fieldsToValidate = ['destinationZone', 'dateFrom', 'dateTo'];
      
      // Transportation and trip type are only required if not full year insurance
      if (!formData.fullYearInsurance) {
        fieldsToValidate.push('transportation', 'tripType');
        // Validate cancellation coverage fields if enabled
        if (formData.needCancellationCoverage) {
          fieldsToValidate.push('cancellationType', 'tripBookingDate', 'tripPrice');
          if (!formData.cancellationType) {
            methods.setError('cancellationType', {
              type: 'manual',
              message: 'Typ storna je povinný',
            });
            return;
          }
          if (!formData.tripBookingDate) {
            methods.setError('tripBookingDate', {
              type: 'manual',
              message: 'Datum pořízení zájezdu je povinné',
            });
            return;
          }
          if (!formData.tripPrice || formData.tripPrice <= 0) {
            methods.setError('tripPrice', {
              type: 'manual',
              message: 'Cena zájezdu je povinná a musí být větší než 0',
            });
            return;
          }
        }
      }
      
      // Validate travellers data
      if (!formData.travellers || formData.travellers.length < 1) {
        methods.setError('travellers', {
          type: 'manual',
          message: 'Musí být alespoň jeden cestující',
        });
        return;
      }
      // Validate full year insurance fields if enabled
      if (formData.fullYearInsurance) {
        fieldsToValidate.push('fullYearType', 'insuranceStartDate');
        if (!formData.fullYearType) {
          methods.setError('fullYearType', {
            type: 'manual',
            message: 'Typ pojištění je povinný',
          });
          return;
        }
        if (!formData.insuranceStartDate) {
          methods.setError('insuranceStartDate', {
            type: 'manual',
            message: 'Počátek pojištění je povinný',
          });
          return;
        }
      }
      // Validate all travellers have name and date of birth
      for (let i = 0; i < formData.travellers.length; i++) {
        const traveller = formData.travellers[i];
        if (!traveller || !traveller.name || !traveller.dateOfBirth) {
          methods.setError('travellers', {
            type: 'manual',
            message: `Cestující ${i + 1}: Jméno a datum narození jsou povinné`,
          });
          return;
        }
      }
    } else if (currentStep === 2) {
      // Custom validation for travellers (if step 2 is still used)
      const formData = getValues();
      if (formData.travellers.length === 0) {
        methods.setError('travellers', {
          type: 'manual',
          message: 'Musí být alespoň jedna osoba',
        });
        return;
      }
      const hasValidTraveller = formData.travellers.some(
        (t) => t.name && t.dateOfBirth
      );
      if (!hasValidTraveller) {
        methods.setError('travellers', {
          type: 'manual',
          message: 'Alespoň jedna osoba musí mít vyplněné jméno a datum narození',
        });
        return;
      }
    }

    if (currentStep === 1) {
      // Additional date validation
      const formData = getValues();
      if (formData.dateFrom && formData.dateTo) {
        const dateFrom = new Date(formData.dateFrom);
        const dateTo = new Date(formData.dateTo);
        if (dateTo < dateFrom) {
          methods.setError('dateTo', {
            type: 'manual',
            message: 'Datum do musí být po datu od',
          });
          return;
        }
      }
    }

    const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep === 1) {
        // After step 1, get quotes and go to step 2
        const formData = getValues();
        
        // Final validation for dates
        if (formData.dateFrom && formData.dateTo) {
          const dateFrom = new Date(formData.dateFrom);
          const dateTo = new Date(formData.dateTo);
          if (dateTo < dateFrom) {
            methods.setError('dateTo', {
              type: 'manual',
              message: 'Datum do musí být po datu od',
            });
            return;
          }
        }

        // Final validation for travellers
        if (!formData.travellers || formData.travellers.length < 1) {
          methods.setError('travellers', {
            type: 'manual',
            message: 'Musí být alespoň jeden cestující',
          });
          return;
        }
        for (let i = 0; i < formData.travellers.length; i++) {
          const traveller = formData.travellers[i];
          if (!traveller || !traveller.name || !traveller.dateOfBirth) {
            methods.setError('travellers', {
              type: 'manual',
              message: `Cestující ${i + 1}: Jméno a datum narození jsou povinné`,
            });
            return;
          }
        }

        const quotes = getTravelQuotes(formData);
        setOffers(quotes);
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditInput = () => {
    setOffers(null);
    setCurrentStep(1);
  };

  // Skok na krok přes stepper – pro krok 2+ dopočítá nabídky (i bez validace).
  const goToStep = (step: number) => {
    if (step >= 2 && !offers) {
      setOffers(getTravelQuotes(getValues()));
    }
    setCurrentStep(step);
  };

  const downloadRecord = () =>
    openRecordPdf({ input: buildTravelRecordInput(getValues(), offers ?? []), record });

  return (
    <FormProvider {...methods}>
      <div className="w-full">
        <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />
        </div>

        <div className="mt-0">
          {currentStep === 1 && <TravelStepDestination onNext={handleNext} onBack={handleBack} />}
          {currentStep === 2 && offers && <TravelStepOffers offers={offers} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && (
            <RecordStep
              input={buildTravelRecordInput(getValues(), offers ?? [])}
              record={record}
              onRecordChange={setRecord}
              onBack={() => setCurrentStep(2)}
              onConclude={() => setCurrentStep(4)}
            />
          )}
          {currentStep === 4 && (
            <TravelContractPage onBack={() => setCurrentStep(3)} onDownloadRecord={downloadRecord} />
          )}
        </div>
      </div>
    </FormProvider>
  );
}

