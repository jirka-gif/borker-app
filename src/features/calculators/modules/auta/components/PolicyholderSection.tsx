import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EntityForm } from './EntityForm';
import { SectionCard } from './ui/SectionCard';
import { VehicleInsuranceBasicDataForm } from '../types/insurance';

interface PolicyholderSectionProps {
  form: UseFormReturn<VehicleInsuranceBasicDataForm>;
}

export const PolicyholderSection: React.FC<PolicyholderSectionProps> = ({ form }) => {
  return (
    <SectionCard 
      title="Informace o pojistníkovi"
      subtitle="Zadejte informace o pojistníkovi."
    >
      <EntityForm form={form} prefix="policyholder" showConsents={true} />
    </SectionCard>
  );
};








