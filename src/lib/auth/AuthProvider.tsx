"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@/types";
import * as authService from "./service";
import {
  clearSession,
  persistSession,
  readSession,
} from "./session-store";
import type { LoginCredentials } from "./types";

interface AuthContextValue {
  user: User | null;
  /** Probíhá počáteční obnova session z cookie. */
  initializing: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Obnova session po načtení / refreshi stránky.
  useEffect(() => {
    const session = readSession();
    if (session) setUser(session.user);
    setInitializing(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (!result.ok) return { ok: false, error: result.error };
    persistSession(result.session);
    setUser(result.session.user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, initializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth musí být uvnitř <AuthProvider>.");
  return ctx;
}
