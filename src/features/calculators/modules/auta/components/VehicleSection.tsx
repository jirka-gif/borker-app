import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from './ui/Input';
import { SelectField } from './ui/SelectField';
import { RadioGroup } from './ui/RadioGroup';
import { Checkbox } from './ui/Checkbox';
import { DatePicker } from './ui/DatePicker';
import { SectionCard } from './ui/SectionCard';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';
import { loadVehicleData } from '../services/insurersApi';

interface VehicleSectionProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
}

export const VehicleSection: React.FC<VehicleSectionProps> = ({ form }) => {
  const { register, watch, setValue, formState: { errors }, control } = form;
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [vehicleError, setVehicleError] = useState<string>();
  const [showAllVehicleData, setShowAllVehicleData] = useState(false);
  const [isDraggingVehicleDoc, setIsDraggingVehicleDoc] = useState(false);
  const [uploadedVehicleDoc, setUploadedVehicleDoc] = useState<File | null>(null);
  const hasExistingDamage = watch('vehicle.hasExistingDamage');

  const handleLoadVehicleData = async () => {
    const plateNumber = watch('vehicle.plateNumber');
    const vin = watch('vehicle.vin');
    
    if (!plateNumber && !vin) {
      setVehicleError('Zadejte SPZ nebo VIN');
      return;
    }

    setLoadingVehicle(true);
    setVehicleError(undefined);
    try {
      const data = await loadVehicleData({ plateNumber, vin });
      if (data.brand) setValue('vehicle.brand', data.brand);
      if (data.model) setValue('vehicle.model', data.model);
      if (data.engineCapacity) setValue('vehicle.engineCapacity', data.engineCapacity);
      if (data.maxPower) setValue('vehicle.maxPower', data.maxPower);
      if (data.maxPermittedWeight) setValue('vehicle.maxPermittedWeight', data.maxPermittedWeight);
      if (data.firstRegistrationDate) setValue('vehicle.firstRegistrationDate', data.firstRegistrationDate);
      if (data.seatCount) setValue('vehicle.seatCount', data.seatCount);
    } catch (error) {
      setVehicleError(error instanceof Error ? error.message : 'Chyba při načítání dat');
    } finally {
      setLoadingVehicle(false);
    }
  };

  const handleVehicleDocSelect = (file: File) => {
    // TODO: Upload file to backend and extract vehicle data
    setUploadedVehicleDoc(file);
  };

  const handleVehicleDocDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVehicleDoc(true);
  };

  const handleVehicleDocDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVehicleDoc(false);
  };

  const handleVehicleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVehicleDoc(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleVehicleDocSelect(file);
    }
  };

  const handleVehicleDocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVehicleDocSelect(file);
    }
  };

  return (
    <SectionCard 
      title="Informace o vozidle"
      subtitle="Využijte automatické vyplnění pomocí SPZ a čísla velkého technického průkazu nebo VIN čísla."
    >
      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-surface">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.5fr)_auto] gap-3 md:gap-4 items-end">
            <Input
              label="SPZ"
              register={register('vehicle.plateNumber')}
              wrapperClassName="mb-0"
            />
            <span className="hidden md:inline text-sm text-muted text-center self-end mb-4">nebo</span>
            <Input
              label="VIN"
              placeholder="Např. WMWXP7C64GZA4307"
              register={register('vehicle.vin')}
              wrapperClassName="mb-0"
            />
            <button
              type="button"
              onClick={handleLoadVehicleData}
              disabled={loadingVehicle}
              className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {loadingVehicle ? 'Načítání...' : 'Načíst údaje o vozidle'}
            </button>
          </div>
          {vehicleError && <p className="text-danger text-xs mt-1">{vehicleError}</p>}
          
          <div className="mt-4 pt-4 border-t border-border">
            <div
              onDragOver={handleVehicleDocDragOver}
              onDragLeave={handleVehicleDocDragLeave}
              onDrop={handleVehicleDocDrop}
              className={`border-2 border-dashed rounded-lg p-3 transition-colors ${
                isDraggingVehicleDoc
                  ? 'border-[#A82844] bg-brand-50'
                  : 'border-border bg-surface-muted hover:border-border-strong hover:bg-surface-muted'
              }`}
            >
              {uploadedVehicleDoc ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs text-foreground font-medium truncate flex-1">{uploadedVehicleDoc.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedVehicleDoc(null)}
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
                    id="vehicle-doc-upload"
                    onChange={handleVehicleDocInputChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="vehicle-doc-upload"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-subtle flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-xs text-muted">
                        <span className="text-[#A82844] font-medium">Přetáhněte</span> nebo klikněte
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">Nahrát doklad k vozidlu - automatické načtení dostupných informací</div>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAllVehicleData(!showAllVehicleData)}
            className="mt-3 text-sm text-[#A82844] hover:text-[#8B1E38] underline"
          >
            {showAllVehicleData ? 'Skrýt veškeré údaje o vozidle' : 'Zobrazit veškeré údaje o vozidle'}
          </button>
        </div>

        {showAllVehicleData && (
          <div className="mt-5 px-6 py-5 md:px-7 md:py-6 bg-[#FDF2F4] border border-[#FBE3E7] rounded-2xl space-y-4">
            <h4 className="text-sm font-semibold text-[#8B1E38]">Informace o vozidle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <SelectField
                label="Druh registrační značky (SPZ)"
                register={register('vehicle.registrationType')}
                options={[
                  { value: 'permanent', label: 'Stálá' },
                  { value: 'temporary', label: 'Dočasná' },
                ]}
                wrapperClassName="mb-0"
              />
              <SelectField
                label="Druh vozidla"
                register={register('vehicle.vehicleType')}
                options={[
                  { value: 'passenger', label: 'Osobní' },
                  { value: 'commercial', label: 'Užitkové' },
                ]}
                wrapperClassName="mb-0"
              />
              <SelectField
                label="Palivo"
                register={register('vehicle.fuelType')}
                options={[
                  { value: 'gasoline', label: 'Benzín' },
                  { value: 'diesel', label: 'Nafta' },
                  { value: 'electric', label: 'Elektřina' },
                ]}
                wrapperClassName="mb-0"
              />
              <SelectField
                label="Tovární značka"
                register={register('vehicle.brand', { required: 'Povinné pole' })}
                errorMessage={errors.vehicle?.brand?.message}
                options={[
                  { value: '', label: 'Vyberte' },
                  { value: 'volkswagen', label: 'Volkswagen' },
                  { value: 'skoda', label: 'Škoda' },
                ]}
                wrapperClassName="mb-0"
              />
              <SelectField
                label="Model"
                register={register('vehicle.model', { required: 'Povinné pole' })}
                errorMessage={errors.vehicle?.model?.message}
                options={[
                  { value: '', label: 'Vyberte' },
                  { value: 'golf', label: 'VW Golf 6 1.5 TSI' },
                ]}
                wrapperClassName="mb-0"
              />
              <SelectField
                label="Použití"
                register={register('vehicle.usage')}
                options={[
                  { value: 'normal', label: 'Běžné použití' },
                  { value: 'commercial', label: 'Komerční' },
                ]}
                wrapperClassName="mb-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <Input
                label="Zdvihový objem"
                type="number"
                register={register('vehicle.engineCapacity', { required: 'Povinné pole', valueAsNumber: true })}
                error={errors.vehicle?.engineCapacity?.message}
                wrapperClassName="mb-0"
              />
              <Input
                label="Maximální výkon"
                type="number"
                register={register('vehicle.maxPower', { required: 'Povinné pole', valueAsNumber: true })}
                error={errors.vehicle?.maxPower?.message}
                wrapperClassName="mb-0"
              />
              <Input
                label="Největší technicky přípustná hmotnost"
                type="number"
                register={register('vehicle.maxPermittedWeight', { required: 'Povinné pole', valueAsNumber: true })}
                error={errors.vehicle?.maxPermittedWeight?.message}
                wrapperClassName="mb-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <Input
                label="Počet míst k sezení"
                type="number"
                register={register('vehicle.seatCount', { required: 'Povinné pole', valueAsNumber: true })}
                error={errors.vehicle?.seatCount?.message}
                wrapperClassName="mb-0"
              />
              <DatePicker
                label="Datum první registrace"
                register={register('vehicle.firstRegistrationDate', { required: 'Povinné pole' })}
                error={errors.vehicle?.firstRegistrationDate?.message}
                wrapperClassName="mb-0"
              />
            </div>
          </div>
        )}

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Kde proběhla první registrace vozidla
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="cz"
              {...register('vehicle.origin')}
              className="sr-only peer"
            />
            <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
              <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-sm text-foreground">v ČR</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="abroad"
              {...register('vehicle.origin')}
              className="sr-only peer"
            />
            <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
              <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-sm text-foreground">v zahraničí (individuální dovoz)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          label="Datum nákupu vozidla"
          register={register('vehicle.purchaseDate', { required: 'Povinné pole' })}
          error={errors.vehicle?.purchaseDate?.message}
          wrapperClassName="mb-0"
        />
        <Input
          label="Stav tachometru"
          type="number"
          placeholder="Např. 68 000"
          register={register('vehicle.odometer', { required: 'Povinné pole', valueAsNumber: true })}
          error={errors.vehicle?.odometer?.message}
          wrapperClassName="mb-0"
        />
      </div>

      <div className="border border-border rounded-lg p-4 bg-surface">
        <Input
          label="Roční nájezd"
          type="number"
          register={register('vehicle.annualMileage', { required: 'Povinné pole', valueAsNumber: true })}
          error={errors.vehicle?.annualMileage?.message}
          wrapperClassName="mb-0"
        />
        <p className="text-xs text-subtle mt-1">
          Roční nájezd v některých pojišťovnách ovlivňuje pojistné
        </p>
      </div>

      <div className="border border-border rounded-lg p-4 bg-surface">
        <h4 className="text-sm font-medium text-foreground mb-3">Výbava vozidla</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Checkbox
            label="Parkovací asistent"
            register={register('vehicle.equipment.parkingAssistant')}
          />
          <Checkbox
            label="Automatická převodovka"
            register={register('vehicle.equipment.automaticTransmission')}
          />
          <Checkbox
            label="Pohon všech kol"
            register={register('vehicle.equipment.fourWheelDrive')}
          />
          <Checkbox
            label="Panoramatická střecha"
            register={register('vehicle.equipment.panoramicRoof')}
          />
        </div>
      </div>

      <Checkbox
        label="Vozidlo má stávající poškození"
        register={register('vehicle.hasExistingDamage')}
      />

      {hasExistingDamage && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Poškození popsat
          </label>
          <textarea
            {...register('vehicle.existingDamageDescription')}
            rows={4}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition resize-none"
            placeholder="Popište stávající poškození vozidla..."
          />
        </div>
      )}
    </div>
    </SectionCard>
  );
};

