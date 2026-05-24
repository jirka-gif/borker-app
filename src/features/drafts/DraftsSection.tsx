import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DraftsScroller, type DraftCardData } from "./DraftCard";

interface DraftsSectionProps {
  drafts: DraftCardData[];
  /** Volitelný popis pravidla řazení – zobrazí se za malou hvězdičkou. */
  sortingHint?: string;
  seeAllHref?: string;
}

/** Malá hvězda z loga – decentní separátor v hlavičkách sekcí. */
function StarDivider() {
  return (
    <svg
      aria-hidden="true"
      viewBox="168 2 96 92"
      className="h-2.5 w-2.5 text-brand-500"
    >
      <path
        d="M216 6 L226.6 37.4 L259.8 37.8 L233.1 57.6 L243 89.2 L216 70 L189 89.2 L198.9 57.6 L172.3 37.8 L205.4 37.4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DraftsSection({
  drafts,
  sortingHint = "řazeno podle provize",
  seeAllHref = "/rozpracovane",
}: DraftsSectionProps) {
  if (drafts.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
            Pokračovat ve sjednání
          </h2>
          <StarDivider />
          <span className="text-xs text-muted">{sortingHint}</span>
        </div>
        <Link
          href={seeAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 transition-colors hover:text-brand-800"
        >
          Zobrazit všechny <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <DraftsScroller drafts={drafts} />
    </section>
  );
}
