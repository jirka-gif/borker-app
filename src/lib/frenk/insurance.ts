/**
 * Doménové funkce nad Frenk API. Každá linka má svůj calculate/contract.
 * Zatím implementováno „car"; další linky se přidají stejným vzorem.
 */

import { frenkPost } from './client';
import type { CarCalculateInput, CarCalculateResponse } from './types';

/** Výpočet nabídek pojištění vozidla (idempotentní – jen quote). */
export function calculateCar(input: CarCalculateInput): Promise<CarCalculateResponse> {
  return frenkPost<CarCalculateResponse>('/api/insurance/car/calculate', input);
}
