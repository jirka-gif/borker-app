"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudOff,
  Loader2,
  Save,
} from "lucide-react";
import { Button, Card, Input, ProgressBar, Select } from "@/components/ui";
import type { Calculator, Draft } from "@/types";

/**
 * Pracovní plocha interní kalkulačky.
 *
 * Toto je funkční scaffold vícekrokového formuláře (wizard) s auto-save
 * indikací a continue flow. Reálné kalkulačky vytvořené v Cursoru se sem
 * napojí přes `kind: "embedded"` (vložená komponenta) nebo `kind: "iframe"`.
 * Krok wizardu odpovídá draft.currentStep, takže "Pokračovat" z dashboardu
 * uživatele vrátí přesně tam, kde skončil.
 */

const STEPS = [
  "Klient",
  "Předmět pojištění",
  "Rozsah krytí",
  "Doplňky",
  "Rekapitulace",
];

type SaveState = "idle" | "saving" | "saved";

export function CalculatorWorkspace({
  calculator,
  initialStep = 1,
  draft,
}: {
  calculator: Calculator;
  initialStep?: number;
  draft?: Draft;
}) {
  const router = useRouter();
  const [step, setStep] = useState(
    Math.min(Math.max(initialStep, 1), STEPS.length),
  );
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [form, setForm] = useState({
    clientName: draft?.clientName ?? "",
    note: "",
    coverage: "standard",
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progress = Math.round((step / STEPS.length) * 100);

  // Auto-save: po každé změně formuláře krátká prodleva -> "ukládá se" -> "uloženo".
  const markDirty = () => {
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveState("saved"), 700);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const update = (patch: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...patch }));
    markDirty();
  };

  return (
    <Card className="overflow-hidden">
      {/* Lišta postupu */}
      <div className="border-b border-border p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Krok {step} z {STEPS.length}: {STEPS[step - 1]}
          </span>
          <SaveIndicator state={saveState} />
        </div>
        <ProgressBar value={progress} />
        <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <button
                key={label}
                onClick={() => setStep(n)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  current
                    ? "bg-brand-600 text-white"
                    : done
                      ? "bg-brand-50 text-brand-700"
                      : "bg-surface-muted text-muted hover:text-foreground",
                ].join(" ")}
              >
                {done && <Check className="mr-1 inline h-3 w-3" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Obsah kroku (ukázkový mock formulář) */}
      <div className="space-y-4 p-5">
        {step === 1 && (
          <>
            <Input
              label="Jméno klienta"
              placeholder="Jan Novák"
              value={form.clientName}
              onChange={(e) => update({ clientName: e.target.value })}
            />
            <Input
              label="Poznámka"
              placeholder="Volitelná poznámka ke kalkulaci"
              value={form.note}
              onChange={(e) => update({ note: e.target.value })}
            />
          </>
        )}

        {step === 3 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Rozsah krytí
            </label>
            <Select
              options={[
                { value: "basic", label: "Základní" },
                { value: "standard", label: "Standard" },
                { value: "premium", label: "Premium" },
              ]}
              value={form.coverage}
              onChange={(e) => update({ coverage: e.target.value })}
            />
          </div>
        )}

        {step !== 1 && step !== 3 && (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              {STEPS[step - 1]}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              Sem se napojí reálná část kalkulačky „{calculator.name}“
              (interní modul nebo vložený nástroj z Cursoru).
            </p>
          </div>
        )}
      </div>

      {/* Akce */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Zpět
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={() => {
              setSaveState("saved");
              router.push("/dashboard");
            }}
          >
            Uložit a pokračovat později
          </Button>
          {step < STEPS.length ? (
            <Button
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
            >
              Další krok
            </Button>
          ) : (
            <Button rightIcon={<Check className="h-4 w-4" />}>
              Vytvořit nabídku
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Ukládám…
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-success">
        <Check className="h-3.5 w-3.5" />
        Uloženo automaticky
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <CloudOff className="h-3.5 w-3.5" />
      Neuloženo
    </span>
  );
}
