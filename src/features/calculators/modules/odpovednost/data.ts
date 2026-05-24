export interface LimitOption {
  value: string;
  label: string;
  desc: string;
  price: number;
}

export const LIMITS: LimitOption[] = [
  { value: '3', label: '3 mil. Kč', desc: 'Jen to nejnutnější', price: 1666 },
  { value: '5', label: '5 mil. Kč', desc: 'Jsem sám a nesportuji', price: 1766 },
  { value: '10', label: '10 mil. Kč', desc: 'Sportuju a mám rodinu', price: 1866 },
  { value: '15', label: '15 mil. Kč', desc: 'Sportuju, cestuju a žiju aktivně', price: 1966 },
  { value: '25', label: '25 mil. Kč', desc: 'Nic mě nemůže překvapit', price: 2066 },
  { value: '50', label: '50 mil. Kč', desc: 'Pro maximální klid', price: 2266 },
  { value: '100', label: '100 mil. Kč', desc: 'Bez kompromisů', price: 2666 },
];

export const INCLUDED = [
  {
    title: 'Odpovědnost pro běžný život',
    desc: 'Tím myslíme škody způsobené někomu jinému při provozu domácnosti, nakupování, rekreačních sportech a jiných mimopracovních aktivitách.',
  },
  {
    title: 'Odpovědnost z vlastnictví nemovitosti',
    desc: 'Škody, které vznikly někomu jinému v souvislosti s vaší nemovitostí, kterou vlastníte nebo máte v pronájmu, uvedenou v pojistné smlouvě.',
  },
];

export interface AddonOption {
  id: string;
  title: string;
  desc: string;
  price: number;
}

export const ADDONS: AddonOption[] = [
  {
    id: 'elektronika',
    title: 'Škody na drobné přenosné elektronice',
    desc: 'Škody na mobilních telefonech, tabletech a noteboocích, které poškodíte, zničíte nebo ztratíte někomu jinému.',
    price: 1036,
  },
  {
    id: 'pronajate',
    title: 'Škody na věcech pronajatých',
    desc: 'Škody na pronajatých věcech, ke kterým máte písemnou smlouvu. Třeba svatební šaty nebo lyže z půjčovny.',
    price: 620,
  },
  {
    id: 'vsechny-nemovitosti',
    title: 'Z vlastnictví všech vašich nemovitostí',
    desc: 'Toto připojištění rozšiřuje základní odpovědnost z vlastnictví nemovitosti o všechny ostatní nemovitosti, které vlastníte.',
    price: 620,
  },
  {
    id: 'zvire',
    title: 'Odpovědnost za zvíře',
    desc: 'Škody, které vaše zvíře způsobí okolí. Například o kousnutí psem nebo kopnutí koněm. Pojištěna jsou domácí i hospodářská zvířata.',
    price: 826,
  },
];

export function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Celkové roční pojistné = cena limitu + součet vybraných připojištění. */
export function computeTotalPrice(limit: string, added: Record<string, boolean>): number {
  const base = LIMITS.find((l) => l.value === limit)?.price ?? 0;
  const addons = ADDONS.filter((a) => added[a.id]).reduce((sum, a) => sum + a.price, 0);
  return base + addons;
}

// Stav a typy „Záznamu z jednání" jsou nově sdílené napříč produkty.
export type { RecordState } from '../../shared/record/types';
export { initialRecord } from '../../shared/record/types';

/* ----------------------------- Sdílený stav ------------------------------ */

export interface AddressValue {
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  state: string;
}

export const emptyAddress: AddressValue = {
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
  state: 'Česká republika',
};

/** Stav kroku 2 – údaje o pojistníkovi/pojištěném a místě pojištění. */
export interface PolicyholderState {
  startDate: string;
  firstName: string;
  lastName: string;
  birthNumber: string;
  birthDate: string;
  isForeigner: boolean;
  phone: string;
  email: string;
  insuredAddress: AddressValue;
  livesHere: boolean;
  ownsProperty: boolean;
  differentPermanent: boolean;
  permanentAddress: AddressValue;
  differentMailing: boolean;
  mailingAddress: AddressValue;
}

export const initialPolicyholder: PolicyholderState = {
  startDate: '2026-05-24',
  firstName: '',
  lastName: '',
  birthNumber: '',
  birthDate: '',
  isForeigner: false,
  phone: '',
  email: '',
  insuredAddress: { ...emptyAddress },
  livesHere: false,
  ownsProperty: false,
  differentPermanent: false,
  permanentAddress: { ...emptyAddress },
  differentMailing: false,
  mailingAddress: { ...emptyAddress },
};

