import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import {
  Briefcase,
  Bus,
  Car,
  Earth,
  Globe,
  Globe2,
  MapPin,
  Mountain,
  Plane,
  Route,
  ShieldCheck,
  Trophy,
  Umbrella,
} from 'lucide-react';
import { SectionCard } from '../../../components/ui/SectionCard';
import { DestinationCards } from '../../../components/ui/DestinationCards';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Input } from '../../../components/ui/Input';
import { SelectField } from '../../../components/ui/SelectField';
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch';
import { PrimaryButton, SecondaryButton } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TravelFormValues } from '../TravelInsuranceCalculator';

interface TravelStepDestinationProps {
  onNext: () => void;
  onBack: () => void;
}

const destinationZoneOptions = [
  {
    value: 'eu',
    label: 'Evropa',
    subtitle: 'a vybrané státy bez ČR',
    icon: <Globe className="h-10 w-10 text-brand-600" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: 'world',
    label: 'Svět',
    subtitle: 'bez USA',
    icon: <Globe2 className="h-10 w-10 text-brand-600" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: 'world_with_usa',
    label: 'Celý Svět',
    subtitle: 'včetně USA',
    icon: <Earth className="h-10 w-10 text-brand-600" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: 'cz',
    label: 'Česká Republika',
    subtitle: 'tábory, lyžáky, ...',
    icon: <MapPin className="h-10 w-10 text-brand-600" strokeWidth={1.5} aria-hidden="true" />,
  },
];

const iconClass = 'h-10 w-10 text-brand-600';

const transportationOptions = [
  { value: 'plane', label: 'Letadlem', icon: <Plane className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'car', label: 'Autem', icon: <Car className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'car_and_plane', label: 'Autem i letadlem', icon: <Route className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'other', label: 'Vše ostatní', icon: <Bus className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
];

const tripTypeOptions = [
  { value: 'work', label: 'Pracovní', icon: <Briefcase className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'relax', label: 'Relax', icon: <Umbrella className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'adrenaline', label: 'Adrenalin & Sport', icon: <Mountain className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'organized_sport', label: 'Organizovaný sport', icon: <Trophy className={iconClass} strokeWidth={1.5} aria-hidden="true" /> },
];

export function TravelStepDestination({ onNext, onBack }: TravelStepDestinationProps) {
  const { formState: { errors }, watch, control, setValue } = useFormContext<TravelFormValues>();
  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransportationModalOpen, setIsTransportationModalOpen] = useState(false);
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travellers',
  });

  const validateDates = () => {
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (to < from) {
        return 'Datum do musí být po datu od';
      }
    }
    return true;
  };

  return (
    <>
      <SectionCard>
        <div className="space-y-6">
          <div>
            <DestinationCards
              name="destinationZone"
              label="Kam to bude? *"
              options={destinationZoneOptions}
              className="w-full"
              rules={{ 
                required: 'Destinace je povinná',
                validate: (value) => value !== '' || 'Destinace je povinná'
              }}
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-brand-600 hover:underline mt-2 inline-block"
            >
              Které země spadají do Evropy?
            </button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Které země spadají do Evropy?"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AXA Assistance:</h4>
                  <p className="text-sm text-foreground">
                    Zona "Evropa" zahrnuje všechny evropské státy a také Izrael, Turecko, Tunisko, Gruzii, Kanárské ostrovy, Egypt, Maroko, kromě České republiky.
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Direct:</h4>
                  <p className="text-sm text-foreground">
                    Evropa, tedy geografická oblast Evropy a také Azory, Maroko, Turecko, Egypt, Izrael, Kypr, Tunisko, Kanárské ostrovy a Madeira. Z územního rozsahu Evropa je vyloučená Česká republika.
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Colonnade:</h4>
                  <p className="text-sm text-foreground">
                    Evropa zahrnuje: území geografické oblasti Evropy, Alžírska, Egyptu, Kanárských ostrovů, Maroka, Tuniska a Turecka, vyjma České republiky.
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Slavia:</h4>
                  <p className="text-sm text-foreground">
                    Albánie, Andorra, Belgie, Bělorusko, Bosna a Hercegovina, Bulharsko, Černá Hora, Dánsko, Egypt, Estonsko, Finsko, Francie, Gibraltar, Chorvatsko, Irsko, Island, Itálie, Kypr, Lichtenštejnsko, Litva, Lotyšsko, Lucembursko, Maďarsko, Makedonie, Malta, Maroko, Moldávie, Monako, Německo, Nizozemí, Norfolské ostrovy, Norsko, Polsko, Portugalsko, Rakousko, Rumunsko, Řecko, San Marino, Slovinsko, Srbsko, Španělsko, Švédsko, Švýcarsko, Tunisko, Turecko, Ukrajina, Vatikán, Velká Británie, Azory, Faerské ostrovy, Kanárské ostrovy, Ostrov Man.
                  </p>
                </div>
              </div>
            </Modal>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                name="dateFrom"
                label="Od kdy *"
                className="w-full"
                rules={{ required: 'Datum odjezdu je povinné' }}
              />
              <DatePicker
                name="dateTo"
                label="Do kdy *"
                className="w-full"
                rules={{ required: 'Datum návratu je povinné' }}
              />
            </div>
            {errors.dateTo && typeof errors.dateTo.message === 'string' && (
              <p className="text-sm text-danger mt-1">{errors.dateTo.message}</p>
            )}
            
            <div className="mt-6 p-4 border border-border rounded-lg bg-surface-muted">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-0 right-0 text-danger hover:text-danger text-sm font-medium"
                      >
                        Odstranit
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name={`travellers.${index}.name`}
                        label="Jméno cestujícího *"
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
                ))}
              </div>
              
              {fields.length < 8 && (
                <button
                  type="button"
                  onClick={() => append({ id: `traveller-${Date.now()}`, name: '', dateOfBirth: '' })}
                  className="mt-4 w-full py-2 px-4 border-2 border-dashed border-border rounded-lg text-muted hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  + Přidat dalšího cestujícího
                </button>
              )}
            </div>
            
            <div className="mt-4">
              <Controller
                name="fullYearInsurance"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="relative bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 rounded-xl p-6 border-2 border-brand-200 shadow-lg hover:shadow-xl transition-shadow">
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 opacity-20">
                        <svg className="w-16 h-16 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-20">
                        <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      
                      <div className="relative">
                        <div className="mb-4 flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                            <Plane className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-brand-600/10 px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide text-brand-700">
                              <Globe2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                              Tip pro časté cestovatele
                            </span>
                            <h3 className="text-lg font-bold leading-snug text-foreground">
                              Cestuješ často? Cestuj chytře s celoročním cestovním pojištěním
                            </h3>
                            <p className="mt-1 text-sm text-muted">
                              Jedno pojištění pro všechny cesty během roku
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-surface rounded-lg p-4 shadow-sm mb-4">
                          <span className={`text-sm font-medium transition-colors ${!field.value ? 'text-foreground' : 'text-subtle'}`}>
                            Ne
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(!field.value);
                              if (field.value) {
                                // Switching from "Ano" to "Ne" - reset full year fields
                                setValue('fullYearType', '');
                                setValue('insuranceStartDate', '');
                              } else {
                                // Switching from "Ne" to "Ano" - reset transportation
                                setValue('transportation', '');
                              }
                            }}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                              field.value ? 'bg-brand-600 shadow-md' : 'bg-border-strong'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition-transform duration-300 ${
                                field.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-sm font-medium transition-colors ${field.value ? 'text-foreground' : 'text-subtle'}`}>
                            Ano
                          </span>
                        </div>
                        
                        {field.value && (
                          <div className="space-y-4 bg-surface rounded-lg p-4 shadow-sm">
                            <SelectField
                              name="fullYearType"
                              label="Typ pojištění *"
                              placeholder="Vyber typ"
                              options={[
                                { value: 'repeated', label: 'Opakované cesty' },
                                { value: 'yearly', label: 'Celoroční pojištění' },
                              ]}
                              className="w-full"
                              rules={{ required: 'Typ pojištění je povinný' }}
                            />
                            <DatePicker
                              name="insuranceStartDate"
                              label="Počátek pojištění *"
                              className="w-full"
                              rules={{ required: 'Počátek pojištění je povinný' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              />
            </div>
          </div>

          {!watch('fullYearInsurance') && (
            <div className="bg-surface-muted rounded-xl p-6 border-2 border-border relative">
              <button
                type="button"
                onClick={() => setIsTransportationModalOpen(true)}
                className="absolute top-6 right-6 text-sm text-brand-600 hover:underline"
              >
                Proč se na to ptáme?
              </button>
              <Modal
                isOpen={isTransportationModalOpen}
                onClose={() => setIsTransportationModalOpen(false)}
                title="Proč se na to ptáme?"
              >
                <p className="text-sm text-foreground">
                  Tím, že znám každý detail vaší cesty, dokážu vybrat ideální pojišťovnu i připojištění tak, aby byly všechny možné komplikace na cestě plně pokryty.
                </p>
              </Modal>
              <div className="space-y-6">
                <div>
                  <DestinationCards
                    name="transportation"
                    label="Jak se dostanete do finální destinace? *"
                    options={transportationOptions}
                    className="w-full"
                    rules={{ required: 'Doprava je povinná' }}
                  />
                </div>

                <div>
                  <DestinationCards
                    name="tripType"
                    label="Jaký typ cesty Vás čeká? *"
                    options={tripTypeOptions}
                    className="w-full"
                    rules={{ required: 'Typ cesty je povinný' }}
                  />
                </div>
                
                <div className="rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-surface p-5 shadow-sm">
                  <Controller
                    name="needCancellationCoverage"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-base font-bold leading-snug text-foreground">
                                Potřebuješ pokrýt případné storno cesty?
                              </h3>
                              <p className="mt-0.5 text-sm text-muted">
                                Když cestu nakonec zrušíš, pojišťovna ti proplatí storno poplatky.
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                            <span className={`text-sm font-medium ${!field.value ? 'text-foreground' : 'text-subtle'}`}>
                              Ne
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(!field.value);
                                if (field.value) {
                                  // Reset fields when switching to "Ne"
                                  setValue('cancellationType', '');
                                  setValue('tripBookingDate', '');
                                  setValue('tripPrice', undefined);
                                }
                              }}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                                field.value ? 'bg-brand-600 shadow-md' : 'bg-border-strong'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition-transform duration-300 ${
                                  field.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className={`text-sm font-medium ${field.value ? 'text-foreground' : 'text-subtle'}`}>
                              Ano
                            </span>
                          </div>
                        </div>

                        {field.value && (
                          <div className="mt-5 space-y-4 border-t border-brand-200 pt-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SelectField
                                name="cancellationType"
                                label="Typ storna *"
                                placeholder="Vyber typ"
                                options={[
                                  { value: 'full', label: 'Chci pokrýt 100% nákladů' },
                                  { value: 'co_payment', label: 'Storno se spoluúčastí' },
                                ]}
                                className="w-full"
                                rules={{ required: 'Typ storna je povinný' }}
                              />
                              <DatePicker
                                name="tripBookingDate"
                                label="Datum pořízení zájezdu *"
                                className="w-full"
                                rules={{ required: 'Datum pořízení zájezdu je povinné' }}
                              />
                              <Input
                                name="tripPrice"
                                label="Cena zájezdu *"
                                type="number"
                                placeholder="Např. 50000"
                                className="w-full"
                                rules={{ required: 'Cena zájezdu je povinná' }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <SecondaryButton onClick={onBack} disabled={true}>
            Zpět
          </SecondaryButton>
          <PrimaryButton onClick={onNext}>
            Pokračovat
          </PrimaryButton>
        </div>
      </SectionCard>
    </>
  );
}

