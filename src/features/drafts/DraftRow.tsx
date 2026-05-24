import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, ProgressBar, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { getCalculator, INSURANCE_TYPE_LABEL } from "@/config/calculators";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { Draft } from "@/types";

/**
 * Plná karta kalkulace pro stránku „Kalkulace" (/rozpracovane).
 * Na rozdíl od dashboardového scrolleru zobrazuje všechny stavy včetně
 * dokončených a stornovaných (přes StatusBadge).
 */
export function DraftRow({ draft }: { draft: Draft }) {
  const calculator = getCalculator(draft.type);
  const continueHref = `/kalkulacky/${draft.type}?draft=${draft.id}&step=${draft.currentStep}`;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon name={calculator?.iconKey ?? "calculator"} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {draft.clientName}
          </p>
          <p className="truncate text-xs text-muted">
            {INSURANCE_TYPE_LABEL[draft.type]}
          </p>
        </div>
        <StatusBadge status={draft.status} />
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            Krok {draft.currentStep} z {draft.totalSteps}
          </span>
          {draft.premium != null && (
            <span className="font-medium text-foreground">
              {formatCurrency(draft.premium)} / rok
            </span>
          )}
        </div>
        <ProgressBar value={draft.progress} showLabel />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted">
          Upraveno {formatRelativeDate(draft.updatedAt)}
        </span>
        <Link
          href={continueHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Pokračovat
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
