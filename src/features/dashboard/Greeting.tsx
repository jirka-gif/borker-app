"use client";

import { useAuth } from "@/lib/auth";

interface GreetingProps {
  draftCount: number;
  topClientName?: string;
}

/**
 * Hero pozdrav – burgundy badge s pulsující tečkou, velký nadpis se zvýrazněným
 * počtem rozpracovaných kalkulací a konkrétní mikrokopy o aktuální situaci.
 */
export function Greeting({ draftCount, topClientName }: GreetingProps) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const part =
    hour < 10 ? "Dobré ráno" : hour < 18 ? "Dobrý den" : "Dobrý večer";
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div>
      <div className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
        <span
          aria-hidden="true"
          className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-600"
        />
        {part}
        {firstName ? `, ${firstName}` : ""}
      </div>
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
        {draftCount > 0 ? (
          <>
            Máte{" "}
            <span className="inline-block px-0.5 align-baseline text-[34px] font-semibold leading-none tracking-tight text-brand-600 tabular-nums">
              {draftCount}
            </span>{" "}
            rozpracovaných sjednání
          </>
        ) : (
          <>Žádné rozpracované sjednání</>
        )}
      </h1>
      {topClientName ? (
        <p className="mt-2 text-sm text-muted">
          Nejdál jste u <span className="text-foreground">{topClientName}</span> — pokračujte,
          kde jste skončil, nebo začněte nové sjednání.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Pokračujte v rozpracované práci nebo začněte nové sjednání.
        </p>
      )}
    </div>
  );
}
