import type { Calculator, InsuranceType } from "@/types";

/**
 * Registr kalkulaček. Přidání nové kalkulačky = jeden záznam zde.
 * Díky tomu je grid i routing plně data-driven a snadno rozšiřitelný.
 *
 * kind:
 *  - "interni"  -> otevře interní formulář /kalkulacky/[slug]
 *  - "embedded" -> interní stránka s vloženým modulem (např. z Cursoru)
 *  - "iframe"   -> vloží externí nástroj přes iframe (href)
 *  - "externi"  -> otevře externí URL v novém okně (href)
 */
export const CALCULATORS: Calculator[] = [
  {
    slug: "auta",
    name: "Pojištění vozidel",
    description: "Povinné ručení, havarijní pojištění a doplňková připojištění.",
    iconKey: "car",
    type: "auta",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/auta",
  },
  {
    slug: "majetek",
    name: "Pojištění majetku",
    description: "Nemovitost, domácnost a související rizika.",
    iconKey: "home",
    type: "majetek",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/majetek",
  },
  {
    slug: "cestovni",
    name: "Cestovní pojištění",
    description: "Léčebné výlohy, storno a pojištění do zahraničí.",
    iconKey: "plane",
    type: "cestovni",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/cestovni",
  },
  {
    slug: "odpovednost",
    name: "Pojištění odpovědnosti",
    description: "Odpovědnost za škodu v běžném životě i v zaměstnání.",
    iconKey: "shield",
    type: "odpovednost",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/odpovednost",
  },
  {
    slug: "lexia",
    name: "Lexia",
    description: "Pojištění právní ochrany.",
    iconKey: "scale",
    type: "lexia",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/lexia",
  },
  {
    slug: "mazlicek",
    name: "Mazlíček",
    description: "Pojištění domácích mazlíčků – veterinární péče a odpovědnost.",
    iconKey: "pawprint",
    type: "mazlicek",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/mazlicek",
  },
  {
    slug: "zdravotni-cizinci",
    name: "Zdravotní pojištění cizinců",
    description: "Komplexní i nutná a neodkladná péče pro cizince.",
    iconKey: "heart-pulse",
    type: "zdravotni-cizinci",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/zdravotni-cizinci",
  },
  {
    slug: "zivotni",
    name: "Životní pojištění",
    description: "Pojištění pro případ smrti, úrazu a vážných nemocí.",
    iconKey: "heart",
    type: "zivotni",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/zivotni",
  },
  {
    slug: "zamzam",
    name: "ZamZam",
    description: "Pojištění odpovědnosti zaměstnance z výkonu povolání (ČSOB).",
    iconKey: "wallet",
    type: "zamzam",
    status: "aktivni",
    kind: "embedded",
    href: "/kalkulacky/zamzam",
  },
];

export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

/** Lidský název typu pojištění pro UI (badge, karty draftů). */
export const INSURANCE_TYPE_LABEL: Record<InsuranceType, string> = {
  auta: "Pojištění vozidel",
  majetek: "Pojištění majetku",
  cestovni: "Cestovní pojištění",
  odpovednost: "Pojištění odpovědnosti",
  zamzam: "ZamZam",
  mazlicek: "Mazlíček",
  "zdravotni-cizinci": "Zdravotní pojištění cizinců",
  zivotni: "Životní pojištění",
  lexia: "Lexia",
};
