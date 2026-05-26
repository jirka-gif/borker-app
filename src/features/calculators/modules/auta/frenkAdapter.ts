/**
 * Adapter: odpověď Frenk API (car calculate) → OfferCardData pro UI.
 * Díky tomu zůstávají komponenty OfferCard, slevy i PDF beze změny – mění se
 * jen zdroj dat (mock → živé API).
 */

import type { OfferCardData, OfferCoverage } from '../../shared/OfferCard';
import { isFrenkError, type CarCalculateResponse, type FrenkErrorDetail } from '@/lib/frenk/types';

export interface CarrierError {
  insurer: string;
  code: number;
  message: string;
  /** Konkrétní hlášky z errors[] (validace polí, …). */
  details: FrenkErrorDetail[];
}

export interface MappedOffers {
  offers: OfferCardData[];
  errors: CarrierError[];
}

interface CarrierMeta {
  name: string;
  logo: string;
}

/** Mapování apiEnum → zobrazované jméno + iniciály do loga. */
const CARRIERS: Record<string, CarrierMeta> = {
  'insurance-car-direct': { name: 'Direct', logo: 'DIR' },
  'insurance-car-slavia': { name: 'Slavia', logo: 'SLA' },
  'insurance-car-pillow': { name: 'Pillow', logo: 'PIL' },
  'insurance-car-csob': { name: 'ČSOB', logo: 'ČSOB' },
  'insurance-car-uniqa': { name: 'Uniqa', logo: 'UNI' },
  'insurance-car-pvzp': { name: 'PVZP', logo: 'PVZP' },
  'insurance-car-generali': { name: 'Generali', logo: 'GEN' },
  'insurance-car-kooperativa': { name: 'Kooperativa', logo: 'KOOP' },
  'insurance-car-cpp': { name: 'ČPP', logo: 'ČPP' },
  'insurance-car-allianz': { name: 'Allianz', logo: 'ALZ' },
};

function czk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Převede `insurances` na karty nabídek + seznam pojišťoven, které vrátily chybu. */
export function mapCarResponseToOffers(res: CarCalculateResponse): MappedOffers {
  const entries = Object.entries(res.insurances ?? {});
  const offers: OfferCardData[] = [];
  const errors: CarrierError[] = [];

  for (const [apiEnum, entry] of entries) {
    const meta = CARRIERS[apiEnum] ?? { name: apiEnum, logo: '?' };

    if (isFrenkError(entry)) {
      const rawDetails = Array.isArray(entry.errors) ? entry.errors : [];
      const details: FrenkErrorDetail[] = rawDetails
        .filter((d): d is FrenkErrorDetail => typeof d === 'object' && d !== null);
      errors.push({
        insurer: meta.name,
        code: entry.error,
        message: entry.message || `Chyba ${entry.error}`,
        details,
      });
      continue;
    }

    const coverages: OfferCoverage[] = (entry.packages ?? []).map((p) => ({
      key: p.code,
      label: p.name,
      value: Number.isFinite(Number(p.price)) ? czk(Number(p.price)) : '—',
      included: true,
    }));

    const raw = entry.priceAfterSale ?? entry.price;
    const price = Number(raw);

    offers.push({
      id: apiEnum,
      insurer: meta.name,
      logoText: meta.logo,
      productName: 'Pojištění vozidla',
      coverages,
      addons: [],
      totalPrice: Number.isFinite(price) ? price : 0,
    });
  }

  offers.sort((a, b) => a.totalPrice - b.totalPrice);
  return { offers, errors };
}
