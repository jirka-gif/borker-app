import Link from "next/link";
import { Signature } from "lucide-react";
import { Icon } from "@/components/Icon";
import { formatCzk } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DraftCardData {
  id: string;
  slug: string;
  step: number;
  draftId?: string;
  clientName: string;
  calculatorLabel: string;
  iconKey: string;
  /** Akcentní pozadí za ikonou. */
  iconAccent: "brand" | "peach" | "sky" | "sage" | "lilac" | "mint";
  totalSteps: number;
  /** Aktuálně rozdělaný krok (0-indexed, např. 3 = pracujeme na 4. kroku). */
  currentStep: number;
  status: "rozepsana" | "doplneni" | "nabidka" | "podpis";
  /** Roční pojistné v Kč. Pro jednorázové pojištění uveď `premiumOneTime: true`. */
  premium: number;
  /** Je pojistné odhad (klient teprve začal)? */
  premiumEstimated?: boolean;
  /** Jednorázové pojistné (např. cestovní) – skryje "/rok". */
  premiumOneTime?: boolean;
  /** Procento provize z pojistného (0-100). */
  commissionPct: number;
  /** "Hot" karta – nejnaléhavější / nejvíc provize. Zvýrazní pozadí. */
  hot?: boolean;
}

const ACCENT_CLASSES: Record<DraftCardData["iconAccent"], string> = {
  brand: "bg-brand-50 text-brand-700",
  peach: "bg-accent-peach text-warning",
  sky: "bg-accent-sky text-info",
  sage: "bg-accent-sage text-success",
  lilac: "bg-accent-lilac text-foreground",
  mint: "bg-accent-mint text-success",
};

const STATUS_PILL: Record<
  DraftCardData["status"],
  { label: string; className: string; icon?: React.ReactNode }
> = {
  rozepsana: {
    label: "Rozepsaná",
    className: "bg-surface-muted text-muted",
  },
  doplneni: {
    label: "Doplnění",
    className: "bg-warning-bg text-warning",
  },
  nabidka: {
    label: "Nabídka",
    className: "bg-info-bg text-info",
  },
  podpis: {
    label: "Podpis",
    className: "bg-success-bg text-success",
    icon: <Signature className="h-3 w-3" aria-hidden="true" />,
  },
};

function statusLabel(d: DraftCardData): string {
  const pct = (d.currentStep / d.totalSteps) * 100;
  if (pct >= 100) return "Připraveno k podpisu";
  if (pct >= 80) return "Skoro hotovo";
  if (pct >= 50) return "V průběhu";
  if (pct > 0) return "Čeká na vás";
  return "Začátek";
}

function statusLabelClass(d: DraftCardData): string {
  return d.status === "podpis" ? "text-success" : "text-foreground";
}

export function DraftCard({ draft }: { draft: DraftCardData }) {
  const commission = (draft.premium * draft.commissionPct) / 100;
  const pill = STATUS_PILL[draft.status];
  const href = `/kalkulacky/${draft.slug}${draft.draftId ? `?draft=${draft.draftId}` : ""}${
    draft.step ? `&step=${draft.step}` : ""
  }`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-w-[280px] shrink-0 snap-start flex-col gap-3.5 overflow-hidden rounded-2xl border bg-surface p-4 transition-all",
        "hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-brand",
        draft.hot ? "border-brand-200" : "border-border",
      )}
    >
      {/* Horní lišta na hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand-600 transition-transform group-hover:scale-x-100"
      />

      {/* Jemný brand gradient v "hot" stavu */}
      {draft.hot && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-brand-50 to-transparent"
        />
      )}

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              draft.hot
                ? "border border-brand-200 bg-brand-50 text-brand-700"
                : ACCENT_CLASSES[draft.iconAccent],
            )}
          >
            <Icon name={draft.iconKey} className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">
              {draft.clientName}
            </p>
            <p className="truncate text-xs text-subtle">{draft.calculatorLabel}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-2xs font-medium",
            pill.className,
          )}
        >
          {pill.icon}
          {pill.label}
        </span>
      </div>

      {/* Money block */}
      <div className="relative flex items-stretch rounded-xl border border-border bg-surface-muted px-3 py-2.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-subtle">
            {draft.premiumEstimated ? "Odhad" : "Pojistné"}
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-sm font-medium tabular-nums",
              draft.premiumEstimated ? "text-muted" : "text-foreground",
            )}
          >
            {draft.premiumEstimated ? "~ " : ""}
            {formatCzk(draft.premium)}
            {draft.premiumOneTime ? null : (
              <span className="ml-0.5 text-2xs font-normal text-subtle"> /rok</span>
            )}
          </span>
        </div>
        <div className="ml-3 flex flex-1 flex-col gap-0.5 border-l border-border pl-3">
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-subtle">
            Provize {draft.commissionPct} %
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-sm font-medium tabular-nums",
              draft.premiumEstimated ? "text-muted" : "text-brand-700",
            )}
          >
            {draft.premiumEstimated ? "~ " : ""}
            {formatCzk(commission)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="relative">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "truncate text-xs font-medium",
              statusLabelClass(draft),
            )}
          >
            {statusLabel(draft)}
          </span>
          <span className="shrink-0 text-2xs text-muted">
            krok {draft.currentStep} z {draft.totalSteps}
          </span>
        </div>
        <div className="flex gap-[3px]">
          {Array.from({ length: draft.totalSteps }).map((_, i) => {
            const isDone = i < draft.currentStep;
            const isNow = i === draft.currentStep;
            return (
              <div
                key={i}
                className={cn(
                  "relative h-1 flex-1 overflow-hidden rounded-sm",
                  isDone ? "bg-brand-600" : "bg-border",
                  isNow && "step-shimmer",
                )}
              />
            );
          })}
        </div>
      </div>
    </Link>
  );
}

export function DraftsScroller({ drafts }: { drafts: DraftCardData[] }) {
  return (
    <div className="scrollbar-thin flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-1">
      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} />
      ))}
    </div>
  );
}
