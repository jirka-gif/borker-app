import type { RecordInput } from '../../shared/record/types';
import {
  annualPrice,
  formatCzk,
  pillarsFor,
  type LexiaInputState,
  type LexiaPolicyholderState,
} from './data';

const IMPACT_LEXIA = [
  'Pojištění právní ochrany je pojištění soukromé a sjednává se jako pojištění škodové. Hradí náklady právního zastoupení, soudní a související výdaje v rozsahu sjednaných pilířů a do limitů uvedených v pojistných podmínkách. Na spory vzniklé před počátkem pojištění a na sjednané výluky se pojištění nevztahuje.',
  'Pojištěný je povinen oznámit pojistiteli vznik pojistné události bez zbytečného odkladu a poskytnout součinnost. Konkrétní nabídka se všemi parametry je zpracována dle aktuálních tarifů Lexia.',
];

export function buildLexiaRecordInput(input: LexiaInputState, p: LexiaPolicyholderState): RecordInput {
  const isB2B = input.segment === 'b2b';
  const selected = pillarsFor(input.segment).filter((pl) => pl.mandatory || input.selected[pl.id]);
  const total = annualPrice(input);
  const customerName = isB2B ? p.companyName : [p.firstName, p.lastName].filter(Boolean).join(' ');
  const segmentLabel = isB2B
    ? 'Podnikatelé & firmy'
    : input.subject === 'domacnost'
      ? 'Domácnost (až 5 členů)'
      : 'Jednotlivec';

  return {
    productName: 'Lexia – právní ochrana',
    insuranceKind: 'Pojištění právní ochrany',
    subjectLabel: `Právní ochrana · ${segmentLabel}`,
    insuredPersons: customerName,
    startDate: input.startDate,
    amountBasis: 'Limity plnění dle sjednaných pilířů a tarifů Lexia',
    customer: {
      name: customerName,
      idLabel: isB2B ? 'IČO' : 'Rodné číslo',
      idValue: isB2B ? p.ico : p.birthNumber,
      address: p.address,
      phone: p.phone,
      email: p.email,
    },
    scope: {
      rows: [
        { label: 'Pro koho', value: segmentLabel },
        ...selected.map((pl) => ({ label: pl.title, value: `${formatCzk(pl.price)} / rok` })),
        { label: 'Pojistitel', value: 'Lexia' },
      ],
      totalLabel: `${formatCzk(total)} ročně`,
    },
    recommendedProductDefault: 'Lexia – právní ochrana',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na úhradě nákladů právního zastoupení a obrany svých oprávněných zájmů ve sporech vyplývajících z běžného života či podnikání.',
    impactParagraphs: IMPACT_LEXIA,
  };
}
