import type {
  AdminUser,
  AuditEntry,
  Commission,
  Company,
  CompanyCommission,
  Discount,
  Insurer,
  Product,
  ProductType,
} from './types';
import { INSURER_PRODUCT_AREAS } from './productAreas';

/**
 * Seznam hlavních pojišťoven a poboček zahraničních pojišťoven působících v ČR.
 * Zdroj: ČNB – Seznamy regulovaných subjektů, BusinessInfo – Seznam pojišťoven.
 * (web/e-mail/telefon se doplní později – mock.)
 */
function insurer(
  id: string,
  name: string,
  tradeName: string,
  logoText: string,
  ico: string,
  address: string,
  note = '',
): Insurer {
  return { id, name, tradeName, logoText, ico, address, web: '', email: '', phone: '', status: 'aktivni', note };
}

export const MOCK_INSURERS: Insurer[] = [
  insurer('ins_allianz', 'Allianz pojišťovna, a.s.', 'Allianz', 'AZ', '47115971', 'Ke Štvanici 656/3, 186 00 Praha 8'),
  insurer('ins_atradius', 'Atradius Crédito y Caución S.A. de Seguros y Reaseguros, pobočka pro Českou republiku', 'Atradius', 'AT', '05568633', 'Karolinská 661/4, 186 00 Praha 8'),
  insurer('ins_cardif', 'BNP Paribas Cardif Pojišťovna, a.s.', 'BNP Paribas Cardif', 'BC', '25080954', 'Boudníkova 2606/1, 180 00 Praha 8'),
  insurer('ins_chubb', 'Chubb European Group SE, organizační složka', 'Chubb', 'CH', '27893723', 'Pobřežní 620/3, 186 00 Praha 8'),
  insurer('ins_colonnade', 'Colonnade Insurance S.A., organizační složka', 'Colonnade', 'CO', '04485297', 'Na Pankráci 1683/127, 140 00 Praha 4'),
  insurer('ins_credendo', 'Credendo - Short-Term EU Risks úvěrová pojišťovna, a.s.', 'Credendo', 'CR', '27245322', 'Pobřežní 665/21, 186 00 Praha 8'),
  insurer('ins_cpp', 'Česká podnikatelská pojišťovna, a.s., Vienna Insurance Group', 'ČPP', 'ČP', '63998530', 'Pobřežní 665/23, 186 00 Praha 8'),
  insurer('ins_csob', 'ČSOB Pojišťovna, a.s., člen holdingu ČSOB', 'ČSOB Pojišťovna', 'ČS', '45534306', 'Masarykovo náměstí 1458, 532 18 Pardubice'),
  insurer('ins_direct', 'Direct pojišťovna, a.s.', 'Direct pojišťovna', 'DI', '25073958', 'Nové sady 996/25, 602 00 Brno'),
  insurer('ins_erv', 'ERV Evropská pojišťovna, a.s.', 'ERV Evropská', 'EV', '49240196', 'Křižíkova 237/36a, 186 00 Praha 8'),
  insurer('ins_egap', 'Exportní garanční a pojišťovací společnost, a.s.', 'EGAP', 'EG', '45279314', 'Vodičkova 701/34, 111 21 Praha 1'),
  insurer('ins_generali', 'Generali Česká pojišťovna a.s.', 'Generali Česká', 'GČ', '45272956', 'Spálená 75/16, 110 00 Praha 1'),
  insurer('ins_halali', 'HALALI, všeobecná pojišťovna, a.s.', 'HALALI', 'HA', '60192402', 'Jungmannova 32/25, 115 25 Praha 1'),
  insurer('ins_hvp', 'Hasičská vzájemná pojišťovna, a.s.', 'Hasičská vzájemná', 'HV', '46973451', 'Římská 2135/45, 120 00 Praha 2'),
  insurer('ins_ipa', 'INTER PARTNER ASSISTANCE, organizační složka', 'Inter Partner Assistance', 'IP', '28225619', 'Hvězdova 1689/2a, 140 62 Praha 4'),
  insurer('ins_kompoj', 'Komerční pojišťovna, a.s.', 'Komerční pojišťovna', 'KP', '63998017', 'náměstí Junkových 2772/1, 155 00 Praha 5'),
  insurer('ins_koop', 'Kooperativa pojišťovna, a.s., Vienna Insurance Group', 'Kooperativa', 'KO', '47116617', 'Pobřežní 665/21, 186 00 Praha 8'),
  insurer('ins_maxima', 'MAXIMA pojišťovna, a.s.', 'MAXIMA pojišťovna', 'MX', '61328464', 'Italská 1583/24, 120 00 Praha 2'),
  insurer('ins_metlife', 'MetLife Europe d.a.c., pobočka pro Českou republiku', 'MetLife', 'ML', '03926206', 'Purkyňova 2121/3, 110 00 Praha 1'),
  insurer('ins_nn', 'NN Životní pojišťovna N.V., pobočka pro Českou republiku', 'NN Životní', 'NN', '40763587', 'Nádražní 344/25, 150 00 Praha 5'),
  insurer('ins_pillow', 'Pillow pojišťovna, a.s.', 'Pillow pojišťovna', 'PI', '04257111', 'Líbalova 2348/1, 149 00 Praha 4'),
  insurer('ins_vzp', 'Pojišťovna VZP, a.s.', 'Pojišťovna VZP', 'VZ', '27116913', 'Lazarská 1718/3, 110 00 Praha 1'),
  insurer('ins_simplea', 'Simplea pojišťovna, a.s.', 'Simplea pojišťovna', 'SI', '07880014', 'Hvězdova 1716/2b, 140 78 Praha 4'),
  insurer('ins_slavia', 'Slavia pojišťovna a.s.', 'Slavia', 'SL', '60197501', 'Táborská 940/31, 140 00 Praha 4', 'Silná v pojištění cizinců.'),
  insurer('ins_sv', 'SV pojišťovna, a.s.', 'SV pojišťovna', 'SV', '61858714', 'V Korytech 3155/23, 100 00 Praha 10'),
  insurer('ins_union', 'Union poisťovňa, a.s., pobočka pro Českou republiku', 'Union poisťovňa', 'UN', '24263796', 'Španělská 770/2, 120 00 Praha 2'),
  insurer('ins_uniqa', 'UNIQA pojišťovna, a.s.', 'UNIQA pojišťovna', 'UQ', '49240480', 'Evropská 810/136, 160 00 Praha 6'),
  insurer('ins_youplus', 'YOUPLUS Životní pojišťovna, pobočka pro Českou republiku', 'YOUPLUS', 'YP', '13991418', 'náměstí I. P. Pavlova 1789/5, 120 00 Praha 2'),
];

/** Odvodí typ produktu z názvu kategorie (pro filtrování/štítky). */
function categoryToType(category: string): ProductType {
  const c = category.toUpperCase();
  if (c.startsWith('AUTO')) return 'auta';
  if (c.startsWith('MAJETEK')) return 'majetek';
  if (c.startsWith('CESTOV')) return 'cestovni';
  if (c.startsWith('ODPOV')) return 'odpovednost';
  if (c.startsWith('ZDRAV')) return 'zdravotni-cizinci';
  if (c.includes('ŽIVOT')) return 'zivotni';
  return 'podnikatele';
}

function capitalize(s: string): string {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Produkty se generují z produktových oblastí pojišťoven – každá položka v
 * popisu oblasti se stává samostatným, editovatelným produktem (lze k němu
 * doplnit interní i sjednací kód). Pár vlajkových produktů má kódy předvyplněné.
 */
const SEED_CODES: Record<string, { internal: string; external: string; calc: boolean }> = {
  ins_koop_AUTO_0: { internal: 'KOOP-AUTO-01', external: '7710', calc: true },
  ins_csob_AUTO_0: { internal: 'CSOB-AUTO-MAX', external: 'MAX', calc: true },
  ins_koop_MAJETEK_0: { internal: 'KOOP-MAJ-100', external: '8810', calc: true },
  ins_slavia_ZDRAVOTNÍ_0: { internal: 'SLA-CIZ-KMPX', external: 'KMPX', calc: true },
};

function generateProducts(): Product[] {
  const out: Product[] = [];
  for (const [insurerId, areas] of Object.entries(INSURER_PRODUCT_AREAS)) {
    areas.forEach((area, ai) => {
      const items = area.detail
        ? area.detail.split(',').map((s) => s.trim()).filter(Boolean)
        : [area.category];
      items.forEach((item, ii) => {
        const key = `${insurerId}_${area.category}_${ii}`;
        const seed = SEED_CODES[key];
        out.push({
          id: `${insurerId}__${ai}_${ii}`,
          insurerId,
          category: area.category,
          name: capitalize(item),
          internalCode: seed?.internal ?? '',
          externalCode: seed?.external ?? '',
          type: categoryToType(area.category),
          status: 'aktivni',
          calculatorEnabled: seed?.calc ?? false,
          url: '',
          sjednani: ['online'],
        });
      });
    });
  }
  return out;
}

export const MOCK_PRODUCTS: Product[] = generateProducts();

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'co_frenkee',
    name: 'Frenkee s.r.o.',
    ico: '04812345',
    dic: 'CZ04812345',
    legalForm: 'Společnost s ručením omezeným',
    address: 'Radimovice 38, 251 69 Petříkov',
    email: 'info@frenkee.cz',
    phone: '+420 777 055 525',
    status: 'aktivni',
    createdAt: '2024-09-12',
    responsiblePerson: 'Jiří Hluchý',
    responsibleEmail: 'jirka@frenkee.cz',
    commissionPercent: 18,
    cnbSubjectType: 'Samostatný zprostředkovatel dle zákona o distribuci pojištění a zajištění',
    cnbRegistrationNumber: '195412PA',
    cnbAuthorizationType: 'Registrace',
    cnbAuthorizationFrom: '2019-03-12',
    cnbAuthorizationUntil: '2026-12-31',
    cnbExpertiseGroups: [1, 2, 3, 4, 5],
    cnbCrossBorder: ['PL', 'SK'],
    cnbSanctions: 'bez záznamu',
    cnbValid: true,
    insurerIds: ['ins_allianz', 'ins_koop', 'ins_csob', 'ins_generali', 'ins_uniqa', 'ins_cpp'],
  },
  {
    id: 'co_insia',
    name: 'INSIA Partner a.s.',
    ico: '48563210',
    dic: 'CZ48563210',
    legalForm: 'Akciová společnost',
    address: 'Vinohradská 1597/174, 130 00 Praha 3',
    email: 'partner@insia.cz',
    phone: '+420 226 290 290',
    status: 'aktivni',
    createdAt: '2025-01-20',
    responsiblePerson: 'Petr Novotný',
    responsibleEmail: 'petr.novotny@insia.cz',
    commissionPercent: 20,
    cnbSubjectType: 'Samostatný zprostředkovatel dle zákona o distribuci pojištění a zajištění',
    cnbRegistrationNumber: '021488PA',
    cnbAuthorizationType: 'Registrace',
    cnbAuthorizationFrom: '2018-06-01',
    cnbAuthorizationUntil: '2026-12-31',
    cnbExpertiseGroups: [1, 2, 3, 4, 5, 7],
    cnbCrossBorder: ['SK'],
    cnbSanctions: 'bez záznamu',
    cnbValid: true,
    insurerIds: ['ins_allianz', 'ins_koop', 'ins_csob', 'ins_slavia'],
  },
  {
    id: 'co_demo',
    name: 'Demo Makléři s.r.o.',
    ico: '11223344',
    dic: '',
    legalForm: 'Společnost s ručením omezeným',
    address: 'Náměstí Míru 1, 120 00 Praha 2',
    email: 'kancelar@demomakleri.cz',
    phone: '+420 222 333 444',
    status: 'neaktivni',
    createdAt: '2025-03-05',
    responsiblePerson: 'Eva Dvořáková',
    responsibleEmail: 'eva@demomakleri.cz',
    commissionPercent: 15,
    cnbSubjectType: '',
    cnbRegistrationNumber: '',
    cnbAuthorizationType: '',
    cnbAuthorizationFrom: '',
    cnbAuthorizationUntil: '',
    cnbExpertiseGroups: [],
    cnbCrossBorder: [],
    cnbSanctions: '',
    cnbValid: false,
    insurerIds: [],
  },
];

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u_jiri',
    companyId: 'co_frenkee',
    firstName: 'Jiří',
    lastName: 'Hluchý',
    email: 'jirka@frenkee.cz',
    phone: '+420 777 055 525',
    role: 'firma-admin',
    commissionPercent: 80,
    status: 'aktivni',
    allowedCalculators: [],
    distributorType: 'vazany-zastupce',
    ico: '04812345',
    birthDate: '1985-06-20',
    address: 'Radimovice 38, 257 69 Petříkov',
    cnbAuthorizationType: 'Zápis do registru',
    cnbRegistrationNumber: '195412PA',
    cnbAuthorizationFrom: '2024-09-12',
    cnbAuthorizationUntil: '2026-12-31',
    expertiseGroups: [1, 2, 3, 4, 5],
    canReceivePremium: true,
    cnbVerified: true,
  },
  {
    id: 'u_marek',
    companyId: 'co_frenkee',
    firstName: 'Marek',
    lastName: 'Svoboda',
    email: 'marek@frenkee.cz',
    phone: '+420 776 200 100',
    role: 'poradce',
    commissionPercent: 55,
    status: 'aktivni',
    allowedCalculators: ['auta', 'majetek', 'cestovni'],
    distributorType: 'zamestnanec',
    ico: '',
    birthDate: '1990-03-11',
    address: 'Nuselská 12, 140 00 Praha 4',
    cnbAuthorizationType: 'Zápis do registru',
    cnbRegistrationNumber: '208845ZA',
    cnbAuthorizationFrom: '2025-01-15',
    cnbAuthorizationUntil: '2026-12-31',
    expertiseGroups: [2, 3],
    canReceivePremium: false,
    cnbVerified: true,
  },
  {
    id: 'u_petr',
    companyId: 'co_insia',
    firstName: 'Petr',
    lastName: 'Novotný',
    email: 'petr.novotny@insia.cz',
    phone: '+420 602 111 222',
    role: 'firma-admin',
    commissionPercent: 75,
    status: 'aktivni',
    allowedCalculators: [],
    distributorType: 'vazany-zastupce',
    ico: '88112233',
    birthDate: '1978-11-02',
    address: 'Vinohradská 1597/174, 130 00 Praha 3',
    cnbAuthorizationType: 'Zápis do registru',
    cnbRegistrationNumber: '021488PA',
    cnbAuthorizationFrom: '2025-01-20',
    cnbAuthorizationUntil: '2026-12-31',
    expertiseGroups: [1, 2, 3, 4, 5, 7],
    canReceivePremium: true,
    cnbVerified: true,
  },
  {
    id: 'u_lucie',
    companyId: 'co_insia',
    firstName: 'Lucie',
    lastName: 'Králová',
    email: 'lucie.kralova@insia.cz',
    phone: '+420 603 333 444',
    role: 'manazer',
    commissionPercent: 60,
    status: 'aktivni',
    allowedCalculators: [],
    distributorType: 'zamestnanec',
    ico: '',
    birthDate: '1992-08-05',
    address: 'Korunní 810/104, 101 00 Praha 10',
    cnbAuthorizationType: 'Zápis do registru',
    cnbRegistrationNumber: '231007ZA',
    cnbAuthorizationFrom: '2025-02-01',
    cnbAuthorizationUntil: '2026-12-31',
    expertiseGroups: [1, 2, 3],
    canReceivePremium: false,
    cnbVerified: true,
  },
];

export const MOCK_COMMISSIONS: Commission[] = [
  { id: 'cm_1', name: 'Vozidla – základní provize', type: 'fixni-procento', scope: 'produkt', value: 12, target: 'Pojištění vozidel', status: 'aktivni' },
  { id: 'cm_2', name: 'Kooperativa – override', type: 'override', scope: 'pojistovna', value: 3, target: 'Kooperativa', status: 'aktivni' },
  { id: 'cm_3', name: 'Frenkee – produkční bonus', type: 'produkcni-bonus', scope: 'firma', value: 15000, target: 'Frenkee s.r.o.', status: 'aktivni' },
  { id: 'cm_4', name: 'Cizinci – fixní provize', type: 'fixni-procento', scope: 'produkt', value: 18, target: 'Zdravotní pojištění cizinců', status: 'aktivni' },
];

export const MOCK_DISCOUNTS: Discount[] = [
  { id: 'ds_1', name: 'Sleva pro nové klienty', scope: 'produkt', percent: 10, target: 'Pojištění vozidel', status: 'aktivni' },
  { id: 'ds_2', name: 'INSIA – partnerská sleva', scope: 'firma', percent: 5, target: 'INSIA Partner a.s.', status: 'aktivni' },
  { id: 'ds_3', name: 'Cestovní – léto', scope: 'produkt', percent: 8, target: 'Cestovní pojištění', status: 'neaktivni' },
];

export const MOCK_AUDIT: AuditEntry[] = [
  { id: 'a_1', at: '2026-05-22 09:14', who: 'Jiří Hluchý', action: 'vytvoreno', entity: 'Firma', summary: 'Vytvořena firma „INSIA Partner a.s." (IČO 48563210)' },
  { id: 'a_2', at: '2026-05-22 09:15', who: 'Systém', action: 'systemova-akce', entity: 'Pozvánka', summary: 'Odeslány přístupové údaje na petr.novotny@insia.cz' },
  { id: 'a_3', at: '2026-05-21 16:40', who: 'Jiří Hluchý', action: 'deaktivovano', entity: 'Produkt', summary: 'Deaktivován produkt „Allianz Odpovědnost v běžném životě"' },
  { id: 'a_4', at: '2026-05-20 11:02', who: 'Jiří Hluchý', action: 'upraveno', entity: 'Provize', summary: 'Změněna provize „Vozidla – základní provize" z 10 % na 12 %' },
];

/**
 * Mock objemy obchodů (roční pojistné v Kč) podle stavu sjednání – slouží pro
 * výpočet provizí na dashboardu. V reálu se počítá z uzavřených kalkulací.
 */
export const MOCK_DEAL_VOLUMES = {
  neuzavrene: 2450000,
  rozpracovane: 1180000,
  dokoncene: 6320000,
};

/** Mock provizní nastavení firem (per pojišťovna / produkt). */
export const MOCK_COMPANY_COMMISSIONS: CompanyCommission[] = [
  { id: 'cc_1', companyId: 'co_frenkee', insurerId: 'ins_koop', productType: 'auta', totalPercent: 18, payoutPercent: 12 },
  { id: 'cc_2', companyId: 'co_frenkee', insurerId: 'ins_koop', productType: 'majetek', totalPercent: 22, payoutPercent: 15 },
  { id: 'cc_3', companyId: 'co_frenkee', insurerId: 'ins_csob', productType: 'auta', totalPercent: 16, payoutPercent: 11 },
  { id: 'cc_4', companyId: 'co_frenkee', insurerId: 'ins_slavia', productType: 'zdravotni-cizinci', totalPercent: 22, payoutPercent: 15 },
  { id: 'cc_5', companyId: 'co_insia', insurerId: 'ins_allianz', productType: 'auta', totalPercent: 20, payoutPercent: 14 },
];
