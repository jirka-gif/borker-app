"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login({ email, password });

    if (result.ok) {
      const from = searchParams.get("from");
      router.replace(from && from.startsWith("/") ? from : "/dashboard");
      router.refresh();
    } else {
      setError(result.error ?? "Přihlášení se nezdařilo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Přihlášení</h2>
      <p className="mt-1.5 text-sm text-muted">
        Zadejte své přihlašovací údaje pro vstup do aplikace.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-3 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="vas.email@star.cz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
          disabled={loading}
        />

        <Input
          label="Heslo"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-md p-1.5 text-subtle transition-colors hover:text-foreground"
              aria-label={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          required
          disabled={loading}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            onClick={() =>
              alert(
                "Pro obnovení hesla kontaktujte správce systému.\n(Funkce bude napojena na backend.)",
              )
            }
          >
            Zapomněli jste heslo?
          </button>
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? "Přihlašuji…" : "Přihlásit se"}
        </Button>
      </form>

      {/* Demo nápověda pro 1. fázi bez backendu */}
      <div className="mt-6 rounded-lg border border-border bg-surface-muted px-4 py-3 text-xs text-muted">
        <p className="font-medium text-foreground">Demo přístup</p>
        <p className="mt-0.5">
          Email: <span className="font-mono">demo@star.cz</span> · Heslo:{" "}
          <span className="font-mono">demo1234</span>
        </p>
      </div>
    </div>
  );
}
