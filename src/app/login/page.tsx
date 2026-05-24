import { Suspense } from "react";
import type { Metadata } from "next";
import { Check, ShieldCheck } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Přihlášení",
};

const FEATURES = [
  "Všechny pojistné kalkulačky na jednom místě",
  "Okamžité pokračování v rozdělané práci",
  "Přehledné rozpracované nabídky a stavy",
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Levý brand panel (desktop) */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-800 p-12 text-white lg:flex">
        {/* Hloubka pozadí */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 15% 10%, rgba(255,255,255,0.16), transparent 50%), radial-gradient(100% 90% at 90% 100%, rgba(0,0,0,0.35), transparent 55%)",
          }}
        />
        {/* Velký hvězdný vodoznak */}
        <svg
          viewBox="168 2 96 92"
          className="pointer-events-none absolute -bottom-20 -right-16 h-[28rem] w-[28rem] text-white opacity-[0.07]"
          aria-hidden="true"
        >
          <path
            d="M216 6 L226.6 37.4 L259.8 37.8 L233.1 57.6 L243 89.2 L216 70 L189 89.2 L198.9 57.6 L172.3 37.8 L205.4 37.4 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative">
          <Logo size="lg" tone="light" />
        </div>

        <div className="relative max-w-md">
          <h1 className="text-[2rem] font-semibold leading-tight tracking-tight">
            Moderní pracovní prostředí pro poradce.
          </h1>
          <p className="mt-4 text-white/70">
            Sjednávejte rychleji, mějte přehled o klientech a pokračujte přesně
            tam, kde jste skončili.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/45">
          © {new Date().getFullYear()} Star Insurance Group · Interní nástroj
        </p>
      </aside>

      {/* Pravý panel s formulářem */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-7 shadow-card">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5" />
            Zabezpečené přihlášení do interního systému
          </p>
        </div>
      </div>
    </main>
  );
}
