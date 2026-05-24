import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { getCalculator, INSURANCE_TYPE_LABEL } from "@/config/calculators";
import { getContracts } from "@/lib/data";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { ContractStatus } from "@/types";

export const metadata: Metadata = {
  title: "Smlouvy",
};

const STATUS_META: Record<
  ContractStatus,
  { label: string; tone: "success" | "warning" | "neutral" }
> = {
  aktivni: { label: "Aktivní", tone: "success" },
  "ceka-na-platbu": { label: "Čeká na platbu", tone: "warning" },
  ukoncena: { label: "Ukončená", tone: "neutral" },
};

export default function ContractsPage() {
  const contracts = getContracts();

  const activeCount = contracts.filter((c) => c.status === "aktivni").length;
  const waitingCount = contracts.filter(
    (c) => c.status === "ceka-na-platbu",
  ).length;
  const annualPremium = contracts
    .filter((c) => c.status === "aktivni")
    .reduce((sum, c) => sum + c.premium, 0);

  const summary = [
    { label: "Aktivní smlouvy", value: String(activeCount), hint: "celkem" },
    {
      label: "Roční pojistné",
      value: formatCurrency(annualPremium),
      hint: "z aktivních smluv",
    },
    {
      label: "Čeká na platbu",
      value: String(waitingCount),
      hint: "k vyřízení",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Smlouvy"
        description="Sjednané smlouvy. Po dokončení kalkulace se data odesílají přes API do navazujících systémů a CRM."
      />

      {/* Souhrn */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface p-4 shadow-card"
          >
            <p className="text-xs font-medium text-muted">{s.label}</p>
            <p className="mt-1.5 text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
              {s.value}
            </p>
            <p className="mt-1 text-2xs text-subtle">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Tabulka smluv */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-xs text-muted">
                <th className="px-5 py-3 font-medium">Číslo smlouvy</th>
                <th className="px-5 py-3 font-medium">Klient</th>
                <th className="px-5 py-3 font-medium">Produkt</th>
                <th className="px-5 py-3 font-medium">Pojišťovna</th>
                <th className="px-5 py-3 text-right font-medium">Pojistné</th>
                <th className="px-5 py-3 font-medium">Stav</th>
                <th className="px-5 py-3 font-medium">Sjednáno</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => {
                const calculator = getCalculator(c.type);
                const status = STATUS_META[c.status];
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-surface-muted/50"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted">
                      {c.number}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-foreground">
                      {c.clientName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2 text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Icon
                            name={calculator?.iconKey ?? "calculator"}
                            className="h-4 w-4"
                          />
                        </span>
                        {INSURANCE_TYPE_LABEL[c.type]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                      {c.insurer}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium tabular-nums text-foreground">
                      {formatCurrency(c.premium)}
                      <span className="text-2xs font-normal text-subtle"> /rok</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={status.tone} dot>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                      {formatRelativeDate(c.signedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
