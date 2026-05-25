/**
 * Serverový klient pro Frenk API (apicore). Řeší JWT autentizaci
 * (login + automatický refresh / re-login při 401) a tenký fetch wrapper.
 *
 * POZOR: smí běžet POUZE na serveru (route handlery / server actions),
 * nikdy ne v prohlížeči – přihlašovací údaje jsou tajné.
 */

import type { FrenkLoginResponse } from './types';

const BASE_URL = process.env.FRENK_API_BASE_URL ?? 'https://api.frenkee.cz';
const EMAIL = process.env.FRENK_API_EMAIL ?? '';
const PASSWORD = process.env.FRENK_API_PASSWORD ?? '';

export class FrenkError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'FrenkError';
  }
}

// Access token cachujeme v paměti instance serveru (best-effort; po cold startu se znovu přihlásí).
let cachedToken: string | null = null;

async function login(): Promise<string> {
  if (!EMAIL || !PASSWORD) {
    throw new FrenkError(
      'Chybí přihlašovací údaje k Frenk API (FRENK_API_EMAIL / FRENK_API_PASSWORD).',
      500,
    );
  }
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new FrenkError('Přihlášení k Frenk API selhalo.', res.status, await safeJson(res));
  }
  const data = (await res.json()) as FrenkLoginResponse;
  cachedToken = data.access_token;
  return cachedToken;
}

async function getToken(forceRefresh = false): Promise<string> {
  if (forceRefresh || !cachedToken) return login();
  return cachedToken;
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

/**
 * Autentizovaný POST na Frenk API. Při 401 jednou obnoví token a zopakuje.
 */
export async function frenkPost<T>(path: string, payload: unknown): Promise<T> {
  const doRequest = async (token: string) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

  let token = await getToken();
  let res = await doRequest(token);

  if (res.status === 401) {
    token = await getToken(true); // re-login a zkus znovu
    res = await doRequest(token);
  }

  if (!res.ok) {
    throw new FrenkError(
      `Frenk API ${path} vrátilo ${res.status}.`,
      res.status,
      await safeJson(res),
    );
  }
  return (await res.json()) as T;
}
