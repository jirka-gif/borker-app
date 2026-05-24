import type { CalculationStatus } from "@/types";

/** Vizuální tón status badge. Mapuje se na barevné varianty komponenty Badge. */
export type StatusTone = "neutral" | "info" | "warning" | "brand" | "success" | "danger";

interface StatusMeta {
  label: string;
  tone: StatusTone;
}

/** Metadata stavů kalkulace – jediný zdroj pravdy pro labely a barvy. */
export const CALCULATION_STATUS_META: Record<CalculationStatus, StatusMeta> = {
  rozepsana: { label: "Rozepsaná", tone: "neutral" },
  "ceka-na-doplneni": { label: "Čeká na doplnění", tone: "warning" },
  "nabidka-vytvorena": { label: "Nabídka vytvořena", tone: "info" },
  "ceka-na-podpis": { label: "Čeká na podpis", tone: "brand" },
  dokonceno: { label: "Dokončeno", tone: "success" },
  storno: { label: "Storno", tone: "danger" },
};

/** Pořadí stavů pro filtry. */
export const CALCULATION_STATUS_ORDER: CalculationStatus[] = [
  "rozepsana",
  "ceka-na-doplneni",
  "nabidka-vytvorena",
  "ceka-na-podpis",
  "dokonceno",
  "storno",
];
