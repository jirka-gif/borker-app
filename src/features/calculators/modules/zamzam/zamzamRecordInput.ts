import type { RecordInput } from '../../shared/record/types';
import {
  DRIVING_OPTIONS,
  SPOLUUCAST_OPTIONS,
  formatCzk,
  tierFor,
  type ZamZamInputState,
  type ZamZamPolicyholderState,
} from './data';

const IMPACT_ZAMZAM = [
  'Pojištění odpovědnosti zaměstnance za škodu způsobenou zaměstnavateli při výkonu povolání je pojištění soukromé a sjednává se jako pojištění škodové. Plnění je omezeno sjednaným limitem (krytím) a je sníženo o sjednanou spoluúčast. U řidičů z povolání se vztahuje i na škody způsobené při řízení vozidla zaměstnavatele.',
  'Pojištěný je povinen bezodkladně oznámit pojistiteli vznik pojistné události. Limit krytí by měl odpovídat až 4,5násobku průměrného hrubého měsíčního výdělku, do jehož výše může zaměstnavatel uplatnit náhradu škody dle zákoníku práce.',
];

export function buildZamZamRecordInput(
  input: ZamZamInputState,
  p: ZamZamPolicyholderState,
): RecordInput {
  const tier = tierFor(input.coverage);
  const annual = tier?.annual ?? 0;
  const drivingLabel = DRIVING_OPTIONS.find((d) => d.value === input.driving)?.label ?? '—';
  const spoluLabel = SPOLUUCAST_OPTIONS.find((s) => s.value === input.spoluucast)?.label ?? '';
  const insuredName = [p.firstName, p.lastName].filter(Boolean).join(' ');
  const address = [
    [p.street, p.houseNumber].filter(Boolean).join(' '),
    [p.zip, p.city].filter(Boolean).join(' '),
    p.country,
  ]
    .filter(Boolean)
    .join(', ');

  const usePh = p.differentPolicyholder && Boolean(p.phName);

  return {
    productName: 'ZamZam – pojištění odpovědnosti z výkonu povolání',
    insuranceKind: 'Pojištění odpovědnosti zaměstnance vůči zaměstnavateli',
    subjectLabel: `Odpovědnost z výkonu povolání · ${drivingLabel}`,
    insuredPersons: insuredName,
    startDate: input.startDate,
    amountBasis: `${formatCzk(input.coverage)} (limit krytí)`,
    customer: {
      name: usePh ? p.phName : insuredName,
      idLabel: p.noBirthNumber ? 'Datum narození' : 'RČ / IČ',
      idValue: p.noBirthNumber ? p.birthDate : p.birthNumber,
      address,
      phone: usePh && p.phPhone ? p.phPhone : p.phone,
      email: usePh && p.phEmail ? p.phEmail : p.email,
    },
    scope: {
      rows: [
        { label: 'Limit krytí', value: formatCzk(input.coverage) },
        { label: 'Spoluúčast', value: `${input.spoluucast} % (${spoluLabel}, min. 5 000 Kč)` },
        { label: 'Řízení v práci', value: drivingLabel },
        { label: 'Pojistitel', value: 'ČSOB Pojišťovna' },
      ],
      totalLabel: `${formatCzk(annual)} ročně`,
    },
    recommendedProductDefault: 'ČSOB Pojišťovna – ZamZam (odpovědnost z výkonu povolání)',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na ochraně před povinností nahradit škodu způsobenou zaměstnavateli při výkonu povolání. Vznik škody by pro něj znamenal přímou majetkovou ztrátu z titulu odpovědnosti dle zákoníku práce.',
    impactParagraphs: IMPACT_ZAMZAM,
  };
}
