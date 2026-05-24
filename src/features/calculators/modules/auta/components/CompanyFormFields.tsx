import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from './ui/Input';
import { SelectField } from './ui/SelectField';
import { Checkbox } from './ui/Checkbox';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';
import { loadCompanyData } from '../services/insurersApi';

interface CompanyFormFieldsProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
  prefix: string;
}

export const CompanyFormFields: React.FC<CompanyFormFieldsProps> = ({
  form,
  prefix,
}) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const [loadingIco, setLoadingIco] = useState(false);
  const [icoError, setIcoError] = useState<string>();
  const hasDifferentCorrespondenceAddress = watch(`${prefix}.hasDifferentCorrespondenceAddress` as any);
  const meetsLargeCompanyCriteria = watch(`${prefix}.meetsLargeCompanyCriteria` as any);
  const ico = watch(`${prefix}.ico` as any);
  const representativeNoBirthNumber = watch(`${prefix}.representative.noBirthNumber` as any);

  const handleLoadCompanyData = async () => {
    if (!ico) return;
    setLoadingIco(true);
    setIcoError(undefined);
    try {
      const data = await loadCompanyData(ico);
      setValue(`${prefix}.companyName` as any, data.name);
      setValue(`${prefix}.address` as any, data.address);
    } catch (error) {
      setIcoError(error instanceof Error ? error.message : 'Chyba při načítání dat');
    } finally {
      setLoadingIco(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-foreground mb-1">
          IČO
        </label>
        <div className="flex flex-col md:flex-row gap-3 items-start">
          <div className="flex-1 md:flex-initial md:max-w-[280px]">
            <input
              type="text"
              placeholder="Např. 18628443"
              {...register(`${prefix}.ico` as any, { required: 'Povinné pole' })}
              className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
            />
            {(errors as any)[prefix]?.ico?.message && (
              <p className="text-danger text-xs mt-1">{(errors as any)[prefix]?.ico?.message}</p>
            )}
            {icoError && (
              <p className="text-danger text-xs mt-1">{icoError}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLoadCompanyData}
            disabled={loadingIco}
            className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {loadingIco ? 'Načítání...' : 'Načíst údaje'}
          </button>
        </div>
      </div>

      <Input
        label="Název společnosti"
        register={register(`${prefix}.companyName` as any, { required: 'Povinné pole' })}
        error={(errors as any)[prefix]?.companyName?.message}
      />

      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Zástupce společnosti</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SelectField
            label="Pozice v společnosti"
            register={register(`${prefix}.representative.position` as any)}
            options={[
              { value: 'jednatel', label: 'Jednatel' },
              { value: 'spolujednatel', label: 'Spolujednatel' },
            ]}
            wrapperClassName="mb-0"
          />
          <SelectField
            label="Titul před jménem"
            register={register(`${prefix}.representative.titleBefore` as any)}
            options={[
              { value: '', label: 'Vyberte' },
              { value: 'Ing.', label: 'Ing.' },
            ]}
            wrapperClassName="mb-0"
          />
          <Input
            label="Jméno"
            register={register(`${prefix}.representative.firstName` as any, { required: 'Povinné pole' })}
            error={(errors as any)[prefix]?.representative?.firstName?.message}
            wrapperClassName="mb-0"
          />
          <Input
            label="Příjmení"
            register={register(`${prefix}.representative.lastName` as any, { required: 'Povinné pole' })}
            error={(errors as any)[prefix]?.representative?.lastName?.message}
            wrapperClassName="mb-0"
          />
          <Input
            label="Titul za jménem"
            placeholder="Např. PhD"
            register={register(`${prefix}.representative.titleAfter` as any)}
            wrapperClassName="mb-0"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-foreground mb-1">
          {representativeNoBirthNumber ? 'Datum narození' : 'Rodné číslo (nepovinný údaj)'}
        </label>
        <div className="w-full md:w-[280px]">
            {representativeNoBirthNumber ? (
              <input
                type="date"
                {...register(`${prefix}.representative.birthDate` as any)}
                className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
              />
            ) : (
              <input
                type="text"
                placeholder="Např. 7812227665"
                {...register(`${prefix}.representative.birthNumber` as any)}
                className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-subtle focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:ring-offset-0 outline-none transition hover:shadow-sm"
              />
            )}
            {(errors as any)[prefix]?.representative?.birthNumber?.message && (
              <p className="text-danger text-xs mt-1">{(errors as any)[prefix]?.representative?.birthNumber?.message}</p>
            )}
            {!representativeNoBirthNumber && !(errors as any)[prefix]?.representative?.birthNumber?.message && (
              <p className="text-xs text-muted mt-1">Zadejte číslice bez mezer, lomítek či pomlček. (Nepovinné)</p>
            )}
        </div>
        <div className="mt-2">
          <Checkbox
            label="Klient nemá rodné číslo (cizinec)"
            register={register(`${prefix}.representative.noBirthNumber` as any)}
          />
        </div>
      </div>

      <Input
        label="Adresa"
        register={register(`${prefix}.address` as any, { required: 'Povinné pole' })}
        error={(errors as any)[prefix]?.address?.message}
        icon={<span>🔍</span>}
      />

      <Checkbox
        label="Korespondenční adresa je odlišná od uvedené adresy"
        register={register(`${prefix}.hasDifferentCorrespondenceAddress` as any)}
      />

      {hasDifferentCorrespondenceAddress && (
        <Input
          label="Korespondenční adresa"
          register={register(`${prefix}.correspondenceAddress` as any)}
          icon={<span>🔍</span>}
        />
      )}

      <div className="mt-6 p-4 bg-surface-muted rounded-lg">
        <p className="text-sm font-medium text-foreground mb-3">
          Splňuje pojistník alespoň 2 ze 3 níže uvedených podmínek?
        </p>
        <ul className="list-disc list-inside text-sm text-muted mb-4 space-y-1">
          <li>Je čistý obrat min. 13 600 000 EUR (cca 340 000 000 Kč)?</li>
          <li>Je úhrn rozvahy min. 6 600 000 EUR (cca 165 000 000 Kč)?</li>
          <li>Je průměrný roční stav zaměstnanců min. 250?</li>
        </ul>
        <div className="border border-border rounded-lg p-3 bg-surface">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={meetsLargeCompanyCriteria === true}
                onChange={() => setValue(`${prefix}.meetsLargeCompanyCriteria` as any, true)}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-brand-600 transition-colors">
                <div className="h-2 w-2 rounded-full bg-brand-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Ano</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={meetsLargeCompanyCriteria === false}
                onChange={() => setValue(`${prefix}.meetsLargeCompanyCriteria` as any, false)}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-brand-600 transition-colors">
                <div className="h-2 w-2 rounded-full bg-brand-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Ne</span>
            </label>
          </div>
        </div>
      </div>

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
  );
};

