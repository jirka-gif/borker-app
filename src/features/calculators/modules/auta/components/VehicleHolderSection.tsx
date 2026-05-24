import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup } from './ui/RadioGroup';
import { EntityForm } from './EntityForm';
import { Input } from './ui/Input';
import { SectionCard } from './ui/SectionCard';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';

interface VehicleHolderSectionProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
}

export const VehicleHolderSection: React.FC<VehicleHolderSectionProps> = ({ form }) => {
  const { watch, setValue } = form;
  const holderSameAsPolicyholder = watch('holder.sameAsPolicyholder');
  const ownerType = watch('owner.type');

  return (
    <SectionCard title="Držitel / provozovatel a vlastník vozidla">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Držitel / provozovatel vozidla</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={holderSameAsPolicyholder === true}
                onChange={() => setValue('holder.sameAsPolicyholder', true)}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
                <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Stejný s pojistníkem</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={holderSameAsPolicyholder === false}
                onChange={() => setValue('holder.sameAsPolicyholder', false)}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
                <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Jiný</span>
            </label>
          </div>
          {holderSameAsPolicyholder === false && (
            <div className="mt-5 px-6 py-5 md:px-7 md:py-6 bg-[#FDF2F4] border border-[#FBE3E7] rounded-2xl space-y-4">
              <h4 className="text-sm font-semibold text-[#8B1E38]">Držitel / provozovatel vozidla</h4>
              <EntityForm form={form} prefix="holder.entity" showConsents={false} />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Vlastník vozidla</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="sameAsPolicyholder"
                {...form.register('owner.type')}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
                <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Stejný s pojistníkem</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="sameAsHolder"
                {...form.register('owner.type')}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
                <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Stejný s držitelem/provozovatelem</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="other"
                {...form.register('owner.type')}
                className="sr-only peer"
              />
              <div className="h-4 w-4 rounded-full border-2 border-border-strong flex items-center justify-center peer-checked:border-[#A82844] transition-colors">
                <div className="h-2 w-2 rounded-full bg-[#A82844] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-foreground">Jiný</span>
            </label>
          </div>
          {ownerType === 'other' && (
            <div className="mt-5 px-6 py-5 md:px-7 md:py-6 bg-[#FDF2F4] border border-[#FBE3E7] rounded-2xl space-y-4">
              <h4 className="text-sm font-semibold text-[#8B1E38]">Vlastník vozidla</h4>
              <EntityForm form={form} prefix="owner.entity" showConsents={false} />
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

