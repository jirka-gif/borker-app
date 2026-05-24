import type { ComponentType } from "react";
import { VehicleCalculator } from "./auta/VehicleCalculator";
import { PropertyCalculator } from "./majetek/PropertyCalculator";
import { TravelCalculator } from "./cestovni/TravelCalculator";
import { LiabilityCalculator } from "./odpovednost/LiabilityCalculator";
import { MazlicekCalculator } from "./mazlicek/MazlicekCalculator";
import { ForeignerCalculator } from "./cizinci/ForeignerCalculator";
import { ZamZamCalculator } from "./zamzam/ZamZamCalculator";
import { LexiaCalculator } from "./lexia/LexiaCalculator";
import { ZivotCalculator } from "./zivot/ZivotCalculator";

/**
 * Registr vložených (embedded) kalkulaček. Klíč = slug kalkulačky z
 * config/calculators.ts. Přidání další vložené kalkulačky = jeden záznam zde
 * + nastavení `kind: "embedded"` v registru kalkulaček.
 */
export const EMBEDDED_MODULES: Record<string, ComponentType> = {
  auta: VehicleCalculator,
  majetek: PropertyCalculator,
  cestovni: TravelCalculator,
  odpovednost: LiabilityCalculator,
  mazlicek: MazlicekCalculator,
  "zdravotni-cizinci": ForeignerCalculator,
  zamzam: ZamZamCalculator,
  lexia: LexiaCalculator,
  zivotni: ZivotCalculator,
};

export function getEmbeddedModule(slug: string): ComponentType | undefined {
  return EMBEDDED_MODULES[slug];
}
