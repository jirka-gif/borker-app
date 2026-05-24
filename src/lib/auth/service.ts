import { encodeBase64 } from "@/lib/utils";
import type { User } from "@/types";
import type { AuthSession, LoginCredentials, LoginResult } from "./types";

/**
 * Mock auth služba (frontend-only).
 *
 * ⚠️ Toto je dočasná implementace pro 1. fázi bez backendu.
 * Až bude k dispozici API, nahraď tělo `login` / `refresh` voláním
 * skutečného endpointu (POST /auth/login, POST /auth/refresh). Rozhraní
 * (parametry + návratové typy) zůstane stejné, takže zbytek aplikace
 * se nemění.
 */

/** Demo účet pro 1. fázi. */
const DEMO_USERS: Array<{ password: string; user: User }> = [
  {
    password: "demo1234",
    user: {
      id: "usr_1",
      name: "Jiří Hluchý",
      email: "demo@star.cz",
      role: "admin",
      advisor: {
        ico: "12345678",
        address: "Václavské náměstí 1, 110 00 Praha",
        phone: "+420 777 055 525",
        intermediaryType: "vazany-zastupce",
      },
    },
  },
];

const ACCESS_TOKEN_TTL = 1000 * 60 * 30; // 30 minut

function fakeToken(prefix: string, email: string): string {
  // Napodobuje strukturu JWT (3 části), bez reálného podpisu.
  const payload = encodeBase64(
    JSON.stringify({ sub: email, iat: Date.now(), kind: prefix }),
  );
  return `${prefix}.${payload}.mock-signature`;
}

function buildSession(user: User): AuthSession {
  return {
    user,
    accessToken: fakeToken("access", user.email),
    refreshToken: fakeToken("refresh", user.email),
    expiresAt: Date.now() + ACCESS_TOKEN_TTL,
  };
}

/** Simuluje síťovou latenci, ať loading state není jen probliknutí. */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  await delay(650);
  const email = credentials.email.trim().toLowerCase();
  const match = DEMO_USERS.find((u) => u.user.email === email);

  if (!match || match.password !== credentials.password) {
    return { ok: false, error: "Zadaný email nebo heslo není správné." };
  }
  return { ok: true, session: buildSession(match.user) };
}

/** Připraveno na obnovu access tokenu pomocí refresh tokenu. */
export async function refresh(session: AuthSession): Promise<AuthSession> {
  await delay(200);
  return { ...session, ...buildSession(session.user) };
}
