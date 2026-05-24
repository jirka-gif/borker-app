import type { CareType, DurationMonths, ForeignerInputState, InsuredType } from './data';

export interface ForeignerCoverage {
  label: string;
  value: string;
  included?: boolean;
}

export interface ForeignerOffer {
  id: string;
  insurer: string;
  productName: string;
  description: string;
  coverages: ForeignerCoverage[];
  /** Základní měsíční pojistné (komplexní, muž, 12 měsíců). */
  baseMonthly: number;
}

const BASE_OFFERS: ForeignerOffer[] = [
  {
    id: 'slavia-komplex',
    insurer: 'Slavia pojišťovna',
    productName: 'Slavia KOMPLEX',
    description:
      'Zdravotní pojištění pro cizince kryje náklady akutního lékařského zásahu, léky předepsané lékařem i akutní ošetření zubů. Limit plnění 10 mil. Kč (400 000 EUR).',
    baseMonthly: 1687,
    coverages: [
      { label: 'Limit plnění celkem', value: '10 000 000 Kč' },
      { label: 'Repatriace pojištěného', value: 'Zahrnuto', included: true },
      { label: 'Limit poporodní zdravotní péče', value: '—' },
      { label: 'Limit plnění léky', value: '25 000 Kč' },
      { label: 'Limit pro stomatologickou péči', value: '25 000 Kč' },
    ],
  },
  {
    id: 'axa-komplex',
    insurer: 'AXA',
    productName: 'AXA Zdravotní pojištění cizinců, KOMPLEX',
    description:
      'Pojištění pro cizince plánující pobyt v ČR delší než 90 dnů. Vhodné pro žádost o dlouhodobé vízum i jeho prodloužení. Limit plnění 10 mil. Kč (400 000 EUR).',
    baseMonthly: 1583,
    coverages: [
      { label: 'Limit plnění celkem', value: '10 000 000 Kč' },
      { label: 'Repatriace pojištěného', value: 'Zahrnuto', included: true },
      { label: 'Limit plnění léky', value: '30 000 Kč' },
      { label: 'Limit pro stomatologickou péči', value: '20 000 Kč' },
      { label: 'Preventivní prohlídky', value: 'Zahrnuto', included: true },
    ],
  },
  {
    id: 'sv-welcome-komplex',
    insurer: 'SV pojišťovna',
    productName: 'SV Welcome Komplex',
    description:
      'Komplexní zdravotní pojištění pro cizince s limitem 10 mil. Kč (400 000 EUR). Kryje ambulantně předepsané léky, preventivní péči, očkování a dispenzární péči.',
    baseMonthly: 2100,
    coverages: [
      { label: 'Limit plnění celkem', value: '10 000 000 Kč' },
      { label: 'Ostatní stomatologie', value: '6 000 Kč' },
      { label: 'Přeprava do zdravotnického zařízení', value: '400 000 €' },
      { label: 'Neodkladné ošetření zubů', value: '6 000 Kč' },
      { label: 'Ambulantně předepsané léky', value: 'Zahrnuto', included: true },
    ],
  },
];

function careFactor(care: CareType): number {
  return care === 'neodkladna' ? 0.55 : 1;
}

function typeFactor(type: InsuredType): number {
  if (type === 'student') return 0.8;
  if (type === 'zena') return 1.05;
  return 1;
}

/** Delší doba = mírně nižší měsíční sazba. */
function durationFactor(months: DurationMonths): number {
  switch (months) {
    case 3:
      return 1.04;
    case 6:
      return 1.0;
    case 12:
      return 0.97;
    case 24:
      return 0.92;
    default:
      return 1;
  }
}

export function getForeignerOffers(): ForeignerOffer[] {
  return BASE_OFFERS;
}

/** Měsíční pojistné nabídky pro dané zadání + dobu trvání. */
export function monthlyPrice(
  offer: ForeignerOffer,
  input: ForeignerInputState,
  months: DurationMonths,
): number {
  const athlete = input.professionalAthlete ? 1.15 : 1;
  // Těhotenství / plánované těhotenství navyšuje sazbu (poporodní a související péče).
  const pregnancy = input.insuredType === 'zena' && input.pregnancyPlanned ? 1.35 : 1;
  return Math.round(
    offer.baseMonthly *
      careFactor(input.careType) *
      typeFactor(input.insuredType) *
      durationFactor(months) *
      athlete *
      pregnancy,
  );
}

export function totalPrice(
  offer: ForeignerOffer,
  input: ForeignerInputState,
  months: DurationMonths,
): number {
  return monthlyPrice(offer, input, months) * months;
}
