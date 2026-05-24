import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Spojí podmíněné třídy a vyřeší konflikty Tailwindu. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Iniciály pro avatar, např. "Jan Novák" -> "JN". */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Relativní český čas, např. "dnes 14:32", "včera", "před 3 dny". */
export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round(
    (startOfDay(now) - startOfDay(date)) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff === 0) return `dnes ${time}`;
  if (dayDiff === 1) return `včera ${time}`;
  if (dayDiff > 1 && dayDiff < 7) return `před ${dayDiff} dny`;

  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

/**
 * Unicode-safe Base64 kódování. Standardní btoa/atob umí jen Latin1,
 * takže by spadlo na diakritice (např. "Jiří"). Tyto funkce to řeší.
 */
export function encodeBase64(input: string): string {
  return btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    ),
  );
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(input), (c: string) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

/** Formátuje částku v Kč. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}
