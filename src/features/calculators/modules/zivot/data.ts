export type Employment = 'zamestnanec' | 'osvc' | 'bez';
export type Citizenship = 'cz' | 'sk' | 'jine';
export type Frequency = 'mesicne' | 'kvartalne' | 'rocne';

export const EMPLOYMENT_LABELS: Record<Employment, string> = {
  zamestnanec: 'Zaměstnanec',
  osvc: 'OSVČ',
  bez: 'Bez zaměstnání',
};

export const CITIZENSHIP_LABELS: Record<Citizenship, string> = {
  cz: 'Česko',
  sk: 'Slovensko',
  jine: 'Jiné',
};

export const FREQUENCY_OPTIONS: { value: Frequency; label: string; perYear: number }[] = [
  { value: 'mesicne', label: 'Měsíčně', perYear: 12 },
  { value: 'kvartalne', label: 'Kvartálně', perYear: 4 },
  { value: 'rocne', label: 'Ročně', perYear: 1 },
];

/* ------------------------------- Krok 1 -------------------------------- */
export interface ZivotInsuredState {
  firstName: string;
  lastName: string;
  birthDate: string;
  employment: Employment;
  profession: string;
  professionDesc: string;
  citizenship: Citizenship;
}

export const initialInsured: ZivotInsuredState = {
  firstName: '',
  lastName: '',
  birthDate: '',
  employment: 'zamestnanec',
  profession: '',
  professionDesc: '',
  citizenship: 'cz',
};

/* ------------------------------- Krok 2 -------------------------------- */
export interface IncomeRow {
  id: string;
  type: string;
  amount: number;
}

export interface ZivotFinanceState {
  incomes: IncomeRow[];
  expHousing: number;
  expEnergy: number;
  expFood: number;
  expDebts: number;
  expLifestyle: number;
  expOther: number;
  children: number;
  estimatedCosts: number;
  partnerSameHousehold: boolean;
}

export const initialFinance: ZivotFinanceState = {
  incomes: [{ id: 'inc-1', type: 'Zaměstnání', amount: 0 }],
  expHousing: 0,
  expEnergy: 0,
  expFood: 0,
  expDebts: 0,
  expLifestyle: 0,
  expOther: 0,
  children: 0,
  estimatedCosts: 0,
  partnerSameHousehold: false,
};

export const INCOME_TYPES = ['Zaměstnání', 'Podnikání (OSVČ)', 'Pronájem', 'Renta / důchod', 'Jiné'];

export function totalExpenses(f: ZivotFinanceState): number {
  const base = f.expHousing + f.expEnergy + f.expFood + f.expDebts + f.expLifestyle + f.expOther;
  return f.estimatedCosts > 0 ? f.estimatedCosts : base;
}

export function totalIncome(f: ZivotFinanceState): number {
  return f.incomes.reduce((s, i) => s + (i.amount || 0), 0);
}

/* ------------------------------- Krok 3 -------------------------------- */
export interface ZivotHealthState {
  heightCm: number;
  weightKg: number;
  birthYear: number;
  invalidPension: boolean;
  doesSport: boolean;
  sport: string;
  sportLevel: string;
  longTermTreatment: boolean;
  treatmentWhat: string;
  medications: boolean;
  medicationsWhich: string;
  sickLeaveHistory: boolean;
  sickLeaveReason: string;
  sickLeaveYear: string;
  currentlySick: boolean;
  smoker: boolean;
}

export const initialHealth: ZivotHealthState = {
  heightCm: 0,
  weightKg: 0,
  birthYear: 1990,
  invalidPension: false,
  doesSport: false,
  sport: '',
  sportLevel: 'rekreační',
  longTermTreatment: false,
  treatmentWhat: '',
  medications: false,
  medicationsWhich: '',
  sickLeaveHistory: false,
  sickLeaveReason: '',
  sickLeaveYear: '',
  currentlySick: false,
  smoker: false,
};

export const SPORT_LEVELS = ['rekreační', 'výkonnostní', 'profesionální'];

/* ------------------------------- Krok 4 -------------------------------- */
export interface ZivotCoverage {
  label: string;
  value: string;
}

export interface ZivotOffer {
  id: string;
  insurer: string;
  productName: string;
  logoText: string;
  monthlyBase: number;
  coverages: ZivotCoverage[];
}

const COMMON_COVERAGES: ZivotCoverage[] = [
  { label: 'Úmrtí', value: '100 000 Kč' },
  { label: 'Invalidita konstantní', value: '500 tis. (pro III. st.)' },
  { label: 'Invalidita klesající', value: '5 mil. (pro III. st.)' },
  { label: 'Závažné nemoci', value: '300 000 Kč' },
  { label: 'Trvalé následky', value: '700 000 Kč' },
];

export const ZIVOT_OFFERS: ZivotOffer[] = [
  { id: 'axa', insurer: 'AXA', productName: 'AXA Comfort premium', logoText: 'AXA', monthlyBase: 1143, coverages: COMMON_COVERAGES },
  { id: 'generali', insurer: 'Generali Česká', productName: 'Generali Život Plus', logoText: 'GČ', monthlyBase: 1290, coverages: COMMON_COVERAGES },
  { id: 'slavia', insurer: 'Slavia', productName: 'Slavia Život Aktiv', logoText: 'SL', monthlyBase: 1620, coverages: COMMON_COVERAGES },
];

export const ADDON_SPORTY_PRICE = 310;
export const ADDON_HOSPITALIZACE_PRICE = 110;

export interface ZivotSelectionState {
  selectedOfferId: string;
  frequency: Frequency;
  addonSporty: boolean;
  addonHospitalizace: boolean;
}

export const initialSelection: ZivotSelectionState = {
  selectedOfferId: 'axa',
  frequency: 'mesicne',
  addonSporty: false,
  addonHospitalizace: false,
};

export function monthlyTotal(offer: ZivotOffer, sel: ZivotSelectionState): number {
  return (
    offer.monthlyBase +
    (sel.addonSporty ? ADDON_SPORTY_PRICE : 0) +
    (sel.addonHospitalizace ? ADDON_HOSPITALIZACE_PRICE : 0)
  );
}

export function perPeriod(offer: ZivotOffer, sel: ZivotSelectionState): number {
  const monthly = monthlyTotal(offer, sel);
  const f = FREQUENCY_OPTIONS.find((o) => o.value === sel.frequency)?.perYear ?? 12;
  return Math.round((monthly * 12) / f);
}

export function frequencySuffix(freq: Frequency): string {
  return freq === 'mesicne' ? '/ měsíčně' : freq === 'kvartalne' ? '/ čtvrtletně' : '/ ročně';
}

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}
