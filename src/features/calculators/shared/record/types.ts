/**
 * Sdílené typy pro „Záznam z jednání" (§ 77 a 79 zák. č. 170/2018 Sb., ZDPZ).
 * Produktově nezávislé – používá je odpovědnost, vozidla, majetek i cestovní.
 */

export interface RecordState {
  intermediaryVariant: 'zamestnanec' | 'vazany-zastupce' | 'dpz';
  mode: 'agent' | 'makler';
  representativeName: string;
  representativeIco: string;
  representativeAddress: string;
  representativePhone: string;
  representativeEmail: string;
  contractMethod: string;
  signingMethod: string;
  otherNeeds: string;
  insuredInterest: string;
  paymentFrequency: string;
  insuredEnd: string;
  recommendedProduct: string;
  recommendationReason: string;
  hasDiscrepancies: boolean;
  discrepancies: string;
  customerAccepts: boolean;
  decisionNote: string;
  electronicConsent: boolean;
  issueDate: string;
  /* --- Podpis záznamu --- */
  /** Datum digitálního podpisu zprostředkovatele (ISO). Prázdné = nepodepsáno. */
  advisorSignedAt: string;
  /** Jméno podepisujícího zprostředkovatele (dle přihlášení). */
  advisorSignedName: string;
  /** Způsob ověření podpisu klientem. */
  clientSignMethod: 'email' | 'sms';
  /** Kontakt, na který odešel požadavek na podpis (e-mail / telefon). */
  clientSignContact: string;
  /** Klient potvrdil podpis ověřením. */
  clientSigned: boolean;
  /** Datum podpisu klienta (ISO) – shodné s datem podpisu zprostředkovatele. */
  clientSignedAt: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const initialRecord: RecordState = {
  intermediaryVariant: 'zamestnanec',
  mode: 'agent',
  representativeName: '',
  representativeIco: '',
  representativeAddress: '',
  representativePhone: '',
  representativeEmail: '',
  contractMethod: 'osobně',
  signingMethod: 'zaplacením pojistného',
  otherNeeds: '',
  insuredInterest: '',
  paymentFrequency: 'ročně',
  insuredEnd: '',
  recommendedProduct: '',
  recommendationReason: '',
  hasDiscrepancies: false,
  discrepancies: '',
  customerAccepts: true,
  decisionNote: '',
  electronicConsent: true,
  issueDate: todayIso(),
  advisorSignedAt: '',
  advisorSignedName: '',
  clientSignMethod: 'email',
  clientSignContact: '',
  clientSigned: false,
  clientSignedAt: '',
};

/** Možnosti pro „Způsob jednání" a „Sjednání pojistné smlouvy". */
export const CONTRACT_METHODS = [
  'osobně',
  'e-mailem',
  'telefonicky',
  'online (na dálku)',
  'korespondenčně',
];

export const SIGNING_METHODS = [
  'podpisem',
  'zaplacením pojistného',
  'elektronicky / online',
];

/* --------------------- Produktově nezávislý vstup --------------------- */

export interface RecordRow {
  label: string;
  value: string;
}

export interface RecordCustomer {
  name: string;
  /** Popisek identifikátoru, např. „RČ / IČ" nebo „Datum narození". */
  idLabel: string;
  idValue: string;
  /** Korespondenční / hlavní adresa v jednom řádku. */
  address: string;
  permanentAddress?: string;
  phone: string;
  email: string;
}

export interface RecordScope {
  /** Řádky rozsahu / rizik / rekapitulace z kalkulačky. */
  rows: RecordRow[];
  /** Celkové roční pojistné (formátované), volitelné. */
  totalLabel?: string;
}

/** Řádek tabulky „Navrhovaná řešení" (nabídky z kalkulace). */
export interface RecordOffer {
  insurer: string;
  product: string;
  /** Roční pojistné, formátované, např. „27 871 Kč". */
  priceLabel: string;
  /** Doporučeno zprostředkovatelem. */
  recommended: boolean;
  /** Volba zákazníka. */
  chosen: boolean;
}

/** Kompletní produktový vstup pro záznam z jednání. */
export interface RecordInput {
  /** Název produktu, např. „Pojištění vozidel". */
  productName: string;
  /** Druh požadovaného pojištění (řádek v sekci požadavky). */
  insuranceKind: string;
  /** Popis předmětu pojištění. */
  subjectLabel: string;
  /** Pojištěné osoby (jména). */
  insuredPersons: string;
  /** Adresa / místo pojištění (volitelné). */
  insuredPlace?: string;
  /** Počátek pojištění (ISO, volitelné). */
  startDate?: string;
  /** Hodnota pole „Stanovení pojistné částky". */
  amountBasis?: string;
  customer: RecordCustomer;
  scope: RecordScope;
  /** Navrhovaná řešení / nabídky z kalkulace (tabulka v sekci Doporučení). */
  offers?: RecordOffer[];
  /** Výchozí doporučený produkt (předvyplní se, pokud je pole prázdné). */
  recommendedProductDefault: string;
  /** Výchozí text pojistného zájmu (předvyplní se, pokud je prázdné). */
  defaultInsuredInterest?: string;
  /** Produktově specifické odstavce „Popis dopadů". */
  impactParagraphs: string[];
}

/** Kontext pro AI návrhy. */
export interface SuggestContext {
  customerName: string;
  productName: string;
  /** Aktuálně doporučený produkt (z pole v záznamu). */
  recommendedProduct: string;
  /** Lidsky čitelný souhrn rozsahu, např. „limit 10 mil. Kč, …". */
  scopeSummary: string;
  totalLabel: string;
}
