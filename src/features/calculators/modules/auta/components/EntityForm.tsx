import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup } from './ui/RadioGroup';
import { PersonFormFields } from './PersonFormFields';
import { CompanyFormFields } from './CompanyFormFields';
import { VehicleInsuranceBasicDataForm, PolicyholderType } from '../types/insurance';

interface EntityFormProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
  prefix: string;
  showConsents?: boolean;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  form,
  prefix,
  showConsents = true,
}) => {
  const { watch, control } = form;
  const type = watch(`${prefix}.type` as any) as PolicyholderType;

  return (
    <div>
      <div className="mb-6 pb-6 border-b border-border">
        <div className="border border-border rounded-lg p-4 bg-surface">
          <RadioGroup
            label="Typ"
            name={`${prefix}.type`}
            register={form.register(`${prefix}.type` as any)}
            control={control}
            options={[
              { value: 'person', label: 'Občan' },
              { value: 'selfEmployed', label: 'Fyzická osoba podnikatel' },
              { value: 'company', label: 'Právnická osoba' },
              { value: 'foreigner', label: 'Cizinec' },
            ]}
            horizontal={true}
            fullWidth={true}
            className="mb-0"
          />
        </div>
      </div>

      {type === 'person' && (
        <PersonFormFields form={form} prefix={`${prefix}.person`} showConsents={showConsents} isSelfEmployed={false} />
      )}

      {type === 'selfEmployed' && (
        <PersonFormFields form={form} prefix={`${prefix}.selfEmployed`} showConsents={showConsents} isSelfEmployed={true} />
      )}

      {type === 'company' && (
        <CompanyFormFields form={form} prefix={`${prefix}.company`} />
      )}

      {type === 'foreigner' && (
        <PersonFormFields form={form} prefix={`${prefix}.foreigner`} showConsents={showConsents} isForeigner={true} />
      )}
    </div>
  );
};

