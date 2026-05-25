/**
 * Adapter: odpověď Frenk API (car calculate) → OfferCardData pro UI.
 * Díky tomu zůstávají komponenty OfferCard, slevy i PDF beze změny – mění se
 * jen zdroj dat (mock → živé API).
 */

import type { OfferCardData, OfferCoverage } from '../../shared/OfferCard';
import type { CarCalculateResponse } from '@/lib/frenk/types';

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

/** Převede `insurances` z odpovědi na pole karet nabídek (seřazeno od nejlevnější). */
export function mapCarResponseToOffers(res: CarCalculateResponse): OfferCardData[] {
  const entries = Object.entries(res.insurances ?? {});

  const offers: OfferCardData[] = entries.map(([apiEnum, result]) => {
    const meta = CARRIERS[apiEnum] ?? { name: apiEnum, logo: '?' };
    const coverages: OfferCoverage[] = (result.packages ?? []).map((p) => ({
      key: p.code,
      label: p.name,
      value: Number.isFinite(Number(p.price)) ? czk(Number(p.price)) : '—',
      included: true,
    }));

    // Robustně: priceAfterSale nebo price, ošetřeno proti NaN.
    const raw = result.priceAfterSale ?? result.price;
    const price = Number(raw);
    const totalPrice = Number.isFinite(price) ? price : 0;

    return {
      id: apiEnum,
      insurer: meta.name,
      logoText: meta.logo,
      productName: 'Pojištění vozidla',
      coverages,
      addons: [],
      totalPrice,
    };
  });

  return offers.sort((a, b) => a.totalPrice - b.totalPrice);
}
