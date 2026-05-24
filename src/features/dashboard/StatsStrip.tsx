import {
  CheckCircle2,
  FileClock,
  FileSignature,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Draft } from "@/types";

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  blobClass: string;
  hint?: string;
}

/** Proužek klíčových čísel nad dashboardem – rychlý přehled o práci poradce. */
export function StatsStrip({ drafts }: { drafts: Draft[] }) {
  const count = (predicate: (d: Draft) => boolean) =>
    drafts.filter(predicate).length;

  const stats: Stat[] = [
    {
      label: "Rozpracované",
      value: count((d) => d.status !== "dokonceno" && d.status !== "storno"),
      icon: <FileClock className="h-4 w-4" />,
      iconClass: "bg-brand-50 text-brand-700",
      blobClass: "bg-brand-200",
      hint: "celkem ve sjednání",
    },
    {
      label: "Nabídka vytvořena",
      value: count((d) => d.status === "nabidka-vytvorena"),
      icon: <FileText className="h-4 w-4" />,
      iconClass: "bg-accent-sky text-info",
      blobClass: "bg-info/30",
      hint: "tento týden",
    },
    {
      label: "Čeká na podpis",
      value: count((d) => d.status === "ceka-na-podpis"),
      icon: <FileSignature className="h-4 w-4" />,
      iconClass: "bg-accent-peach text-warning",
      blobClass: "bg-warning/30",
      hint: "odeslat klientovi",
    },
    {
      label: "Dokončené",
      value: count((d) => d.status === "dokonceno"),
      icon: <CheckCircle2 className="h-4 w-4" />,
      iconClass: "bg-accent-sage text-success",
      blobClass: "bg-success/30",
      hint: "tento měsíc",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
        >
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60 blur-3xl",
              stat.blobClass,
            )}
          />
          <div className="relative">
            <div className="mb-2.5 flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  stat.iconClass,
                )}
              >
                {stat.icon}
              </div>
              <span className="truncate text-xs font-medium text-muted">
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
                {stat.value}
              </span>
              {stat.hint ? (
                <span className="text-2xs text-subtle">{stat.hint}</span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
