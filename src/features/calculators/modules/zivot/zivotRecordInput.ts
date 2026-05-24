import type { RecordInput } from '../../shared/record/types';
import {
  EMPLOYMENT_LABELS,
  FREQUENCY_OPTIONS,
  ZIVOT_OFFERS,
  formatCzk,
  frequencySuffix,
  monthlyTotal,
  perPeriod,
  totalExpenses,
  totalIncome,
  type ZivotFinanceState,
  type ZivotHealthState,
  type ZivotInsuredState,
  type ZivotSelectionState,
} from './data';

const IMPACT_ZIVOT = [
  'Životní pojištění je pojištění soukromé; rizikové složky se sjednávají jako pojištění obnosová. Pojistná plnění se vyplácejí ve sjednané výši po splnění podmínek pojistné události. Na zamlčené zdravotní údaje a na výluky uvedené v pojistných podmínkách se plnění nevztahuje a mohou vést k odmítnutí plnění.',
  'Klient bere na vědomí povinnost uvádět pravdivé a úplné údaje o zdravotním stavu. Doporučená výše krytí vychází z příjmů, výdajů a rodinné situace tak, aby v případě výpadku příjmu pokryla potřeby domácnosti.',
];

export function buildZivotRecordInput(
  insured: ZivotInsuredState,
  finance: ZivotFinanceState,
  health: ZivotHealthState,
  sel: ZivotSelectionState,
): RecordInput {
  const offer = ZIVOT_OFFERS.find((o) => o.id === sel.selectedOfferId) ?? ZIVOT_OFFERS[0];
  const name = [insured.firstName, insured.lastName].filter(Boolean).join(' ');
  const annual = monthlyTotal(offer, sel) * 12;
  const freqLabel = FREQUENCY_OPTIONS.find((f) => f.value === sel.frequency)?.label ?? 'Měsíčně';

  const addons = [sel.addonSporty && 'Sporty', sel.addonHospitalizace && 'Hospitalizace'].filter(Boolean) as string[];

  return {
    productName: 'Životní pojištění',
    insuranceKind: 'Životní pojištění (rizikové)',
    subjectLabel: `Životní pojištění · ${EMPLOYMENT_LABELS[insured.employment]}${insured.profession ? ` (${insured.profession})` : ''}`,
    insuredPersons: name,
    startDate: new Date().toISOString().slice(0, 10),
    amountBasis: `Doporučeno dle příjmů (${formatCzk(totalIncome(finance))}/měs.) a výdajů (${formatCzk(totalExpenses(finance))}/měs.)`,
    customer: {
      name,
      idLabel: 'Datum narození',
      idValue: insured.birthDate,
      address: '',
      phone: '',
      email: '',
    },
    scope: {
      rows: [
        { label: 'Produkt', value: `${offer.insurer} – ${offer.productName}` },
        ...offer.coverages.map((c) => ({ label: c.label, value: c.value })),
        { label: 'Připojištění', value: addons.length ? addons.join(', ') : 'žádné' },
        { label: 'Frekvence placení', value: `${freqLabel} (${formatCzk(perPeriod(offer, sel))} ${frequencySuffix(sel.frequency)})` },
        { label: 'Kuřák', value: health.smoker ? 'ano' : 'ne' },
      ],
      totalLabel: `${formatCzk(annual)} ročně`,
    },
    recommendedProductDefault: `${offer.insurer} – ${offer.productName}`,
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na finančním zajištění sebe a své rodiny pro případ úmrtí, invalidity, závažného onemocnění či trvalých následků úrazu, aby byl pokryt výpadek příjmu domácnosti.',
    impactParagraphs: IMPACT_ZIVOT,
  };
}
