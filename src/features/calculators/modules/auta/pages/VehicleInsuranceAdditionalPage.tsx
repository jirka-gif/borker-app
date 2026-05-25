import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stepper } from '../components/Stepper';
import { VEHICLE_STEPS } from './vehicleSteps';
import { SectionCard } from '../components/ui/SectionCard';
import { RadioGroup } from '../components/ui/RadioGroup';
import { SelectField } from '../components/ui/SelectField';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { VehicleInsuranceAdditionalForm } from '../types/insurance';

interface VehicleInsuranceAdditionalPageProps {
  onStepChange?: (step: number) => void;
  hideHeader?: boolean;
  hideStepper?: boolean;
}

export const VehicleInsuranceAdditionalPage: React.FC<VehicleInsuranceAdditionalPageProps> = ({ onStepChange, hideHeader = false, hideStepper = false }) => {
  const form = useForm<VehicleInsuranceAdditionalForm>({
    defaultValues: {
      mandatoryInsurance: {
        limit: 'none',
      },
      cascoInsurance: {
        type: 'none',
        scope: 'allRisk',
        deductibleType: 'percentage',
      },
      additionalInsurance: {
        items: [
          { scope: 'allGlass', limit: '', deductible: '' },
          { scope: 'allGlass', limit: '1x limit', deductible: '' },
          { scope: '', limit: '', deductible: '' },
          { scope: '', limit: '', deductible: '' },
          { scope: '', limit: '', deductible: '' },
          { scope: '', limit: '', deductible: '' },
        ],
        checkboxes: {},
      },
      vehicle: {
        priceSource: 'invoice',
        vehiclePrice: 0,
        priceWithVat: false,
      },
    },
  });

  const { register, watch, setValue, formState: { errors }, control } = form;
  const cascoType = watch('cascoInsurance.type');
  const hasCascoInsurance = cascoType === 'allRisk';
  const deductibleType = watch('cascoInsurance.deductibleType');
  const mandatoryLimit = watch('mandatoryInsurance.limit');
  const hasMandatoryInsurance = mandatoryLimit !== 'none';
  const priceSource = watch('vehicle.priceSource');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    // TODO: Upload file to backend
    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const onSubmit = (_data: VehicleInsuranceAdditionalForm) => {
    // Posun na krok 3 (Kalkulace). Uložení do backendu se doplní později.
    onStepChange?.(3);
  };

  return (
    <div>
      {!hideHeader && (
        <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
          {!hideStepper && (
            <Stepper
              currentStep={2}
              steps={VEHICLE_STEPS}
              onStepClick={onStepChange}
            />
          )}
        </div>
      )}

      <main>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          {/* Pojištění vozidla section */}
          <section className="mb-6 md:mb-8">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-border">
              <div className="px-6 md:px-8 py-4">
                <div className="mb-4">
                  <h2 className="text-base md:text-lg font-semibold text-[#A82844] mb-1">
                    Parametry pojištění
                  </h2>
                  <p className="text-xs md:text-sm text-muted">
                    Zadejte základní parametry pojištění.
                  </p>
                </div>

                {/* Povinné ručení and Havarijní pojištění cards */}
                <div className="space-y-4 md:space-y-6">
                  {/* Povinné ručení card */}
                  <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <h3 className="text-sm font-semibold text-foreground">Povinné ručení</h3>
                      </div>
                      <div className="inline-flex rounded-full bg-surface-muted p-1">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={hasMandatoryInsurance === false}
                            onChange={() => setValue('mandatoryInsurance.limit', 'none')}
                            className="sr-only peer"
                          />
                          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            hasMandatoryInsurance === false
                              ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                              : 'text-muted'
                          }`}>
                            Ne
                          </span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={hasMandatoryInsurance === true}
                            onChange={() => {
                              if (!hasMandatoryInsurance) {
                                // při přepnutí na Ano nastavíme defaultní limit
                                setValue('mandatoryInsurance.limit', '50_50');
                              }
                            }}
                            className="sr-only peer"
                          />
                          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            hasMandatoryInsurance === true
                              ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                              : 'text-muted'
                          }`}>
                            Ano
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Select s limity jen pokud je zvoleno Ano */}
                    {hasMandatoryInsurance && (
                      <div className="relative">
                        <select
                          {...register('mandatoryInsurance.limit')}
                          className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                        >
                          <option value="50_50">50/50 milionů Kč</option>
                          <option value="50_60">50/60 milionů Kč</option>
                          <option value="70_70">70/70 milionů Kč</option>
                          <option value="100_100">100/100 milionů Kč</option>
                          <option value="150_150">150/150 milionů Kč</option>
                          <option value="200_200">200/200 milionů Kč</option>
                          <option value="300_300">300/300 milionů Kč</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Havarijní pojištění card */}
                  <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <h3 className="text-sm font-semibold text-foreground">Havarijní pojištění</h3>
                      </div>
                      <div className="inline-flex rounded-full bg-surface-muted p-1">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={hasCascoInsurance === false}
                            onChange={() => setValue('cascoInsurance.type', 'none')}
                            className="sr-only peer"
                          />
                          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            hasCascoInsurance === false
                              ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                              : 'text-muted'
                          }`}>
                            Ne
                          </span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            checked={hasCascoInsurance === true}
                            onChange={() => setValue('cascoInsurance.type', 'allRisk')}
                            className="sr-only peer"
                          />
                          <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            hasCascoInsurance === true
                              ? 'bg-surface text-[#8B1E38] border border-[#8B1E38] shadow-sm'
                              : 'text-muted'
                          }`}>
                            Ano
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Rozsah, Spoluúčast - only show if casco is selected (Ano) */}
                    {hasCascoInsurance && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        {/* First row: Rozsah text + select */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium text-foreground whitespace-nowrap w-24">Rozsah</label>
                          <div className="relative flex-1 max-w-md">
                            <select
                              {...register('cascoInsurance.scope')}
                              className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                            >
                              <option value="allRisk">All risk</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                              <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Second row: Spoluúčast toggle + select */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium text-foreground whitespace-nowrap w-24">Spoluúčast</label>
                          <div className="flex items-center gap-4 flex-1 max-w-md">
                            <div className="inline-flex rounded-full bg-surface-muted p-1 border border-border flex-shrink-0">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  value="percentage"
                                  {...register('cascoInsurance.deductibleType')}
                                  checked={deductibleType === 'percentage'}
                                  className="sr-only peer"
                                />
                                <span className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors ${
                                  deductibleType === 'percentage'
                                    ? 'bg-surface text-[#A82844] border border-[#A82844] shadow-sm'
                                    : 'text-muted'
                                }`}>
                                  %
                                </span>
                              </label>
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  value="fixed"
                                  {...register('cascoInsurance.deductibleType')}
                                  checked={deductibleType === 'fixed'}
                                  className="sr-only peer"
                                />
                                <span className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors ${
                                  deductibleType === 'fixed'
                                    ? 'bg-surface text-[#A82844] border border-[#A82844] shadow-sm'
                                    : 'text-muted'
                                }`}>
                                  fixní
                                </span>
                              </label>
                            </div>
                            <div className="relative flex-1">
                              <select
                                {...register('cascoInsurance.deductibleValue')}
                                className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                              >
                                <option value="">Vyberte</option>
                              </select>
                              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cena vozidla z - zobrazí se jen pokud je havarijní pojištění Ano */}
                  {hasCascoInsurance && (
                    <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">Cena vozidla z</label>
                      <div className="inline-flex flex-wrap gap-2 rounded-full bg-surface-muted px-1.5 py-1.5">
                        <label className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm cursor-pointer transition-all border ${
                          priceSource === 'invoice'
                            ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                            : 'border-transparent text-foreground hover:bg-surface/50'
                        }`}>
                          <input
                            type="radio"
                            value="invoice"
                            {...register('vehicle.priceSource')}
                            className="sr-only"
                            checked={priceSource === 'invoice'}
                          />
                          <span>Faktura</span>
                        </label>
                        <label className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm cursor-pointer transition-all border ${
                          priceSource === 'valuation'
                            ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                            : 'border-transparent text-foreground hover:bg-surface/50'
                        }`}>
                          <input
                            type="radio"
                            value="valuation"
                            {...register('vehicle.priceSource')}
                            className="sr-only"
                            checked={priceSource === 'valuation'}
                          />
                          <span>Ocenění vozidla</span>
                        </label>
                        <label className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm cursor-pointer transition-all border ${
                          priceSource === 'policyholder'
                            ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                            : 'border-transparent text-foreground hover:bg-surface/50'
                        }`}>
                          <input
                            type="radio"
                            value="policyholder"
                            {...register('vehicle.priceSource')}
                            className="sr-only"
                            checked={priceSource === 'policyholder'}
                          />
                          <span>Dle pojistníka</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Cena vozidla
                      </label>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="px-3 py-2 border border-border rounded-lg bg-surface-muted text-sm text-foreground">Kč</span>
                        <Input
                          type="number"
                          register={register('vehicle.vehiclePrice', { required: hasCascoInsurance ? 'Povinné pole' : false, valueAsNumber: true })}
                          error={errors.vehicle?.vehiclePrice?.message}
                          className="flex-1"
                          wrapperClassName="mb-0"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted whitespace-nowrap">bez DPH</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('vehicle.priceWithVat')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A82844] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A82844]"></div>
                            <span className="ml-2 text-sm text-muted whitespace-nowrap">s DPH</span>
                          </label>
                        </div>
                        {priceSource === 'valuation' && (
                          <button
                            type="button"
                            className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Ocenit vozidlo
                          </button>
                        )}
                        {priceSource === 'invoice' && (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg px-3 py-2 transition-colors min-w-[200px] flex-1 max-w-[300px] ${
                              isDragging
                                ? 'border-[#A82844] bg-brand-50'
                                : 'border-border bg-surface-muted hover:border-border-strong hover:bg-surface-muted'
                            }`}
                          >
                            {uploadedFile ? (
                              <div className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs text-foreground font-medium truncate flex-1">{uploadedFile.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setUploadedFile(null)}
                                  className="text-danger hover:text-danger text-xs flex-shrink-0"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id="invoice-upload"
                                  onChange={handleFileInputChange}
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label
                                  htmlFor="invoice-upload"
                                  className="cursor-pointer flex items-center gap-2 w-full"
                                >
                                  <svg className="w-4 h-4 text-subtle flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-xs text-muted">
                                    <span className="text-[#A82844] font-medium">Přetáhněte</span> nebo klikněte
                                  </span>
                                </label>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Připojištění section */}
          <section className="mb-6 md:mb-8">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-border">
              <div className="bg-gradient-to-r from-[#C63D56] via-[#8B1E38] to-[#A82844] px-6 md:px-8 py-5 md:py-6">
                <h1 className="text-xl md:text-2xl font-semibold text-white">
                  Připojištění
                </h1>
              </div>

              <div className="px-6 md:px-8 py-4 border-t border-border">
                <p className="text-xs md:text-sm text-muted mb-6">
                  Vyberte limity zvoleného připojištění.
                </p>

                <div className="space-y-4">
                  {/* First row with Pojištění skel, Rozsah, Limit, Spoluúčast and Ocenit skla button */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center md:pt-[28px] w-40">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">Pojištění skel</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Rozsah</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.0.scope')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="allGlass">Všechna skla</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Limit</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.0.limit')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="">Vyberte</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Spoluúčast</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.0.deductible')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="none">Bez spoluúčasti</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center md:pt-[28px]">
                      <button
                        type="button"
                        className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Ocenit skla
                      </button>
                    </div>
                  </div>

                  {/* Second row - Úrazové pojištění */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center md:pt-[28px] w-40">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">Úrazové pojištění</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Rozsah</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.1.scope')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="allGlass">Všechna skla</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Limit</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.1.limit')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="1x limit">1x limit</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third row - Náhradní vozidlo */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center md:pt-[28px] w-40">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">Náhradní vozidlo</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Limit</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.2.limit')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="">Vyberte</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>

                  {/* Fourth row - Asistenční služby */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center md:pt-[28px] w-40">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">Asistenční služby</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Rozsah</label>
                        <div className="relative">
                          <select
                            {...register('additionalInsurance.items.3.scope')}
                            className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong"
                          >
                            <option value="">Vyberte</option>
                            <option value="basic">Základní</option>
                            <option value="extended">Rozšířené</option>
                            <option value="premium">Prémiové</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-subtle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>

                  {/* Checkboxes at the bottom */}
                  <div className="pt-8 mt-6 border-t border-border">
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      <Checkbox
                        label="GAP"
                        register={register('additionalInsurance.checkboxes.gap' as any)}
                      />
                      <Checkbox
                        label="Zavazadla"
                        register={register('additionalInsurance.checkboxes.luggage' as any)}
                      />
                      <Checkbox
                        label="Zvěř"
                        register={register('additionalInsurance.checkboxes.wildlife' as any)}
                      />
                      <Checkbox
                        label="Živel"
                        register={register('additionalInsurance.checkboxes.element' as any)}
                      />
                      <Checkbox
                        label="Činnost pracovního stroje"
                        register={register('additionalInsurance.checkboxes.workMachine' as any)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer buttons */}
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
