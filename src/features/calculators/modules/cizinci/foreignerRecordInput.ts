import type { RecordInput } from '../../shared/record/types';
import {
  CARE_TYPES,
  INSURED_TYPES,
  formatCzk,
  type ForeignerInputState,
  type ForeignerPolicyholderState,
  type ForeignerSelectionState,
} from './data';
import { getForeignerOffers, monthlyPrice, totalPrice } from './offers';

const IMPACT_FOREIGNER = [
  'Zdravotní pojištění cizinců je pojištění soukromé a sjednává se jako pojištění škodové. Plnění je poskytováno do sjednaného limitu; na čekací doby, výluky a preexistující onemocnění se vztahují pojistné podmínky. U komplexní péče je hrazena i ambulantně předepsaná péče a léky v rozsahu podmínek.',
  'Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události a řídit se pokyny asistenční služby. Pojištění může být podmínkou pro udělení nebo prodloužení dlouhodobého víza či povolení k pobytu.',
];

export function buildForeignerRecordInput(
  input: ForeignerInputState,
  selection: ForeignerSelectionState,
  p: ForeignerPolicyholderState,
): RecordInput {
  const offers = getForeignerOffers();
  const selected = offers.find((o) => o.id === selection.selectedOfferId) ?? offers[0];
  const insuredName = [p.firstName, p.lastName].filter(Boolean).join(' ');
  const careLabel = CARE_TYPES.find((c) => c.value === input.careType)?.title ?? '—';
  const typeLabel = INSURED_TYPES.find((t) => t.value === input.insuredType)?.label ?? '—';
  const monthly = selected ? monthlyPrice(selected, input, selection.durationMonths) : 0;
  const annual = selected ? totalPrice(selected, input, selection.durationMonths) : 0;

  // Pojistník = pojištěný, pokud není zvolena jiná osoba.
  const phName = p.phIsCompany
    ? p.phCompanyName
    : [p.phFirstName, p.phLastName].filter(Boolean).join(' ');
  const usePh = p.differentPolicyholder && Boolean(phName);
  const customerName = usePh ? phName : insuredName;
  const customerEmail = usePh && p.phEmail ? p.phEmail : p.email;
  const customerPhone = usePh && p.phPhone ? p.phPhone : p.phone;
  const customerIdLabel = usePh ? (p.phIsCompany ? 'IČ' : p.phNoBirthNumber ? 'Datum narození' : 'Rodné číslo') : 'Číslo pasu';
  const customerIdValue = usePh
    ? p.phIsCompany
      ? p.phIco
      : p.phNoBirthNumber
        ? p.phBirthDate
        : p.phBirthNumber
    : p.passportNumber;
  const customerAddress = usePh && p.phAddress ? p.phAddress : p.addressCz;

  return {
    productName: 'Zdravotní pojištění cizinců',
    insuranceKind: `Zdravotní pojištění cizinců – ${careLabel}`,
    subjectLabel: `${careLabel}, ${typeLabel}, pas č. ${p.passportNumber || '—'}, st. přísl. ${
      p.nationality || '—'
    }`,
    insuredPersons: insuredName,
    insuredPlace: p.addressCz,
    startDate: input.startDate,
    amountBasis: 'Limit plnění dle zvoleného produktu (10 000 000 Kč)',
    customer: {
      name: customerName,
      idLabel: customerIdLabel,
      idValue: customerIdValue,
      address: customerAddress,
      phone: customerPhone,
      email: customerEmail,
    },
    scope: {
      rows: [
        { label: 'Typ péče', value: careLabel },
        { label: 'Typ pojištěného', value: typeLabel },
        ...(input.insuredType === 'zena' && input.pregnancyPlanned
          ? [{ label: 'Těhotenství', value: 'Ano / plánováno – zahrnuta poporodní péče' }]
          : []),
        { label: 'Doba trvání', value: `${selection.durationMonths} měsíců` },
        { label: 'Pojistitel a produkt', value: selected ? `${selected.insurer} – ${selected.productName}` : '—' },
        { label: 'Měsíční pojistné', value: `${formatCzk(monthly)} / měsíčně` },
      ],
      totalLabel: `${formatCzk(annual)} celkem`,
    },
    offers: offers.map((o) => ({
      insurer: o.insurer,
      product: o.productName,
      priceLabel: `${formatCzk(totalPrice(o, input, selection.durationMonths))} celkem`,
      recommended: o.id === selected?.id,
      chosen: o.id === selected?.id,
    })),
    recommendedProductDefault: selected
      ? `${selected.insurer} – ${selected.productName}`
      : 'Zdravotní pojištění cizinců',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na úhradě nákladů zdravotní péče během pobytu v ČR a na splnění zákonné povinnosti být zdravotně pojištěn. Vznik pojistné události by pro něj znamenal přímou majetkovou ztrátu.',
    impactParagraphs: IMPACT_FOREIGNER,
  };
}
