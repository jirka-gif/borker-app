/**
 * Formátovací utility v cs-CZ – konzistentní formát měny a procent napříč UI.
 */

const czkFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("cs-CZ", {
  maximumFractionDigits: 0,
});

/** Vrátí "22 400 Kč" (cs-CZ). Pro 0 vrátí "0 Kč". */
export function formatCzk(amount: number): string {
  return czkFormatter.format(Math.round(amount));
}

/** Číslo s českým oddělovačem tisíců, bez desetinné čárky. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** "50 %" – procenta zobrazená jako celé číslo se znakem. */
export function formatPercent(value: number): string {
  return `${Math.round(value)} %`;
}
