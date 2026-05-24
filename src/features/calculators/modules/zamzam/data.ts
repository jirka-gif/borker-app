export type DrivingStatus = 'neridim' | 'obcas' | 'ridic';

export const DRIVING_OPTIONS: { value: DrivingStatus; label: string }[] = [
  { value: 'neridim', label: 'V práci neřídím' },
  { value: 'obcas', label: 'V práci občas řídím' },
  { value: 'ridic', label: 'Řidič z povolání' },
];

export type Spoluucast = '25' | '10';

export const SPOLUUCAST_OPTIONS: { value: Spoluucast; label: string; note: string }[] = [
  { value: '25', label: 'Vysoké', note: 'minimálně 5 000 Kč' },
  { value: '10', label: 'Střední', note: 'minimálně 5 000 Kč' },
];

export interface CoverageTier {
  value: number;
  salaryRange: string;
  annual: number;
}

export const COVERAGE_TIERS: CoverageTier[] = [
  { value: 60000, salaryRange: 'do 13 000 Kč', annual: 3982 },
  { value: 80000, salaryRange: '13 000 Kč – 18 000 Kč', annual: 4436 },
  { value: 100000, salaryRange: '19 000 Kč – 22 000 Kč', annual: 4754 },
  { value: 150000, salaryRange: '22 000 Kč – 30 000 Kč', annual: 5689 },
  { value: 200000, salaryRange: '31 000 Kč – 45 000 Kč', annual: 6295 },
  { value: 400000, salaryRange: '45 000 Kč – 70 000 Kč', annual: 9286 },
  { value: 600000, salaryRange: '70 000 Kč – 133 000 Kč', annual: 11665 },
];

export interface ZamZamInputState {
  driving: DrivingStatus;
  spoluucast: Spoluucast;
  coverage: number;
  startDate: string;
  scoringConsent: boolean;
}

export const initialZamZamInput: ZamZamInputState = {
  driving: 'ridic',
  spoluucast: '25',
  coverage: 400000,
  startDate: new Date().toISOString().slice(0, 10),
  scoringConsent: true,
};

export interface ZamZamPolicyholderState {
  firstName: string;
  lastName: string;
  birthNumber: string;
  noBirthNumber: boolean;
  birthDate: string;
  phone: string;
  email: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  differentMailing: boolean;
  mailingAddress: string;
  differentPolicyholder: boolean;
  phName: string;
  phEmail: string;
  phPhone: string;
}

export const initialZamZamPolicyholder: ZamZamPolicyholderState = {
  firstName: '',
  lastName: '',
  birthNumber: '',
  noBirthNumber: false,
  birthDate: '',
  phone: '',
  email: '',
  street: '',
  houseNumber: '',
  zip: '',
  city: '',
  country: 'Česká republika',
  differentMailing: false,
  mailingAddress: '',
  differentPolicyholder: false,
  phName: '',
  phEmail: '',
  phPhone: '',
};

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

export function tierFor(coverage: number): CoverageTier | undefined {
  return COVERAGE_TIERS.find((t) => t.value === coverage);
}
