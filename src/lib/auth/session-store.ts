import { decodeBase64, encodeBase64 } from "@/lib/utils";
import type { AuthSession } from "./types";

/**
 * Perzistence session v cookie, aby:
 *  1) session přežila refresh stránky,
 *  2) middleware (běží na serveru) viděl přihlášení a chránil routy.
 *
 * V produkci by access/refresh token patřil do httpOnly cookie nastavené
 * serverem. Pro frontend-only mock zapisujeme cookie z klienta.
 */
export const SESSION_COOKIE = "star_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dní

export function persistSession(session: AuthSession): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(encodeBase64(JSON.stringify(session)));
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function readSession(): AuthSession | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return null;
  try {
    const raw = decodeURIComponent(cookie.split("=")[1]);
    return JSON.parse(decodeBase64(raw)) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
