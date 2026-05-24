import type { RecordInput } from '../../shared/record/types';
import { ADDONS, LIMITS, computeTotalPrice, formatCzk, type PolicyholderState } from './data';
import { formatAddress } from './components/FormFields';

const IMPACT_LIABILITY =
  'Pojištění odpovědnosti je pojištění soukromé a sjednává se jako pojištění škodové. Každé pojistné plnění je sníženo o spoluúčast, je-li ve smlouvě sjednána. Pojištěný není oprávněn bez předchozího souhlasu pojistitele právo na náhradu škody uznat, vyrovnat nebo uzavřít s poškozeným dohodu o mimosoudním vyrovnání. Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události.';

/**
 * Sestaví vstup pro „Záznam z jednání" u pojištění odpovědnosti z dat kroků 1+2.
 * Sdílí ho krok 3 (záznam) i krok 4 (stažení PDF dokumentu).
 */
export function buildLiabilityRecordInput(
  limit: string,
  added: Record<string, boolean>,
  p: PolicyholderState,
): RecordInput {
  const limitOption = LIMITS.find((l) => l.value === limit);
  const addedAddons = ADDONS.filter((a) => added[a.id]);
  const total = computeTotalPrice(limit, added);
  const customerName = [p.firstName, p.lastName].filter(Boolean).join(' ');

  return {
    productName: 'Pojištění odpovědnosti',
    insuranceKind: 'Pojištění odpovědnosti',
    subjectLabel: `Odpovědnost za škodu v běžném životě${
      p.ownsProperty ? ' a z vlastnictví nemovitosti' : ''
    }`,
    insuredPersons: customerName,
    insuredPlace: formatAddress(p.insuredAddress),
    startDate: p.startDate,
    amountBasis: `${limitOption?.label ?? '—'} (limit zvolen zákazníkem)`,
    customer: {
      name: customerName,
      idLabel: p.isForeigner ? 'Datum narození' : 'RČ / IČ',
      idValue: p.isForeigner ? p.birthDate : p.birthNumber,
      address: formatAddress(p.differentMailing ? p.mailingAddress : p.insuredAddress),
      permanentAddress: p.differentPermanent ? formatAddress(p.permanentAddress) : undefined,
      phone: p.phone,
      email: p.email,
    },
    scope: {
      rows: [
        { label: 'Limit plnění', value: limitOption?.label ?? '—' },
        ...addedAddons.map((a) => ({ label: a.title, value: `${formatCzk(a.price)} / rok` })),
      ],
      totalLabel: formatCzk(total),
    },
    recommendedProductDefault: 'Star Insurance Group – Pojištění odpovědnosti',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na ochraně před povinností nahradit škodu způsobenou třetí osobě v běžném občanském životě a z vlastnictví nemovitosti.',
    impactParagraphs: [IMPACT_LIABILITY],
  };
}
