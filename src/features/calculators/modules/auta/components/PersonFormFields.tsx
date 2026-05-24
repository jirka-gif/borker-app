import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from './ui/Input';
import { SelectField } from './ui/SelectField';
import { Checkbox } from './ui/Checkbox';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';

interface PersonFormFieldsProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
  prefix: string;
  showConsents?: boolean;
  isSelfEmployed?: boolean;
  /** Cizinec – místo rodného čísla se zobrazí datum narození a skryje se přepínač. */
  isForeigner?: boolean;
}

export const PersonFormFields: React.FC<PersonFormFieldsProps> = ({
  form,
  prefix,
  showConsents = true,
  isSelfEmployed = false,
  isForeigner = false,
}) => {
  const { register, watch, formState: { errors } } = form;
  const noBirthNumber = watch(`${prefix}.noBirthNumber` as any);
  // Cizinec vždy zadává datum narození místo rodného čísla.
  const useBirthDate = isForeigner || noBirthNumber;
  const hasDifferentCorrespondenceAddress = watch(`${prefix}.hasDifferentCorrespondenceAddress` as any);

  return (
    <div className="space-y-4">
      {isSelfEmployed && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">
            IČO
          </label>
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <div className="flex-1 md:flex-initial md:max-w-[280px]">
              <input
                type="text"
                placeholder="Např. 18628443"
                {...register(`${prefix}.ico` as any)}
                className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
              />
              {(errors as any)[prefix]?.ico?.message && (
                <p className="text-danger text-xs mt-1">{(errors as any)[prefix]?.ico?.message}</p>
              )}
            </div>
            <button
              type="button"
              className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Načíst údaje
            </button>
          </div>
        </div>
      )}

      {!isSelfEmployed && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">
            {useBirthDate ? 'Datum narození' : 'Rodné číslo'}
          </label>
          <div className="w-full md:w-[280px]">
              {useBirthDate ? (
                <input
                  type="date"
                  {...register(`${prefix}.birthDate` as any)}
                  className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Např. 7812227665"
                  {...register(`${prefix}.birthNumber` as any)}
                  className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
                />
              )}
              {(errors as any)[prefix]?.birthNumber?.message && (
                <p className="text-danger text-xs mt-1">{(errors as any)[prefix]?.birthNumber?.message}</p>
              )}
              {!useBirthDate && !(errors as any)[prefix]?.birthNumber?.message && (
                <p className="text-xs text-muted mt-1">Zadejte číslice bez mezer, lomítek či pomlček.</p>
              )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] gap-3 md:gap-4">
        <SelectField
          label="Titul před jménem"
          register={register(`${prefix}.titleBefore` as any)}
          options={[
            { value: '', label: 'Vyberte' },
            { value: 'Ing.', label: 'Ing.' },
            { value: 'MUDr.', label: 'MUDr.' },
          ]}
          wrapperClassName="mb-0"
        />
        <Input
          label="Jméno"
          register={register(`${prefix}.firstName` as any, { required: 'Povinné pole' })}
          error={(errors as any)[prefix]?.firstName?.message}
          wrapperClassName="mb-0"
        />
        <Input
          label="Příjmení"
          register={register(`${prefix}.lastName` as any, { required: 'Povinné pole' })}
          error={(errors as any)[prefix]?.lastName?.message}
          wrapperClassName="mb-0"
        />
        <Input
          label="Titul za jménem"
          placeholder="Např. PhD"
          register={register(`${prefix}.titleAfter` as any)}
          wrapperClassName="mb-0"
        />
      </div>

      {isSelfEmployed && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">
            {noBirthNumber ? 'Datum narození' : 'Rodné číslo (nepovinný údaj)'}
          </label>
          <div className="w-full md:w-[280px]">
              {noBirthNumber ? (
                <input
                  type="date"
                  {...register(`${prefix}.birthDate` as any)}
                  className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Např. 7812227665"
                  {...register(`${prefix}.birthNumber` as any)}
                  className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
                />
              )}
              {(errors as any)[prefix]?.birthNumber?.message && (
                <p className="text-danger text-xs mt-1">{(errors as any)[prefix]?.birthNumber?.message}</p>
              )}
              {!noBirthNumber && !(errors as any)[prefix]?.birthNumber?.message && (
                <p className="text-xs text-muted mt-1">Zadejte číslice bez mezer, lomítek či pomlček. (Nepovinné)</p>
              )}
          </div>
          <div className="mt-2">
            <Checkbox
              label="Klient nemá rodné číslo (cizinec)"
              register={register(`${prefix}.noBirthNumber` as any)}
            />
          </div>
        </div>
      )}

      <Input
        label="Adresa"
        register={register(`${prefix}.address` as any, { required: 'Povinné pole' })}
        error={(errors as any)[prefix]?.address?.message}
        icon={<span>🔍</span>}
      />

      <div>
        <Checkbox
          label="Korespondenční adresa je odlišná od uvedené adresy"
          register={register(`${prefix}.hasDifferentCorrespondenceAddress` as any)}
        />
        {hasDifferentCorrespondenceAddress && (
          <div className="mt-2">
            <Input
              label="Korespondenční adresa"
              register={register(`${prefix}.correspondenceAddress` as any)}
              icon={<span>🔍</span>}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">
            Mobilní telefon
          </label>
          <div className="flex gap-2">
            <SelectField
              options={[{ value: '+420', label: '+420' }]}
              defaultValue="+420"
              className="max-w-[110px]"
              wrapperClassName="mb-0"
            />
            <Input
              register={register(`${prefix}.phone` as any)}
              className="flex-1"
              wrapperClassName="mb-0"
            />
          </div>
        </div>
        <Input
          label="E-mail"
          type="email"
          register={register(`${prefix}.email` as any)}
          wrapperClassName="mb-0"
        />
      </div>

      {showConsents && (
        <div>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Checkbox
              label="Souhlas s elektronickou komunikací"
              register={register(`${prefix}.consentElectronicCommunication` as any)}
            />
            <Checkbox
              label="Souhlas s marketingovou komunikací"
              register={register(`${prefix}.consentMarketingCommunication` as any)}
            />
            <Checkbox
              label="Souhlas se zpracováním údajů"
              register={register(`${prefix}.consentDataProcessing` as any)}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            Změna souhlasu s elektronickou komunikací může mít vliv na cenu pojištění. Po změně souhlasu s elektronickou komunikací je třeba se vrátit o krok zpět a vybranou nabídku překalkulovat.
          </p>
        </div>
      )}
    </div>
  );
};

