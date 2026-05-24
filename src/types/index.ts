/**
 * Centrální typy domény Star Insurance Group.
 * Tyto typy budou sdílené s budoucím API / CRM vrstvou.
 */

/** Typ pojištění – odpovídá modulům první fáze. */
export type InsuranceType =
  | "auta"
  | "majetek"
  | "cestovni"
  | "odpovednost"
  | "zamzam"
  | "mazlicek"
  | "zdravotni-cizinci"
  | "zivotni"
  | "lexia";

/** Stav rozpracované kalkulace (workflow). */
export type CalculationStatus =
  | "rozepsana"
  | "ceka-na-doplneni"
  | "nabidka-vytvorena"
  | "ceka-na-podpis"
  | "dokonceno"
  | "storno";

/** Stav dostupnosti kalkulačky. */
export type CalculatorStatus = "aktivni" | "pripravujeme";

/** Jak se kalkulačka otevírá – architektura musí být flexibilní. */
export type CalculatorKind = "interni" | "embedded" | "iframe" | "externi";

/** Role uživatele – v 1. fázi pouze "poradce". */
export type UserRole = "poradce" | "manazer" | "admin" | "partner" | "externista";

/**
 * Profil poradce z administrace – údaje zprostředkovatele, které se
 * automaticky propisují do dokumentů (např. „Zastoupená" v Záznamu z jednání).
 * V reálu vrací backend / administrace; needitovatelné na úrovni dokumentu.
 */
export interface AdvisorProfile {
  ico: string;
  address: string;
  phone: string;
  intermediaryType: "zamestnanec" | "vazany-zastupce" | "dpz";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  /** Profil zprostředkovatele z administrace. */
  advisor?: AdvisorProfile;
}

/** Definice kalkulačky v registru. */
export interface Calculator {
  /** URL-friendly identifikátor, např. "auta". */
  slug: InsuranceType;
  name: string;
  description: string;
  /** Lucide ikona se mapuje v UI dle iconKey. */
  iconKey: string;
  type: InsuranceType;
  status: CalculatorStatus;
  kind: CalculatorKind;
  /** Cesta (interní) nebo URL (iframe/externí). */
  href?: string;
}

/** Rozpracovaná kalkulace (draft) na dashboardu. */
export interface Draft {
  id: string;
  type: InsuranceType;
  /** Lidský název kalkulačky pro zobrazení. */
  calculatorName: string;
  clientName: string;
  status: CalculationStatus;
  /** Postup vyplnění 0–100. */
  progress: number;
  /** Krok, do kterého se uživatel vrátí (continue flow). */
  currentStep: number;
  totalSteps: number;
  updatedAt: string;
  /** Orientační roční pojistné, pokud již spočteno. */
  premium?: number;
}

/** Záznam o nedávno použité kalkulačce. */
export interface RecentCalculator {
  slug: InsuranceType;
  usedAt: string;
}

/** Stav sjednané smlouvy. */
export type ContractStatus = "aktivni" | "ceka-na-platbu" | "ukoncena";

/** Sjednaná smlouva (po dokončení kalkulace; v reálu z navazujících systémů). */
export interface Contract {
  id: string;
  /** Číslo smlouvy. */
  number: string;
  clientName: string;
  type: InsuranceType;
  /** Pojišťovna, u které je smlouva sjednaná. */
  insurer: string;
  /** Roční pojistné v Kč. */
  premium: number;
  status: ContractStatus;
  /** Datum počátku pojištění (ISO). */
  startDate: string;
  /** Datum sjednání (ISO). */
  signedAt: string;
}
