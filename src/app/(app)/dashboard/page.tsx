import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Greeting } from "@/features/dashboard/Greeting";
import { RevenueSummary } from "@/features/dashboard/RevenueSummary";
import { StatsStrip } from "@/features/dashboard/StatsStrip";
import { DraftsSection } from "@/features/drafts/DraftsSection";
import { CalculatorCard } from "@/features/calculators/CalculatorCard";
import {
  getActiveDrafts,
  getCalculators,
  getDrafts,
} from "@/lib/data";
import {
  buildDraftCards,
  computeRevenueSummary,
  buildCalculatorCards,
} from "@/features/dashboard/dashboard-mappers";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const allDrafts = getDrafts();
  const activeDrafts = getActiveDrafts();
  const calculators = getCalculators();

  const draftCards = buildDraftCards(activeDrafts);
  const revenue = computeRevenueSummary(activeDrafts);
  const calculatorCards = buildCalculatorCards(calculators);

  const topClient = draftCards[0]?.clientName;

  return (
    <div className="space-y-7">
      {/* Hero – pozdrav + primární CTA */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <Greeting draftCount={draftCards.length} topClientName={topClient} />
        <Link
          href="/kalkulacky"
          className="btn-primary-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-btn-primary transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="h-4 w-4" />
          Nová kalkulace
        </Link>
      </div>

      {/* Byznys hodnota dne */}
      <RevenueSummary {...revenue} />

      {/* Rozpracované sjednání – horizontální karty */}
      <DraftsSection drafts={draftCards} />

      {/* Klíčová čísla */}
      <StatsStrip drafts={allDrafts} />

      {/* Katalog kalkulaček */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              Kalkulačky
            </h2>
            <span className="text-xs text-muted">
              {calculators.length} produktů
            </span>
          </div>
          <Link
            href="/kalkulacky"
            className="text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            Zobrazit všechny
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {calculatorCards.map((calc) => (
            <CalculatorCard key={calc.slug} calc={calc} />
          ))}
        </div>
      </section>
    </div>
  );
}
