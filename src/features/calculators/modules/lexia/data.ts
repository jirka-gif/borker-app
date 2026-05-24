export type Segment = 'b2c' | 'b2b';
export type Subject = 'jednotlivec' | 'domacnost';

export interface Pillar {
  id: string;
  title: string;
  desc: string;
  /** Roční pojistné za pilíř v Kč. */
  price: number;
  mandatory?: boolean;
}

export const B2C_PILLARS: Pillar[] = [
  {
    id: 'zaklad',
    title: 'Základ + telefonický právník',
    desc: 'Konzultace s právníkem 24/7, kontrola smluv, ALL-RISK garance. Povinný pilíř.',
    price: 1490,
    mandatory: true,
  },
  { id: 'bydleni', title: 'Bydlení', desc: 'Spory s pronajímatelem / nájemcem, sousedské spory, vady díla u rekonstrukce.', price: 590 },
  { id: 'pracovnepravni', title: 'Pracovněprávní', desc: 'Neplatná výpověď, mobbing, mzdový spor, diskriminace.', price: 490 },
  { id: 'vozidla', title: 'Vozidla', desc: 'Spory ze servisu, reklamace prodejce, pojistná plnění.', price: 390 },
  { id: 'ridici', title: 'Řidiči', desc: 'Dopravní přestupky, odebrání řidičáku, trestní řízení po nehodě.', price: 490 },
];

export const B2B_PILLARS: Pillar[] = [
  {
    id: 'zaklad-b2b',
    title: 'Základ + 1 smluvní spor',
    desc: 'Podpora 24/7, ALL-RISK garance, 1 smluvní spor do 100 000 Kč. Povinný pilíř.',
    price: 2490,
    mandatory: true,
  },
  { id: 'zamestnanci', title: 'Spory se zaměstnanci', desc: 'Žaloby zaměstnanců (výpovědi, mzdy, pracovní úrazy).', price: 990 },
  { id: 'komercni', title: 'Komerční prostory', desc: 'Spory s pronajímateli, sousedy, stavební vady.', price: 790 },
  { id: 'smluvni', title: 'Smluvní spory', desc: 'Vymáhání pohledávek, reklamace, sporné smlouvy nad rámec Pilíře I.', price: 1290 },
  { id: 'firemni-vozidla', title: 'Firemní vozidla', desc: 'Krytí firemní flotily – servisy, leasingy, totální škody.', price: 890 },
  { id: 'ridici-b2b', title: 'Řidiči', desc: 'Spory za přestupky a nehody zaměstnanců-řidičů.', price: 690 },
];

export function pillarsFor(segment: Segment): Pillar[] {
  return segment === 'b2b' ? B2B_PILLARS : B2C_PILLARS;
}

export interface LexiaInputState {
  segment: Segment;
  subject: Subject;
  /** Zapnuté pilíře (povinný je vždy true). */
  selected: Record<string, boolean>;
  startDate: string;
}

export const initialLexiaInput: LexiaInputState = {
  segment: 'b2c',
  subject: 'jednotlivec',
  selected: { zaklad: true, 'zaklad-b2b': true },
  startDate: new Date().toISOString().slice(0, 10),
};

export interface LexiaPolicyholderState {
  // b2c
  firstName: string;
  lastName: string;
  birthNumber: string;
  // b2b
  companyName: string;
  ico: string;
  // společné
  email: string;
  phone: string;
  address: string;
}

export const initialLexiaPolicyholder: LexiaPolicyholderState = {
  firstName: '',
  lastName: '',
  birthNumber: '',
  companyName: '',
  ico: '',
  email: '',
  phone: '',
  address: '',
};

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Roční pojistné = součet zapnutých pilířů × faktor (domácnost dráž). */
export function annualPrice(input: LexiaInputState): number {
  const pillars = pillarsFor(input.segment);
  const base = pillars
    .filter((p) => p.mandatory || input.selected[p.id])
    .reduce((sum, p) => sum + p.price, 0);
  const factor = input.segment === 'b2c' && input.subject === 'domacnost' ? 1.6 : 1;
  return Math.round(base * factor);
}
