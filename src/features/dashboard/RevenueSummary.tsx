import { TrendingUp, Wallet } from "lucide-react";
import { formatCzk } from "@/lib/format";

interface RevenueSummaryProps {
  /** Celkový potenciál provize ze všech rozpracovaných sjednání (Kč/rok). */
  potentialCommission: number;
  /** Celkové roční pojistné v rozpracovaných (Kč/rok). */
  potentialPremium: number;
  /** Provize ve sjednáních blízko dokončení (≥ 80 %). */
  almostDone: number;
  almostDoneCount: number;
  /** Provize ve sjednáních čekajících na doplnění/klienta. */
  waiting: number;
  waitingCount: number;
  /** Provize fakturovaná za aktuální měsíc. */
  invoicedThisMonth: number;
  /** Změna proti minulému měsíci v procentech (kladné = nárůst). */
  invoicedDeltaPct?: number;
}

/**
 * Sumární panel s byznys hodnotami. Hero sloupec ukazuje potenciál provize
 * v rozpracovaných (z jeho výše typicky plyne priorita dne), další sloupce
 * dělí provizi podle stavu (skoro hotovo / čeká / fakturováno tento měsíc).
 */
export function RevenueSummary({
  potentialCommission,
  potentialPremium,
  almostDone,
  almostDoneCount,
  waiting,
  waitingCount,
  invoicedThisMonth,
  invoicedDeltaPct,
}: RevenueSummaryProps) {
  return (
    <div className="relative grid grid-cols-1 gap-5 overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-6 lg:p-6">
      {/* Dekorativní blur akcent v rohu */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-brand-100/70 blur-3xl"
      />

      <div className="relative">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Wallet className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          Potenciál v rozpracovaných
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold leading-none tracking-tight text-brand-700 tabular-nums">
            {formatCzk(potentialCommission)}
          </span>
          <span className="text-xs text-muted">provize</span>
        </div>
        <p className="mt-1.5 text-xs text-subtle">
          z pojistného {formatCzk(potentialPremium)}/rok
        </p>
      </div>

      <SummaryCol
        label="Skoro hotovo"
        value={almostDone}
        valueClass="text-success"
        hint={`${almostDoneCount} ${pluralize(almostDoneCount, "sjednání", "sjednání", "sjednání")} ≥ 80 %`}
      />
      <SummaryCol
        label="Čeká na vás"
        value={waiting}
        valueClass="text-warning"
        hint={`${waitingCount} ${pluralize(waitingCount, "sjednání", "sjednání", "sjednání")} na doplnění`}
      />
      <SummaryCol
        label="Tento měsíc fakturováno"
        value={invoicedThisMonth}
        trailing={
          typeof invoicedDeltaPct === "number" && invoicedDeltaPct !== 0 ? (
            <span
              className={
                invoicedDeltaPct > 0
                  ? "inline-flex items-center gap-0.5 text-xs text-success"
                  : "inline-flex items-center gap-0.5 text-xs text-danger"
              }
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {invoicedDeltaPct > 0 ? "+" : ""}
              {invoicedDeltaPct} %
            </span>
          ) : null
        }
        hint="vs. minulý měsíc"
      />
    </div>
  );
}

function SummaryCol({
  label,
  value,
  valueClass,
  hint,
  trailing,
}: {
  label: string;
  value: number;
  valueClass?: string;
  hint?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-2 text-xs font-medium text-muted">{label}</div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl font-semibold leading-none tracking-tight tabular-nums ${valueClass ?? "text-foreground"}`}
        >
          {formatCzk(value)}
        </span>
        {trailing}
      </div>
      {hint ? <p className="mt-1.5 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string): string {
  // Standardní česká pluralizace 1 / 2-4 / 5+
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}
