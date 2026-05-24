import React from 'react';
import { useForm } from 'react-hook-form';
import { Stepper } from '../components/Stepper';
import { VEHICLE_STEPS } from './vehicleSteps';
import { PolicyholderSection } from '../components/PolicyholderSection';
import { VehicleHolderSection } from '../components/VehicleHolderSection';
import { VehicleSection } from '../components/VehicleSection';
import { Input } from '../components/ui/Input';
import { SelectField } from '../components/ui/SelectField';
import { DatePicker } from '../components/ui/DatePicker';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';

interface VehicleInsuranceBasicDataPageProps {
  onStepChange?: (step: number) => void;
}

export const VehicleInsuranceBasicDataPage: React.FC<VehicleInsuranceBasicDataPageProps> = ({ onStepChange }) => {
  const form = useForm<VehicleInsuranceBasicDataForm>({
    defaultValues: {
      insurance: {
        startDate: '2025-09-08',
        contractReplacement: false,
      },
      policyholder: {
        type: 'person',
      },
      holder: {
        sameAsPolicyholder: true,
      },
      owner: {
        type: 'sameAsPolicyholder',
      },
      vehicle: {
        registrationType: 'permanent',
        vehicleType: 'passenger',
        fuelType: 'gasoline',
        brand: '',
        model: '',
        usage: 'normal',
        engineCapacity: 0,
        maxPower: 0,
        maxPermittedWeight: 0,
        origin: 'cz',
        seatCount: 5,
        firstRegistrationDate: '',
        purchaseDate: '',
        odometer: 0,
        annualMileage: 0,
        priceSource: 'invoice',
        vehiclePrice: 0,
        priceWithVat: false,
        equipment: {
          parkingAssistant: false,
          automaticTransmission: false,
          fourWheelDrive: false,
          panoramicRoof: false,
        },
        hasExistingDamage: false,
      },
    },
  });

  const { register, watch, setValue, formState: { errors } } = form;
  const contractReplacement = watch('insurance.contractReplacement');

  const onSubmit = (data: VehicleInsuranceBasicDataForm) => {
    console.log('Form data:', data);
    // TODO: Save to backend
    if (onStepChange) {
      onStepChange(2);
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper
          currentStep={1}
          steps={VEHICLE_STEPS}
          onStepClick={onStepChange}
        />
      </div>

      <main>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          <section className="mb-6 md:mb-8">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-border">
              <div className="px-6 md:px-8 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Datum počátku pojištění
                    </label>
                    <input
                      type="date"
                      {...register('insurance.startDate', { required: 'Povinné pole' })}
                      className="w-full max-w-[220px] rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition"
                      defaultValue="2025-09-08"
                    />
                    {errors.insurance?.startDate && (
                      <p className="text-danger text-xs mt-1">{errors.insurance.startDate.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      Náhrada smlouvy
                    </span>
                    <div className="inline-flex rounded-full bg-surface-muted p-1">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={contractReplacement === true}
                          onChange={() => setValue('insurance.contractReplacement', true)}
                          className="sr-only peer"
                        />
                        <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          contractReplacement === true
                            ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                            : 'text-muted'
                        }`}>
                          Ano
                        </span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={contractReplacement === false}
                          onChange={() => setValue('insurance.contractReplacement', false)}
                          className="sr-only peer"
                        />
                        <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          contractReplacement === false
                            ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                            : 'text-muted'
                        }`}>
                          Ne
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {contractReplacement === true && (
                <div className="border-t border-border px-6 md:px-8 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Číslo smlouvy
                      </label>
                      <input
                        type="text"
                        {...register('insurance.contractNumber')}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Vyberte pojišťovnu
                      </label>
                      <select
                        {...register('insurance.insurer')}
                        className="w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition"
                      >
                        <option value="">Vyberte</option>
                        <option value="direct">Direct</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 bottom-2.5">
                        <svg
                          className="h-4 w-4 text-subtle"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 7l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Zobrazí se pouze při zakliknutí "ano" u náhrady smlouvy
                  </p>
                </div>
              )}
            </div>
          </section>

          <PolicyholderSection form={form} />
          <VehicleHolderSection form={form} />
          <VehicleSection form={form} />

          <footer className="mt-8 flex justify-end gap-3">
            <SecondaryButton type="button">
              Uložit
            </SecondaryButton>
            <PrimaryButton type="submit">
              Uložit a pokračovat
            </PrimaryButton>
          </footer>
        </form>
      </main>
    </div>
  );
};

