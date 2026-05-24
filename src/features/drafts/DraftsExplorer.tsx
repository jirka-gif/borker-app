"use client";

import { useMemo, useState } from "react";
import { FileClock, Search } from "lucide-react";
import { Button, EmptyState, Input, Select } from "@/components/ui";
import { DraftRow } from "./DraftRow";
import { INSURANCE_TYPE_LABEL } from "@/config/calculators";
import {
  CALCULATION_STATUS_META,
  CALCULATION_STATUS_ORDER,
} from "@/config/status";
import type { Draft, InsuranceType, CalculationStatus } from "@/types";

interface DraftsExplorerProps {
  drafts: Draft[];
  /** Zobrazit panel filtrů (na dashboardu vypnuto, na /rozpracovane zapnuto). */
  showFilters?: boolean;
}

const TYPE_OPTIONS = [
  { value: "all", label: "Všechny typy" },
  ...(
    Object.keys(INSURANCE_TYPE_LABEL) as InsuranceType[]
  ).map((t) => ({ value: t, label: INSURANCE_TYPE_LABEL[t] })),
];

const STATUS_OPTIONS = [
  { value: "all", label: "Všechny stavy" },
  ...CALCULATION_STATUS_ORDER.map((s) => ({
    value: s,
    label: CALCULATION_STATUS_META[s].label,
  })),
];

export function DraftsExplorer({
  drafts,
  showFilters = false,
}: DraftsExplorerProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return drafts.filter((d) => {
      if (type !== "all" && d.type !== (type as InsuranceType)) return false;
      if (status !== "all" && d.status !== (status as CalculationStatus))
        return false;
      if (query && !d.clientName.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [drafts, query, type, status]);

  const resetFilters = () => {
    setQuery("");
    setType("all");
    setStatus("all");
  };

  return (
    <div>
      {showFilters && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:max-w-xs sm:flex-1">
            <Input
              placeholder="Hledat klienta…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex gap-3">
            <Select
              options={TYPE_OPTIONS}
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filtr podle typu pojištění"
            />
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filtr podle stavu"
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        drafts.length === 0 ? (
          <EmptyState
            icon={<FileClock className="h-6 w-6" />}
            title="Zatím nemáte žádné rozpracované kalkulace."
            description="Vyberte kalkulačku a začněte vytvářet nabídku pro klienta."
            action={
              <Button onClick={() => (window.location.href = "/kalkulacky")}>
                Vytvořit novou kalkulaci
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Nic neodpovídá filtru"
            description="Zkuste upravit vyhledávání nebo zvolené filtry."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Zrušit filtry
              </Button>
            }
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((draft) => (
            <DraftRow key={draft.id} draft={draft} />
          ))}
        </div>
      )}
    </div>
  );
}
