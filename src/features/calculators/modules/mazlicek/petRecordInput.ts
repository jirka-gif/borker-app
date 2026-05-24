import type { RecordInput } from '../../shared/record/types';
import {
  ADDONS,
  FREQUENCY_SUFFIX,
  PAYMENT_FREQUENCIES,
  formatCzk,
  type PetCoverageState,
  type PetPolicyholderState,
  type PetState,
} from './data';
import { annualTotal, getPetOffers, perPeriodPrice, type PetOffer } from './offers';

const IMPACT_PET = [
  'Pojištění mazlíčka je pojištění soukromé a sjednává se jako pojištění škodové. Plnění za veterinární péči je poskytováno do sjednaného ročního limitu a je sníženo o spoluúčast, je-li sjednána. Na vybrané úkony a preexistující onemocnění se mohou vztahovat výluky a čekací doby dle pojistných podmínek.',
  'Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události a doložit veterinární dokumentaci. Připojištění odpovědnosti kryje škody způsobené mazlíčkem třetí osobě v rozsahu pojistných podmínek.',
];

const SEX_LABELS = { samecek: 'sameček', samicka: 'samička' } as const;

export function buildPetRecordInput(
  pet: PetState,
  coverage: PetCoverageState,
  policyholder: PetPolicyholderState,
): RecordInput {
  const offers = getPetOffers(pet.type);
  const selected: PetOffer | undefined =
    offers.find((o) => o.id === coverage.selectedOfferId) ?? offers[0];

  const customerName = [policyholder.firstName, policyholder.lastName].filter(Boolean).join(' ');
  const address = [
    [policyholder.street, policyholder.houseNumber].filter(Boolean).join(' '),
    [policyholder.zip, policyholder.city].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');

  const addedAddons = ADDONS.filter((a) => coverage.addons[a.id]);
  const freqLabel =
    PAYMENT_FREQUENCIES.find((f) => f.value === coverage.frequency)?.label ?? 'Měsíčně';
  const period = selected ? perPeriodPrice(selected, coverage) : 0;
  const annual = selected ? annualTotal(selected, coverage) : 0;

  const scopeRows = [
    { label: 'Mazlíček', value: `${pet.name || '—'} (${pet.breed || '—'})` },
    {
      label: 'Druh / pohlaví',
      value: `${pet.type === 'pes' ? 'Pes' : 'Kočka'}, ${SEX_LABELS[pet.sex]}${
        pet.neutered ? ', kastrovaný/á' : ''
      }`,
    },
    { label: 'Pojistný produkt', value: selected ? `${selected.insurer} – ${selected.productName}` : '—' },
    ...addedAddons.map((a) => ({ label: 'Připojištění', value: a.title })),
    { label: 'Frekvence platby', value: `${freqLabel} (${formatCzk(period)} ${FREQUENCY_SUFFIX[coverage.frequency]})` },
  ];

  return {
    productName: 'Pojištění mazlíčka',
    insuranceKind: 'Pojištění domácích mazlíčků (veterinární péče)',
    subjectLabel: `${pet.type === 'pes' ? 'Pes' : 'Kočka'} – ${pet.breed || '—'}, č. čipu ${
      pet.chipNumber || '—'
    }`,
    insuredPersons: customerName,
    startDate: coverage.startDate,
    amountBasis: 'Roční limit plnění dle zvoleného produktu',
    customer: {
      name: customerName,
      idLabel: 'RČ / IČ',
      idValue: policyholder.personalId || policyholder.birthDate,
      address,
      phone: policyholder.phone,
      email: policyholder.email,
    },
    scope: {
      rows: scopeRows,
      totalLabel: `${formatCzk(annual)} ročně`,
    },
    offers: offers.map((o) => ({
      insurer: o.insurer,
      product: o.productName,
      priceLabel: `${formatCzk(annualTotal(o, coverage))} ročně`,
      recommended: o.id === selected?.id,
      chosen: o.id === selected?.id,
    })),
    recommendedProductDefault: selected
      ? `${selected.insurer} – ${selected.productName}`
      : 'Pojištění mazlíčka',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na úhradě nákladů na veterinární péči svého mazlíčka a na krytí souvisejících rizik. Vznik pojistné události by pro něj znamenal přímou majetkovou ztrátu.',
    impactParagraphs: IMPACT_PET,
  };
}
