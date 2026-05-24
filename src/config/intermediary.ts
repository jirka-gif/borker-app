/**
 * Konfigurace zprostředkovatele (Star Insurance Group) a proměnných pro
 * dokumenty typu „Záznam z jednání" (§ 77 a 79 zák. č. 170/2018 Sb., ZDPZ).
 *
 * Nahrazuje původní placeholdery v šabloně: ${MODE}, ${COMPANY_COMP_EMAIL},
 * ${COMPANY_WEB}, ${COMPLAINTS_URL}. Údaje doplníme/upravíme zde na jednom místě.
 */

export interface IntermediaryConfig {
  companyName: string;
  ico: string;
  address: string;
  phone: string;
  email: string;
  /** E-mail pro stížnosti a reklamace. */
  complaintEmail: string;
  /** Webové stránky zprostředkovatele. */
  web: string;
  /** Cesta k reklamačnímu řádu / sekci stížností. */
  complaintsUrl: string;
  /** Odkaz na registr ČNB pro ověření zápisu. */
  cnbRegistryUrl: string;
  /** Číslo verze dokumentu (footer). */
  documentVersion: string;
}

export const INTERMEDIARY: IntermediaryConfig = {
  companyName: "Star Insurance Group s.r.o.",
  ico: "00000000",
  address: "—, Praha",
  phone: "+420 000 000 000",
  email: "info@starinsurance.cz",
  complaintEmail: "reklamace@starinsurance.cz",
  web: "www.starinsurance.cz",
  complaintsUrl: "www.starinsurance.cz/reklamace",
  cnbRegistryUrl: "https://www.cnb.cz/cnb/jerrs",
  documentVersion: "1.0",
};

/**
 * Postavení zprostředkovatele v daném obchodním případě (§ 6 ZDPZ) –
 * dosazuje se za ${MODE} v prohlášení.
 */
export type IntermediaryMode = "agent" | "makler";

export const INTERMEDIARY_MODE_LABELS: Record<IntermediaryMode, string> = {
  agent: "pojišťovací agent (zprostředkovává pojištění pro pojišťovnu)",
  makler: "pojišťovací makléř (zprostředkovává pojištění pro zákazníka)",
};

/**
 * Typ/varianta zprostředkovatele. Pozn. compliance: „Tisk pouze u VZ a DPZ"
 * – sekce zastoupené osoby se v dokumentu zobrazuje jen u vázaného zástupce
 * a doplňkového pojišťovacího zprostředkovatele.
 */
export type IntermediaryVariant = "zamestnanec" | "vazany-zastupce" | "dpz";

export const INTERMEDIARY_VARIANT_LABELS: Record<IntermediaryVariant, string> = {
  zamestnanec: "Zaměstnanec samostatného zprostředkovatele",
  "vazany-zastupce": "Vázaný zástupce",
  dpz: "Doplňkový pojišťovací zprostředkovatel",
};

/** U kterých variant se tiskne sekce „Zastoupená osoba". */
export function showsRepresentedPerson(variant: IntermediaryVariant): boolean {
  return variant === "vazany-zastupce" || variant === "dpz";
}
