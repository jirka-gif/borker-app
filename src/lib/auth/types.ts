import type { User } from "@/types";

/**
 * Tvar auth session. Struktura je připravená na reálný JWT + refresh token,
 * dnes je access token jen mock řetězec. Až přijde backend, mění se pouze
 * implementace v auth/service.ts, nikoli rozhraní.
 */
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  /** Unix ms expirace access tokenu. */
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };
