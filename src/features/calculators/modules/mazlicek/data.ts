export type PetType = 'pes' | 'kocka';

export interface AddonOption {
  id: string;
  title: string;
  desc: string;
  /** Roční cena připojištění v Kč. */
  price: number;
}

export const ADDONS: AddonOption[] = [
  {
    id: 'asistence',
    title: 'Asistence v nouzi',
    desc: '24/7 veterinární pomoc, doprava a poradenství při náhlé zdravotní příhodě.',
    price: 360,
  },
  {
    id: 'odpovednost',
    title: 'Odpovědnost za škodu',
    desc: 'Krytí škod, které mazlíček způsobí třetí osobě (kousnutí, poškození majetku).',
    price: 540,
  },
];

export type PaymentFrequency = 'mesicne' | 'ctvrtletne' | 'rocne';

export const PAYMENT_FREQUENCIES: { value: PaymentFrequency; label: string }[] = [
  { value: 'mesicne', label: 'Měsíčně' },
  { value: 'ctvrtletne', label: 'Čtvrtletně' },
  { value: 'rocne', label: 'Ročně' },
];

/** Kolik plateb za rok pro danou frekvenci. */
export const FREQUENCY_PER_YEAR: Record<PaymentFrequency, number> = {
  mesicne: 12,
  ctvrtletne: 4,
  rocne: 1,
};

export const FREQUENCY_SUFFIX: Record<PaymentFrequency, string> = {
  mesicne: '/ měsíčně',
  ctvrtletne: '/ čtvrtletně',
  rocne: '/ ročně',
};

/** Výběr plemen (zkráceno; v reálu vrací číselník/API). */
export const DOG_BREEDS: string[] = [
  'Kříženec (do 55 cm výšky)',
  'Kříženec (nad 55 cm výšky)',
  'Australský ovčák',
  'Border kolie',
  'Bulldog anglický',
  'Bulldog francouzský',
  'Border teriér',
  'Čivava',
  'Dalmatin',
  'Dobrman',
  'Německý ovčák',
  'Zlatý retrívr',
  'Labradorský retrívr',
  'Jack Russell teriér',
  'Jezevčík',
  'Kavalír King Charles španěl',
  'Kokršpaněl',
  'Maltézský psík',
  'Pudl',
  'Rotvajler',
  'Shih-tzu',
  'Sibiřský husky',
  'Yorkshirský teriér',
];

export const CAT_BREEDS: string[] = [
  'Kříženec / domácí kočka',
  'Britská krátkosrstá',
  'Mainská mývalí',
  'Perská',
  'Ragdoll',
  'Bengálská',
  'Sibiřská',
  'Sphynx',
  'Skotská klapouchá',
  'Norská lesní',
  'Habešská',
  'Barmská',
];

export function breedsFor(type: PetType): string[] {
  return type === 'pes' ? DOG_BREEDS : CAT_BREEDS;
}

export type PetSex = 'samecek' | 'samicka';

export interface PetState {
  type: PetType;
  breed: string;
  name: string;
  birthDate: string;
  sex: PetSex;
  neutered: boolean;
  chipNumber: string;
}

export const initialPet: PetState = {
  type: 'pes',
  breed: '',
  name: '',
  birthDate: '',
  sex: 'samecek',
  neutered: false,
  chipNumber: '',
};

export interface PetPolicyholderState {
  firstName: string;
  lastName: string;
  birthDate: string;
  personalId: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
}

export const initialPetPolicyholder: PetPolicyholderState = {
  firstName: '',
  lastName: '',
  birthDate: '',
  personalId: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
};

/** Stav výběru z kroku 2 (nabídka). */
export interface PetCoverageState {
  addons: Record<string, boolean>;
  frequency: PaymentFrequency;
  startDate: string;
  selectedOfferId: string;
}

export const initialPetCoverage: PetCoverageState = {
  addons: {},
  frequency: 'mesicne',
  startDate: new Date().toISOString().slice(0, 10),
  selectedOfferId: '',
};

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}
