import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup } from './ui/RadioGroup';
import { SelectField } from './ui/SelectField';
import { PillSelectField } from './ui/PillSelectField';
import { SectionCard } from './ui/SectionCard';
import { VehicleInsuranceAdditionalForm } from '../types/insurance';

interface InsuranceParametersSectionProps {
  form: UseFormReturn<VehicleInsuranceAdditionalForm>;
}

export const InsuranceParametersSection: React.FC<InsuranceParametersSectionProps> = ({ form }) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const mandatoryLimit = watch('mandatoryInsurance.limit');
  const cascoType = watch('cascoInsurance.type');
  const cascoScope = watch('cascoInsurance.scope');
  const deductibleType = watch('cascoInsurance.deductibleType');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Povinné ručení */}
        <SectionCard title="Povinné ručení">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <RadioGroup
            name="mandatoryInsurance.limit"
            options={[
              { value: 'none', label: 'bez POV' },
              { value: '50_50', label: '50/50 milionů Kč' },
              { value: '50_60', label: '50/60 milionů Kč' },
              { value: '70_70', label: '70/70 milionů Kč' },
              { value: '100_100', label: '100/100 milionů Kč' },
              { value: '150_150', label: '150/150 milionů Kč' },
              { value: '200_200', label: '200/200 milionů Kč' },
              { value: '300_300', label: '300/300 milionů Kč' },
            ]}
            register={register('mandatoryInsurance.limit')}
            control={form.control}
            horizontal={false}
          />
        </SectionCard>

        {/* Havarijní pojištění */}
        <SectionCard title="Havarijní pojištění">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <RadioGroup
            name="cascoInsurance.type"
            options={[
              { value: 'none', label: 'bez HAV' },
              { value: 'allRisk', label: 'All risk' },
            ]}
            register={register('cascoInsurance.type')}
            control={form.control}
            horizontal={false}
          />
        </SectionCard>
      </div>

      {/* Rozsah, Spoluúčast controls */}
      {cascoType === 'allRisk' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Rozsah</label>
            <SelectField
              {...register('cascoInsurance.scope')}
              className="w-full"
            >
              <option value="allRisk">All risk</option>
            </SelectField>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Spoluúčast</label>
            <div className="inline-flex flex-wrap gap-2 rounded-full bg-surface-muted px-1.5 py-1.5">
              <label className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm cursor-pointer transition-all border ${
                deductibleType === 'percentage'
                  ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                  : 'border-transparent text-foreground hover:bg-surface/50'
              }`}>
                <input
                  type="radio"
                  value="percentage"
                  {...register('cascoInsurance.deductibleType')}
                  className="sr-only"
                  checked={deductibleType === 'percentage'}
                />
                <span>%</span>
              </label>
              <label className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm cursor-pointer transition-all border ${
                deductibleType === 'fixed'
                  ? 'bg-surface border-[#A82844] text-[#A82844] font-semibold shadow-sm'
                  : 'border-transparent text-foreground hover:bg-surface/50'
              }`}>
                <input
                  type="radio"
                  value="fixed"
                  {...register('cascoInsurance.deductibleType')}
                  className="sr-only"
                  checked={deductibleType === 'fixed'}
                />
                <span>fixní</span>
              </label>
            </div>
            {deductibleType && (
              <SelectField
                {...register('cascoInsurance.deductibleValue')}
                className="w-full mt-2"
              >
                <option value="">Vyberte</option>
              </SelectField>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

