import type { RecordInput } from '../../shared/record/types';
import type { TravelFormValues } from './components/travelInsurance/TravelInsuranceCalculator';
import type { TravelOffer } from './lib/travelQuotes';

const ZONE_LABELS: Record<string, string> = {
  eu: 'Evropa',
  world: 'Svět (bez USA)',
  world_with_usa: 'Celý svět',
  cz: 'Česká republika',
};

const TRANSPORT_LABELS: Record<string, string> = {
  plane: 'Letadlem',
  car: 'Autem',
  car_and_plane: 'Autem i letadlem',
  other: 'Vše ostatní',
};

const TRIP_TYPE_LABELS: Record<string, string> = {
  work: 'Pracovní',
  relax: 'Relax',
  adrenaline: 'Adrenalin & Sport',
  organized_sport: 'Organizovaný sport',
};

const COVERAGE_LABELS: Record<string, string> = {
  basic: 'Základní',
  standard: 'Standard',
  premium: 'Premium',
};

function czk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('cs-CZ');
}

const IMPACT_TRAVEL = [
  'Cestovní pojištění je pojištění soukromé a sjednává se jako pojištění škodové i obnosové dle jednotlivých rizik. Plnění z léčebných výloh je poskytováno do sjednaných limitů; na vybrané sporty a rizikové aktivity se vztahuje pouze, je-li sjednáno odpovídající připojištění.',
  'Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události a řídit se pokyny asistenční služby. Storno cesty se vztahuje pouze na sjednané důvody a může být poskytnuto se spoluúčastí dle pojistných podmínek.',
];

/**
 * Sestaví vstup pro „Záznam z jednání" u cestovního pojištění z dat formuláře
 * a nabídek z kalkulace. Sdílí ho krok 3 (záznam) i krok 4 (stažení PDF).
 */
export function buildTravelRecordInput(
  v: TravelFormValues,
  offers: TravelOffer[],
): RecordInput {
  const sorted = [...offers].sort((a, b) => a.totalPrice - b.totalPrice);
  const top3 = sorted.slice(0, 3);
  const best = sorted[0];

  const travellerNames =
    v.travellers
      ?.map((t) => t.name)
      .filter(Boolean)
      .join(', ') || 'Cestující';

  const term = v.fullYearInsurance
    ? 'Celoroční pojištění'
    : v.dateFrom || v.dateTo
      ? `${formatDate(v.dateFrom)} – ${formatDate(v.dateTo)}`
      : '—';

  const zoneLabel = ZONE_LABELS[v.destinationZone] ?? '—';
  const firstTraveller = v.travellers?.[0];

  return {
    productName: 'Cestovní pojištění',
    insuranceKind: 'Cestovní pojištění',
    subjectLabel: `${zoneLabel}, termín ${term}`,
    insuredPersons: travellerNames,
    insuredPlace: zoneLabel,
    startDate: v.insuranceStartDate || v.dateFrom,
    amountBasis: 'Léčebné výlohy a další rizika dle pojistných podmínek',
    customer: {
      name: firstTraveller?.name || travellerNames,
      idLabel: 'Datum narození',
      idValue: formatDate(firstTraveller?.dateOfBirth),
      address: '',
      phone: '',
      email: '',
    },
    scope: {
      rows: [
        { label: 'Destinace / zóna', value: zoneLabel },
        { label: 'Doprava', value: TRANSPORT_LABELS[v.transportation] ?? '—' },
        { label: 'Typ cesty', value: TRIP_TYPE_LABELS[v.tripType] ?? '—' },
        { label: 'Termín', value: term },
        { label: 'Počet cestujících', value: String(v.travellers?.length ?? 0) },
        { label: 'Úroveň krytí', value: COVERAGE_LABELS[v.coverageLevel] ?? v.coverageLevel },
      ],
      totalLabel: best ? czk(best.totalPrice) : undefined,
    },
    offers: top3.map((o, i) => ({
      insurer: o.insurerName,
      product: o.productName,
      priceLabel: czk(o.totalPrice),
      recommended: i === 0,
      chosen: i === 0,
    })),
    recommendedProductDefault: best
      ? `${best.insurerName} – ${best.productName}`
      : 'Cestovní pojištění',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na krytí léčebných výloh a souvisejících rizik při cestě do zahraničí. Vznik pojistné události (úraz, nemoc, ztráta zavazadel, odpovědnost) by pro něj znamenal přímou majetkovou ztrátu.',
    impactParagraphs: IMPACT_TRAVEL,
  };
}
