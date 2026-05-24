import type { RecordInput } from '../../shared/record/types';
import type { FormData } from './types/formData';

function czk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  byt: 'Byt',
  dum: 'Rodinný dům',
  dům: 'Rodinný dům',
  rekreacni: 'Rekreační objekt',
};

const IMPACT_PROPERTY = [
  'Pojištění domácnosti, stavby, rekreační domácnosti a odpovědnosti jsou pojištění škodová. Pokud je pojistná částka nižší než pojistná hodnota, uplatní pojistitel podpojištění (tolerance bývá 10–20 %). V případě odcizení věci krádeží vloupáním bude poskytnuto plnění maximálně do výše limitů dle tabulky zabezpečení.',
  'Každé pojistné plnění je sníženo o spoluúčast, jejíž výše je uvedena v pojistné smlouvě. Pojištěný není oprávněn bez předchozího souhlasu pojistitele právo na náhradu škody uznat, vyrovnat nebo uzavřít s poškozeným dohodu o mimosoudním vyrovnání. Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události.',
];

/**
 * Sestaví vstup pro „Záznam z jednání" u pojištění majetku z dat formuláře.
 * Sdílí ho krok 4 (záznam) i krok 5 (stažení PDF dokumentu).
 */
export function buildPropertyRecordInput(formData: FormData): RecordInput {
  const isCompany = formData.personType !== 'fyzicka';
  const name =
    [formData.titleBefore, formData.firstName, formData.lastName, formData.titleAfter]
      .filter(Boolean)
      .join(' ') ||
    formData.companyName ||
    'Zákazník';

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[formData.propertyType] ?? formData.propertyType;

  const insuranceParts = [
    formData.insuranceStavba && 'pojištění stavby',
    formData.insuranceDomacnost && 'pojištění domácnosti',
  ].filter(Boolean) as string[];

  const scopeRows: RecordInput['scope']['rows'] = [
    {
      label: 'Druh krytí',
      value: insuranceParts.length ? insuranceParts.join(', ') : 'pojištění majetku',
    },
  ];
  if (formData.propertyValue) {
    scopeRows.push({ label: 'Pojistná částka stavby', value: czk(formData.propertyValue) });
  }
  if (formData.householdValue) {
    scopeRows.push({ label: 'Pojistná částka domácnosti', value: czk(formData.householdValue) });
  }
  scopeRows.push(
    { label: 'Připojištění', value: 'Atmosférické srážky, Povodeň a záplava' },
    { label: 'Splátky pojistného', value: formData.paymentFrequency || 'ročně' },
  );

  return {
    productName: 'Pojištění majetku',
    insuranceKind: 'Pojištění majetku (stavba / domácnost)',
    subjectLabel: `${propertyTypeLabel}${
      formData.propertyAddress ? `, ${formData.propertyAddress}` : ''
    }`,
    insuredPersons: name,
    insuredPlace: formData.propertyAddress || formData.address,
    startDate: formData.insuranceStartDate,
    amountBasis: formData.propertyValue
      ? `${czk(formData.propertyValue)} (pojistná částka stavby)`
      : 'dle pojistné hodnoty',
    customer: {
      name,
      idLabel: isCompany ? 'IČ' : 'RČ / IČ',
      idValue: isCompany ? formData.ico : formData.personalId || formData.birthDate,
      address: formData.correspondenceAddress || formData.address,
      phone: formData.phone,
      email: formData.email,
    },
    scope: {
      rows: scopeRows,
      totalLabel: '1 500 Kč',
    },
    // Navrhovaná řešení = nejlepší nabídky z kalkulace (3 nejlepší).
    offers: [
      {
        insurer: 'ČSOB Pojišťovna',
        product: 'PREMIANT',
        priceLabel: '1 500 Kč',
        recommended: true,
        chosen: true,
      },
      {
        insurer: 'ČPP',
        product: 'SPECIÁLPOV',
        priceLabel: '1 540 Kč',
        recommended: false,
        chosen: false,
      },
      {
        insurer: 'Kooperativa pojišťovna',
        product: 'NA MÍRU 100',
        priceLabel: '1 734 Kč',
        recommended: false,
        chosen: false,
      },
    ],
    recommendedProductDefault: 'ČSOB Pojišťovna – PREMIANT',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na ochraně své nemovitosti a vybavení domácnosti před následky pojistných událostí (živelní pohromy, voda, požár, odcizení). Vznik škody by pro něj znamenal přímou majetkovou ztrátu.',
    impactParagraphs: IMPACT_PROPERTY,
  };
}
