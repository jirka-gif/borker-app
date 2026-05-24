import { CALCULATORS, getCalculator } from "@/config/calculators";
import type { Calculator, Contract, Draft, RecentCalculator } from "@/types";
import { MOCK_CONTRACTS, MOCK_DRAFTS, MOCK_RECENT } from "./mock";

/**
 * Datové API aplikace. Dnes vrací mock data, v budoucnu zde bude fetch
 * na backend / CRM. Rozhraní (názvy funkcí + typy) zůstane stejné.
 */

const byNewest = (a: { updatedAt?: string; usedAt?: string }, b: typeof a) =>
  new Date(b.updatedAt ?? b.usedAt ?? 0).getTime() -
  new Date(a.updatedAt ?? a.usedAt ?? 0).getTime();

export function getDrafts(): Draft[] {
  return [...MOCK_DRAFTS].sort(byNewest);
}

export function getActiveDrafts(): Draft[] {
  // Na dashboardu nezobrazujeme dokončené ani stornované.
  return getDrafts().filter(
    (d) => d.status !== "dokonceno" && d.status !== "storno",
  );
}

export function getDraft(id: string): Draft | undefined {
  return MOCK_DRAFTS.find((d) => d.id === id);
}

export function getRecentCalculators(): Array<{
  calculator: Calculator;
  usedAt: string;
}> {
  return [...MOCK_RECENT]
    .sort(byNewest)
    .map((r: RecentCalculator) => {
      const calculator = getCalculator(r.slug);
      return calculator ? { calculator, usedAt: r.usedAt } : null;
    })
    .filter((x): x is { calculator: Calculator; usedAt: string } => x !== null);
}

export function getCalculators(): Calculator[] {
  return CALCULATORS;
}

/** Sjednané smlouvy – řazené od nejnověji sjednaných. */
export function getContracts(): Contract[] {
  return [...MOCK_CONTRACTS].sort(
    (a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime(),
  );
}

export { getCalculator };
