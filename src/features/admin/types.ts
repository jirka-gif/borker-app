/** Typy entit globální administrace platformy. */

export type EntityStatus = 'aktivni' | 'neaktivni';

/** Typy pojistných produktů (sjednoceno s kalkulačkami + rozšíření). */
export type ProductType =
  | 'auta'
  | 'majetek'
  | 'cestovni'
  | 'odpovednost'
  | 'mazlicek'
  | 'zdravotni-cizinci'
  | 'zivotni'
  | 'podnikatele';

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  auta: 'Pojištění vozidel',
  majetek: 'Pojištění majetku',
  cestovni: 'Cestovní pojištění',
  odpovednost: 'Pojištění odpovědnosti',
  mazlicek: 'Pojištění mazlíčků',
  'zdravotni-cizinci': 'Zdravotní pojištění cizinců',
  zivotni: 'Životní pojištění',
  podnikatele: 'Pojištění podnikatelů',
};

export type SjednaniType = 'online' | 'podpis' | 'na-dalku';

export interface Insurer {
  id: string;
  name: string;
  tradeName: string;
  logoText: string;
  ico: string;
  address: string;
  web: string;
  email: string;
  phone: string;
  status: EntityStatus;
  note: string;
}

export interface Product {
  id: string;
  insurerId: string;
  /** Produktová oblast / kategorie (AUTO, MAJETEK, ŽIVOT, …). */
  category: string;
  name: string;
  internalCode: string;
  /** Kód, který pojišťovna používá pro sjednání produktu. */
  externalCode: string;
  type: ProductType;
  status: EntityStatus;
  /** Dostupné v kalkulačce. */
  calculatorEnabled: boolean;
  url: string;
  sjednani: SjednaniType[];
}

export type CompanyRole = 'firma-admin' | 'manazer' | 'poradce' | 'externista';

export const COMPANY_ROLE_LABELS: Record<CompanyRole, string> = {
  'firma-admin': 'Firma Admin',
  manazer: 'Manažer',
  poradce: 'Poradce',
  externista: 'Externista',
};

export interface Company {
  id: string;
  name: string;
  ico: string;
  dic: string;
  legalForm: string;
  address: string;
  email: string;
  phone: string;
  status: EntityStatus;
  createdAt: string;
  /** Jméno odpovědné osoby. */
  responsiblePerson: string;
  responsibleEmail: string;
  /** Celková provize firmy v % (nastaví se při založení). */
  commissionPercent: number;
  /** Regulatorní data z ČNB / JERS. */
  cnbSubjectType: string;
  cnbRegistrationNumber: string;
  cnbAuthorizationType: string;
  cnbAuthorizationFrom: string;
  cnbAuthorizationUntil: string;
  cnbExpertiseGroups: number[];
  cnbCrossBorder: string[];
  cnbSanctions: string;
  cnbValid: boolean;
  /** Pojišťovny, se kterými firma spolupracuje (id z registru pojišťoven). */
  insurerIds: string[];
  /* --- White-label branding (volitelné) --- */
  /** Hlavní barva firmy (hex). Prázdné = výchozí Star Insurance. */
  brandColor?: string;
  /** Iniciály / krátký text loga. */
  brandLogoText?: string;
  /** Logo jako data URL (nahrané) nebo odkaz. */
  brandLogoUrl?: string;
}

/** Typ distributora dle ČNB (regulatorní postavení). */
export type DistributorType = 'zamestnanec' | 'vazany-zastupce' | 'dpz';

export const DISTRIBUTOR_TYPE_LABELS: Record<DistributorType, string> = {
  zamestnanec: 'Zaměstnanec samostatného zprostředkovatele',
  'vazany-zastupce': 'Vázaný zástupce',
  dpz: 'Doplňkový pojišťovací zprostředkovatel',
};

/** Skupiny odbornosti dle zákona č. 170/2018 Sb. (§ 55). */
export const EXPERTISE_GROUPS: { id: number; label: string }[] = [
  { id: 1, label: 'Distribuce životního pojištění' },
  {
    id: 2,
    label:
      'Distribuce pojištění škod na pozemních dopravních prostředcích a odpovědnosti z provozu vozidla (vč. připojištění úrazu)',
  },
  { id: 3, label: 'Distribuce neživotního pojištění (mimo bodů 4 a 5)' },
  { id: 4, label: 'Distribuce neživotního pojištění podnikatelské činnosti (mimo bodu 5)' },
  { id: 5, label: 'Distribuce pojištění velkých pojistných rizik' },
  { id: 6, label: 'Distribuce zajištění' },
  { id: 7, label: 'Zprostředkování pojištění pojistníkem' },
];

export interface AdminUser {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: CompanyRole;
  status: EntityStatus;
  /** Provize uživatele v % (podíl z celkové provize firmy). */
  commissionPercent: number;
  /** Slugy kalkulaček, ke kterým má přístup. Prázdné = vše. */
  allowedCalculators: string[];

  /* --- Regulatorní data dle ČNB / JERS --- */
  distributorType: DistributorType;
  ico: string;
  birthDate: string;
  address: string;
  /** Typ oprávnění k činnosti (např. „Zápis do registru"). */
  cnbAuthorizationType: string;
  cnbRegistrationNumber: string;
  /** Datum vzniku oprávnění (ISO). */
  cnbAuthorizationFrom: string;
  /** Doba trvání oprávnění / platnost do (ISO). */
  cnbAuthorizationUntil: string;
  /** Skupiny odbornosti (id 1–7). */
  expertiseGroups: number[];
  /** Oprávnění přijímat pojistné nebo zprostředkovávat plnění. */
  canReceivePremium: boolean;
  /** Ověřeno v registru ČNB / JERS. */
  cnbVerified: boolean;
}

export type CommissionType = 'fixni-procento' | 'fixni-castka' | 'produkcni-bonus' | 'override' | 'individualni';

export const COMMISSION_TYPE_LABELS: Record<CommissionType, string> = {
  'fixni-procento': 'Fixní %',
  'fixni-castka': 'Fixní částka',
  'produkcni-bonus': 'Produkční bonus',
  override: 'Override',
  individualni: 'Individuální podmínky',
};

/** Úroveň, na které platí provize/sleva. */
export type ScopeLevel = 'pojistovna' | 'produkt' | 'firma' | 'uzivatel';

export const SCOPE_LEVEL_LABELS: Record<ScopeLevel, string> = {
  pojistovna: 'Pojišťovna',
  produkt: 'Produkt',
  firma: 'Firma',
  uzivatel: 'Uživatel',
};

export interface Commission {
  id: string;
  name: string;
  type: CommissionType;
  scope: ScopeLevel;
  /** Číselná hodnota (% nebo Kč dle typu). */
  value: number;
  /** Volitelná vazba na konkrétní entitu (název pro přehlednost). */
  target: string;
  status: EntityStatus;
}

export interface Discount {
  id: string;
  name: string;
  scope: ScopeLevel;
  /** Sleva v %. */
  percent: number;
  target: string;
  status: EntityStatus;
}

/** Nastavení provize firmy per pojišťovna / typ produktu. */
export interface CompanyCommission {
  id: string;
  companyId: string;
  insurerId: string;
  /** Typ produktu (auta, majetek, …). */
  productType: ProductType;
  /** Celková provize (kolik firma dostává od pojišťovny) v %. */
  totalPercent: number;
  /** Vyplácená provize (kolik se vyplácí poradci) v %. */
  payoutPercent: number;
}

export type AuditAction = 'vytvoreno' | 'upraveno' | 'smazano' | 'aktivovano' | 'deaktivovano' | 'systemova-akce';

export interface AuditEntry {
  id: string;
  at: string;
  who: string;
  action: AuditAction;
  entity: string;
  summary: string;
}
