import type { RecordInput } from '../../../shared/record/types';

/**
 * Mock vstup pro „Záznam z jednání" u vozidel (v reálu z předchozích kroků /
 * API pojišťovny). Sdílí ho krok 4 (záznam) i krok 5 (stažení PDF dokumentu).
 */
const vehicleInfo = 'VW Golf 6 WAGON';
const vin = 'JMZGJ537234567905';
const spz = '0H37321';

export function buildVehicleRecordInput(): RecordInput {
  return {
    productName: 'Pojištění vozidel',
    insuranceKind: 'Pojištění vozidel (povinné ručení a havarijní pojištění)',
    subjectLabel: `${vehicleInfo}, VIN ${vin}, SPZ ${spz}`,
    insuredPersons: 'Marek Machula',
    startDate: '2025-09-17',
    amountBasis: 'Hodnota vozidla 295 808 Kč',
    customer: {
      name: 'Marek Machula',
      idLabel: 'RČ / IČ',
      idValue: '—',
      address: 'Machulová 108, 687 06 Brno',
      phone: '',
      email: '',
    },
    scope: {
      rows: [
        { label: 'POV', value: '100/100 mil. Kč, Allrisk' },
        { label: 'HAV', value: 'Allrisk, spoluúčast 5 %, min. 5 000 Kč' },
        { label: 'Připojištění', value: 'Skla (spoluúčast 1 000 Kč)' },
        { label: 'Splátky pojistného', value: 'Roční' },
        { label: 'Nabídka číslo', value: '1982899' },
      ],
      totalLabel: '27 871 Kč',
    },
    // Navrhovaná řešení = nejlepší nabídky z kalkulace (zde 3 nejlepší).
    offers: [
      {
        insurer: 'Kooperativa pojišťovna',
        product: 'POV 100/100 Allrisk',
        priceLabel: '27 871 Kč',
        recommended: true,
        chosen: true,
      },
      {
        insurer: 'Generali Česká pojišťovna',
        product: '100/100 mil. Kč All Risk',
        priceLabel: '32 586 Kč',
        recommended: false,
        chosen: false,
      },
      {
        insurer: 'Allianz',
        product: 'Balíček Max / Balíček Max',
        priceLabel: '32 814 Kč',
        recommended: false,
        chosen: false,
      },
    ],
    recommendedProductDefault: 'Kooperativa pojišťovna – POV 100/100 Allrisk',
    defaultInsuredInterest:
      'Zákazník má pojistný zájem na ochraně vlastního vozidla a na krytí odpovědnosti za škodu způsobenou provozem vozidla třetím osobám.',
    impactParagraphs: [
      'Povinné ručení, havarijní a doplňková pojištění a pojištění asistence jsou pojištění soukromá a sjednávají se jako pojištění škodová. Úrazové pojištění pro řidiče i ostatní cestující a pojištění pracovní neschopnosti a hospitalizace jsou pojištění soukromá a sjednávají se jako pojištění obnosová. Pojišťovna může podmiňovat pojištění vozidla jeho prohlídkou.',
      'Klient byl upozorněn, že povinné ručení kryje pouze škody způsobené jiným osobám, nikoli škody na vlastním vozidle. Pokud je požadovaná pojistná částka nižší než skutečná hodnota vozidla, může pojistitel uplatnit podpojištění; je-li vyšší, vychází v případě pojistné události z ceny vozidla v době pojistné události.',
    ],
  };
}
