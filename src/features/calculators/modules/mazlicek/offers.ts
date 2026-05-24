import {
  ADDONS,
  FREQUENCY_PER_YEAR,
  type PetCoverageState,
  type PetType,
} from './data';

export interface PetOfferCoverage {
  label: string;
  value: string;
  included?: boolean;
}

export interface PetOffer {
  id: string;
  insurer: string;
  productName: string;
  /** Roční základní pojistné (bez připojištění). */
  annualBase: number;
  coverages: PetOfferCoverage[];
}

const BASE_OFFERS: PetOffer[] = [
  {
    id: 'petplan-basic',
    insurer: 'PetPlan',
    productName: 'Veterinární péče Základ',
    annualBase: 3480,
    coverages: [
      { label: 'Léčba úrazu', value: 'do 30 000 Kč', included: true },
      { label: 'Léčba nemoci', value: 'do 30 000 Kč', included: true },
      { label: 'Roční limit plnění', value: '30 000 Kč' },
      { label: 'Spoluúčast', value: '20 %' },
    ],
  },
  {
    id: 'animalcare-standard',
    insurer: 'AnimalCare',
    productName: 'Mazlíček Standard',
    annualBase: 4560,
    coverages: [
      { label: 'Léčba úrazu', value: 'do 60 000 Kč', included: true },
      { label: 'Léčba nemoci', value: 'do 60 000 Kč', included: true },
      { label: 'Roční limit plnění', value: '60 000 Kč' },
      { label: 'Spoluúčast', value: '10 %' },
    ],
  },
  {
    id: 'happypet-premium',
    insurer: 'HappyPet',
    productName: 'Premium Vet',
    annualBase: 6120,
    coverages: [
      { label: 'Léčba úrazu', value: 'do 100 000 Kč', included: true },
      { label: 'Léčba nemoci', value: 'do 100 000 Kč', included: true },
      { label: 'Roční limit plnění', value: '100 000 Kč' },
      { label: 'Preventivní péče', value: 'Zahrnuto', included: true },
      { label: 'Spoluúčast', value: 'bez spoluúčasti' },
    ],
  },
];

/** Kočky mají mírně nižší sazbu než psi. */
function typeFactor(type: PetType): number {
  return type === 'kocka' ? 0.85 : 1;
}

export function getPetOffers(type: PetType): PetOffer[] {
  const f = typeFactor(type);
  return BASE_OFFERS.map((o) => ({ ...o, annualBase: Math.round(o.annualBase * f) }));
}

/** Roční pojistné nabídky včetně vybraných připojištění. */
export function annualTotal(offer: PetOffer, coverage: PetCoverageState): number {
  const addons = ADDONS.filter((a) => coverage.addons[a.id]).reduce((s, a) => s + a.price, 0);
  return offer.annualBase + addons;
}

/** Pojistné za jedno platební období dle frekvence. */
export function perPeriodPrice(offer: PetOffer, coverage: PetCoverageState): number {
  return Math.round(annualTotal(offer, coverage) / FREQUENCY_PER_YEAR[coverage.frequency]);
}
