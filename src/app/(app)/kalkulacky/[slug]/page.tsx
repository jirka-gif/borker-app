import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui";
import { CalculatorWorkspace } from "@/features/calculators/CalculatorWorkspace";
import {
  CalculatorExternal,
  CalculatorIframe,
} from "@/features/calculators/CalculatorEmbed";
import { getEmbeddedModule } from "@/features/calculators/modules/registry";
import { getCalculator, getDraft } from "@/lib/data";

interface PageProps {
  params: { slug: string };
  searchParams: { draft?: string; step?: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const calculator = getCalculator(params.slug);
  return { title: calculator?.name ?? "Kalkulačka" };
}

export default function CalculatorDetailPage({
  params,
  searchParams,
}: PageProps) {
  const calculator = getCalculator(params.slug);
  if (!calculator) notFound();

  const draft = searchParams.draft ? getDraft(searchParams.draft) : undefined;
  const initialStep = searchParams.step
    ? Number.parseInt(searchParams.step, 10)
    : draft?.currentStep ?? 1;

  // Vložené (embedded) kalkulačky – např. integrovaná kalkulačka vozidel.
  const EmbeddedModule =
    calculator.status !== "pripravujeme" && calculator.kind === "embedded"
      ? getEmbeddedModule(calculator.slug)
      : undefined;

  return (
    <div>
      <PageHeader
        title={calculator.name}
        description={calculator.description}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Kalkulačky", href: "/kalkulacky" },
          { label: calculator.name },
        ]}
        actions={
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět na dashboard
          </Link>
        }
      />

      {draft && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <Badge tone="brand">Pokračování</Badge>
          Navazujete na kalkulaci klienta <strong>{draft.clientName}</strong>.
        </div>
      )}

      {calculator.status === "pripravujeme" ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Tuto kalkulačku připravujeme
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Modul „{calculator.name}“ bude brzy k dispozici.
          </p>
        </div>
      ) : EmbeddedModule ? (
        <EmbeddedModule />
      ) : calculator.kind === "iframe" ? (
        <CalculatorIframe calculator={calculator} />
      ) : calculator.kind === "externi" ? (
        <CalculatorExternal calculator={calculator} />
      ) : (
        <CalculatorWorkspace
          calculator={calculator}
          initialStep={initialStep}
          draft={draft}
        />
      )}
    </div>
  );
}
