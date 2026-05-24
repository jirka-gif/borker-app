import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { SectionCard } from '../../../components/ui/SectionCard';
import { Input } from '../../../components/ui/Input';
import { DatePicker } from '../../../components/ui/DatePicker';
import { PrimaryButton, SecondaryButton } from '../../../components/ui/Button';
import { TravelFormValues } from '../TravelInsuranceCalculator';

interface TravelStepTravellersProps {
  onNext: () => void;
  onBack: () => void;
}

export function TravelStepTravellers({ onNext, onBack }: TravelStepTravellersProps) {
  const { control, formState: { errors }, watch } = useFormContext<TravelFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travellers',
  });

  const travellers = watch('travellers');

  const handleAddTraveller = () => {
    append({
      id: `traveller-${Date.now()}`,
      name: '',
      dateOfBirth: '',
    });
  };

  const handleRemoveTraveller = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <SectionCard
      title="Kdo jede s tebou?"
      subtitle="Přidej všechny osoby, které chceš pojistit"
    >

      <div className="space-y-6">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="p-4 border border-border rounded-lg bg-surface-muted"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-foreground">
                  Osoba {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTraveller(index)}
                    className="text-sm text-danger hover:text-danger"
                  >
                    Odstranit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name={`travellers.${index}.name`}
                  label="Jméno *"
                  placeholder="Např. Jan Novák"
                  className="w-full"
                />
                <DatePicker
                  name={`travellers.${index}.dateOfBirth`}
                  label="Datum narození *"
                  className="w-full"
                />
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddTraveller}
          className="w-full py-2 px-4 border-2 border-dashed border-border rounded-lg text-muted hover:border-border-strong hover:text-foreground transition-colors"
        >
          + Přidat osobu
        </button>

        {errors.travellers && (
          <p className="text-sm text-danger">{errors.travellers.message as string}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <SecondaryButton onClick={onBack}>
          Zpět
        </SecondaryButton>
        <PrimaryButton onClick={onNext}>
          Pokračovat
        </PrimaryButton>
      </div>
    </SectionCard>
  );
}

