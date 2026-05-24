import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DraftsExplorer } from "@/features/drafts/DraftsExplorer";
import { getDrafts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rozpracované kalkulace",
};

export default function DraftsPage() {
  // Zde zobrazujeme všechny kalkulace včetně dokončených a stornovaných.
  const drafts = getDrafts();

  return (
    <div>
      <PageHeader
        title="Rozpracované kalkulace"
        description="Filtrujte podle typu pojištění, stavu nebo vyhledejte klienta. Řazeno podle poslední aktivity."
      />
      <DraftsExplorer drafts={drafts} showFilters />
    </div>
  );
}
