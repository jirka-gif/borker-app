export type CareType = 'komplexni' | 'neodkladna';

export const CARE_TYPES: { value: CareType; title: string; desc: string }[] = [
  { value: 'komplexni', title: 'Komplexní péče', desc: 'Nejširší krytí zdravotní péče pro cizince v ČR.' },
  { value: 'neodkladna', title: 'Neodkladná péče', desc: 'Jen to nejnutnější lékařské ošetření v ČR.' },
];

export type InsuredType = 'zena' | 'muz' | 'student';

export const INSURED_TYPES: { value: InsuredType; label: string }[] = [
  { value: 'zena', label: 'Žena' },
  { value: 'muz', label: 'Muž' },
  { value: 'student', label: 'Student' },
];

export const DURATIONS = [3, 6, 12, 24] as const;
export type DurationMonths = (typeof DURATIONS)[number];

export const NATIONALITIES = [
  'Ukrajina',
  'Vietnam',
  'Rusko',
  'Slovensko',
  'Bělorusko',
  'Kazachstán',
  'Indie',
  'USA',
  'Jiná',
];

export interface ForeignerInputState {
  careType: CareType;
  insuredType: InsuredType;
  birthDate: string;
  startDate: string;
  professionalAthlete: boolean;
  underTreatment: boolean;
  healthy: boolean;
  /** Pouze pro ženu: těhotná nebo plánuje otěhotnět v době trvání pojištění. */
  pregnancyPlanned: boolean;
}

export const initialForeignerInput: ForeignerInputState = {
  careType: 'komplexni',
  insuredType: 'muz',
  birthDate: '',
  startDate: new Date().toISOString().slice(0, 10),
  professionalAthlete: false,
  underTreatment: false,
  healthy: true,
  pregnancyPlanned: false,
};

export interface ForeignerSelectionState {
  durationMonths: DurationMonths;
  selectedOfferId: string;
}

export const initialForeignerSelection: ForeignerSelectionState = {
  durationMonths: 12,
  selectedOfferId: '',
};

export interface ForeignerPolicyholderState {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  passportNumber: string;
  passportValidFrom: string;
  passportValidTo: string;
  birthPlace: string;
  nationality: string;
  addressCz: string;
  /** Pojistník je jiná osoba než pojištěný. */
  differentPolicyholder: boolean;
  phIsCompany: boolean;
  phCompanyName: string;
  phIco: string;
  phFirstName: string;
  phLastName: string;
  phSex: 'muz' | 'zena';
  /** Pojistník nemá rodné číslo (cizinec) → uvede se datum narození. */
  phNoBirthNumber: boolean;
  phBirthNumber: string;
  phBirthDate: string;
  phEmail: string;
  phPhone: string;
  phAddress: string;
  phNationality: string;
}

export const initialForeignerPolicyholder: ForeignerPolicyholderState = {
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  email: '',
  passportNumber: '',
  passportValidFrom: '',
  passportValidTo: '',
  birthPlace: '',
  nationality: 'Ukrajina',
  addressCz: '',
  differentPolicyholder: false,
  phIsCompany: false,
  phCompanyName: '',
  phIco: '',
  phFirstName: '',
  phLastName: '',
  phSex: 'muz',
  phNoBirthNumber: false,
  phBirthNumber: '',
  phBirthDate: '',
  phEmail: '',
  phPhone: '',
  phAddress: '',
  phNationality: 'Ukrajina',
};

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}
