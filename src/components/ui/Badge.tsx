import { cn } from "@/lib/utils";
import { CALCULATION_STATUS_META, type StatusTone } from "@/config/status";
import type { CalculationStatus } from "@/types";

const tones: Record<StatusTone, string> = {
  neutral: "bg-surface-muted text-muted border-border",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
};

interface BadgeProps {
  tone?: StatusTone;
  className?: string;
  children: React.ReactNode;
  /** Zobrazí tečku před textem (vhodné pro stavy). */
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}

/** Badge pro stav kalkulace – odvozuje label i barvu z konfigurace. */
export function StatusBadge({
  status,
  className,
}: {
  status: CalculationStatus;
  className?: string;
}) {
  const meta = CALCULATION_STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  );
}
