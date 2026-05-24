import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CalculatorCard } from "@/features/calculators/CalculatorCard";
import { buildCalculatorCards } from "@/features/dashboard/dashboard-mappers";
import { getCalculators } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kalkulačky",
};

export default function CalculatorsPage() {
  const cards = buildCalculatorCards(getCalculators());
  const active = cards.filter((c) => !c.comingSoon);
  const upcoming = cards.filter((c) => c.comingSoon);

  return (
    <div>
      <PageHeader
        title="Kalkulačky"
        description="Všechny dostupné kalkulačky a sjednávací nástroje na jednom místě."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {active.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>

      {upcoming.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-subtle">
            Připravujeme
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcoming.map((calc) => (
              <CalculatorCard key={calc.slug} calc={calc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
