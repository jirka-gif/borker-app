import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

export interface CalculatorCardData {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  iconAccent: "brand" | "peach" | "sky" | "sage" | "lilac" | "mint";
  /** Pokud true, karta je vizuálně utlumená a místo akce ukazuje datum. */
  comingSoon?: boolean;
  comingSoonLabel?: string;
  /** Kontextový popisek pod kartou ("3 použití dnes", "novinka", apod.). */
  contextHint?: string;
}

const ACCENT_CLASSES: Record<CalculatorCardData["iconAccent"], string> = {
  brand: "bg-brand-50 text-brand-700",
  peach: "bg-accent-peach text-warning",
  sky: "bg-accent-sky text-info",
  sage: "bg-accent-sage text-success",
  lilac: "bg-accent-lilac text-foreground",
  mint: "bg-accent-mint text-success",
};

export function CalculatorCard({ calc }: { calc: CalculatorCardData }) {
  const inner = (
    <>
      {/* Reveal kruh v pravém dolním rohu na hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-30 w-30 scale-90 rounded-full bg-brand-50 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-70"
        style={{ width: "120px", height: "120px" }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105",
            ACCENT_CLASSES[calc.iconAccent],
          )}
        >
          <Icon name={calc.iconKey} className="h-[22px] w-[22px]" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium",
            calc.comingSoon
              ? "bg-surface-muted text-muted"
              : "bg-success-bg text-success",
          )}
        >
          {!calc.comingSoon && (
            <span
              aria-hidden="true"
              className="inline-block h-1 w-1 rounded-full bg-success"
            />
          )}
          {calc.comingSoon ? "Připravujeme" : "Aktivní"}
        </span>
      </div>

      <div className="relative">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
          {calc.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {calc.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between pt-1.5">
        {calc.contextHint ? (
          <span className="text-2xs text-subtle">{calc.contextHint}</span>
        ) : (
          <span />
        )}
        {calc.comingSoon ? (
          <span className="text-2xs text-subtle">
            {calc.comingSoonLabel ?? "Brzy"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700">
            Otevřít <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all",
    !calc.comingSoon &&
      "hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-brand",
    calc.comingSoon && "cursor-not-allowed opacity-70",
  );

  if (calc.comingSoon) {
    return (
      <div className={baseClasses} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/kalkulacky/${calc.slug}`} className={baseClasses}>
      {inner}
    </Link>
  );
}
