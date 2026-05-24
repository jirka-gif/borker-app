import type { Calculator, Draft, InsuranceType } from "@/types";
import { getCalculator, INSURANCE_TYPE_LABEL } from "@/config/calculators";
import type { DraftCardData } from "@/features/drafts/DraftCard";
import type { CalculatorCardData } from "@/features/calculators/CalculatorCard";

/**
 * Vrstva mezi doménovými typy a UI kartami dashboardu.
 *
 * Tady mockujeme provize a (pokud chybí) i pojistné. Slugy odpovídají
 * registru kalkulaček (config/calculators.ts → InsuranceType). Až přijdou
 * reálná čísla z backendu (pole `premium`, `commissionPct` na entitě Draft),
 * upraví se jen tento soubor – komponenty zůstanou beze změny.
 */

interface CalcDefaults {
  iconAccent: DraftCardData["iconAccent"];
  /** Procento provize z pojistného. */
  commissionPct: number;
  /** Rozsah ročního pojistného (Kč) pro deterministický mock. */
  premiumMin: number;
  premiumMax: number;
  /** Jednorázové pojistné (skryje " /rok"). */
  oneTime?: boolean;
  /** Kontextový popisek na kartě kalkulačky. */
  contextHint?: string;
}

const CALC_DEFAULTS: Record<InsuranceType, CalcDefaults> = {
  auta: {
    iconAccent: "brand",
    commissionPct: 20,
    premiumMin: 10_000,
    premiumMax: 30_000,
    contextHint: "Nejčastější produkt",
  },
  majetek: {
    iconAccent: "peach",
    commissionPct: 50,
    premiumMin: 5_000,
    premiumMax: 10_000,
  },
  cestovni: {
    iconAccent: "sky",
    commissionPct: 30,
    premiumMin: 3_000,
    premiumMax: 8_000,
    oneTime: true,
  },
  odpovednost: {
    iconAccent: "sage",
    commissionPct: 35,
    premiumMin: 2_500,
    premiumMax: 6_500,
  },
  zamzam: {
    iconAccent: "lilac",
    commissionPct: 40,
    premiumMin: 6_000,
    premiumMax: 12_000,
  },
  mazlicek: {
    iconAccent: "mint",
    commissionPct: 30,
    premiumMin: 4_000,
    premiumMax: 12_000,
  },
  "zdravotni-cizinci": {
    iconAccent: "sky",
    commissionPct: 25,
    premiumMin: 8_000,
    premiumMax: 18_000,
  },
  zivotni: {
    iconAccent: "lilac",
    commissionPct: 40,
    premiumMin: 6_000,
    premiumMax: 20_000,
  },
  lexia: {
    iconAccent: "sage",
    commissionPct: 30,
    premiumMin: 1_500,
    premiumMax: 4_000,
    contextHint: "Právní ochrana",
  },
};

const FALLBACK_DEFAULT: CalcDefaults = {
  iconAccent: "brand",
  commissionPct: 25,
  premiumMin: 5_000,
  premiumMax: 15_000,
};

function getDefaults(slug: string): CalcDefaults {
  return CALC_DEFAULTS[slug as InsuranceType] ?? FALLBACK_DEFAULT;
}

/** Deterministický hash z ID draftu (0..1) – pojistné je stabilní mezi rendery. */
function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(Math.sin(h)) % 1;
}

function mockPremium(draftId: string, defaults: CalcDefaults): number {
  const seed = hashSeed(draftId);
  const raw =
    defaults.premiumMin + seed * (defaults.premiumMax - defaults.premiumMin);
  return Math.round(raw / 100) * 100;
}

/** Mapování doménového statusu na pill v kartě. */
function mapStatus(status: Draft["status"]): DraftCardData["status"] {
  switch (status) {
    case "ceka-na-doplneni":
      return "doplneni";
    case "nabidka-vytvorena":
      return "nabidka";
    case "ceka-na-podpis":
      return "podpis";
    default:
      return "rozepsana";
  }
}

/**
 * Vyrobí karty draftů seřazené podle potenciální provize (sestupně).
 * "Hot" karta je první v seznamu.
 */
export function buildDraftCards(drafts: Draft[]): DraftCardData[] {
  const cards: DraftCardData[] = drafts.map((d) => {
    const defaults = getDefaults(d.type);
    const hasReal = typeof d.premium === "number";
    const premium = hasReal ? (d.premium as number) : mockPremium(d.id, defaults);

    return {
      id: d.id,
      slug: d.type,
      step: d.currentStep,
      draftId: d.id,
      clientName: d.clientName,
      calculatorLabel: INSURANCE_TYPE_LABEL[d.type],
      iconKey: getCalculator(d.type)?.iconKey ?? "calculator",
      iconAccent: defaults.iconAccent,
      totalSteps: d.totalSteps,
      currentStep: d.currentStep,
      status: mapStatus(d.status),
      premium,
      premiumEstimated: !hasReal,
      premiumOneTime: defaults.oneTime,
      commissionPct: defaults.commissionPct,
    };
  });

  cards.sort((a, b) => {
    const commA = (a.premium * a.commissionPct) / 100;
    const commB = (b.premium * b.commissionPct) / 100;
    return commB - commA;
  });

  if (cards.length > 0) {
    cards[0].hot = true;
  }

  return cards;
}

/** Agregát pro revenue panel z draftových karet. */
export function computeRevenueSummary(drafts: Draft[]) {
  const cards = buildDraftCards(drafts);

  const sumCommission = (subset: DraftCardData[]) =>
    subset.reduce((acc, c) => acc + (c.premium * c.commissionPct) / 100, 0);

  const annualizedPremium = cards.reduce((acc, c) => acc + c.premium, 0);
  const almostDoneCards = cards.filter(
    (c) => c.currentStep / c.totalSteps >= 0.8,
  );
  const waitingCards = cards.filter((c) => c.status === "doplneni");

  // Mock fakturace tohoto měsíce – v reálu z dokončených smluv.
  const invoicedThisMonth = 12_400;
  const invoicedDeltaPct = 18;

  return {
    potentialCommission: sumCommission(cards),
    potentialPremium: annualizedPremium,
    almostDone: sumCommission(almostDoneCards),
    almostDoneCount: almostDoneCards.length,
    waiting: sumCommission(waitingCards),
    waitingCount: waitingCards.length,
    invoicedThisMonth,
    invoicedDeltaPct,
  };
}

/** Akcent + kontextový hint pro katalog kalkulaček. */
export function buildCalculatorCards(
  calculators: Calculator[],
): CalculatorCardData[] {
  return calculators.map((c) => {
    const defaults = getDefaults(c.slug);
    return {
      slug: c.slug,
      title: c.name,
      description: c.description,
      iconKey: c.iconKey,
      iconAccent: defaults.iconAccent,
      comingSoon: c.status !== "aktivni",
      contextHint: defaults.contextHint,
    };
  });
}
