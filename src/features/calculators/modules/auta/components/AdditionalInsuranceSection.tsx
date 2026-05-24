import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { SelectField } from './ui/SelectField';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';
import { SectionCard } from './ui/SectionCard';
import { VehicleInsuranceAdditionalForm } from '../types/insurance';

interface AdditionalInsuranceSectionProps {
  form: UseFormReturn<VehicleInsuranceAdditionalForm>;
}

export const AdditionalInsuranceSection: React.FC<AdditionalInsuranceSectionProps> = ({ form }) => {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalInsurance.items',
  });

  // Initialize with default items if empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ scope: 'allGlass', limit: '', deductible: '' });
      append({ scope: 'allGlass', limit: '1x limit', deductible: '' });
      append({ scope: '', limit: '', deductible: '' });
      append({ scope: '', limit: '', deductible: '' });
      append({ scope: '', limit: '', deductible: '' });
      append({ scope: '', limit: '', deductible: '' });
    }
  }, [fields.length, append]);

  return (
    <SectionCard
      title="Připojištění"
      subtitle="Vyberte limity zvoleného připojištění."
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Rozsah</label>
              {index === 0 ? (
                <SelectField
                  {...register(`additionalInsurance.items.${index}.scope` as const)}
                  className="w-full"
                >
                  <option value="allGlass">Všechna skla</option>
                </SelectField>
              ) : index === 1 ? (
                <SelectField
                  {...register(`additionalInsurance.items.${index}.scope` as const)}
                  className="w-full"
                >
                  <option value="allGlass">Všechna skla</option>
                </SelectField>
              ) : (
                <Input
                  type="text"
                  placeholder="Zadejte rozsah"
                  register={register(`additionalInsurance.items.${index}.scope` as any)}
                  wrapperClassName="mb-0"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Limit</label>
              {index === 0 ? (
                <SelectField
                  {...register(`additionalInsurance.items.${index}.limit` as const)}
                  className="w-full"
                >
                  <option value="">Vyberte</option>
                </SelectField>
              ) : index === 1 ? (
                <SelectField
                  {...register(`additionalInsurance.items.${index}.limit` as const)}
                  className="w-full"
                >
                  <option value="1x limit">1x limit</option>
                </SelectField>
              ) : (
                <Input
                  type="text"
                  placeholder="Zadejte limit"
                  register={register(`additionalInsurance.items.${index}.limit` as any)}
                  wrapperClassName="mb-0"
                />
              )}
            </div>
            {index === 0 && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Spoluúčast</label>
                  <SelectField
                    {...register(`additionalInsurance.items.${index}.deductible` as const)}
                    className="w-full"
                  >
                    <option value="noDeductible">Bez spoluúčasti</option>
                  </SelectField>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-[#A82844] text-white rounded-lg hover:bg-[#8B1E38] transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap w-full justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Ocenit skla
                  </button>
                </div>
              </>
            )}
            {index === 1 && (
              <div className="md:col-span-2"></div>
            )}
            {index > 1 && (
              <div className="md:col-span-2"></div>
            )}
          </div>
        ))}

        {/* Checkboxes at the bottom */}
        <div className="mt-6 space-y-2">
          <Checkbox
            label="Checkbox 1"
            register={register('additionalInsurance.checkboxes.checkbox1' as any)}
          />
          <Checkbox
            label="Checkbox 2"
            register={register('additionalInsurance.checkboxes.checkbox2' as any)}
          />
          <Checkbox
            label="Checkbox 3"
            register={register('additionalInsurance.checkboxes.checkbox3' as any)}
          />
          <Checkbox
            label="Checkbox 4"
            register={register('additionalInsurance.checkboxes.checkbox4' as any)}
          />
        </div>
      </div>
    </SectionCard>
  );
};

