import type { ProductType } from './types';

/** Záznam produkce (sjednané roční pojistné) za období. */
export interface ProductionEntry {
  /** Období sjednání, formát YYYY-MM. */
  period: string;
  companyId: string;
  insurerId: string;
  productType: ProductType;
  /** Objem (sjednané roční pojistné v Kč). */
  volume: number;
}

export const PRODUCTION_PERIODS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];

const MONTH_LABELS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];

export function periodLabel(period: string): string {
  const [y, m] = period.split('-');
  return `${MONTH_LABELS[Number(m) - 1]} ${y}`;
}

const COMPANIES = ['co_frenkee', 'co_insia', 'co_demo'];
const INSURERS = ['ins_koop', 'ins_allianz', 'ins_csob', 'ins_generali', 'ins_uniqa', 'ins_slavia', 'ins_cpp'];
const PRODUCT_TYPES: ProductType[] = ['auta', 'majetek', 'cestovni', 'odpovednost', 'zivotni', 'zdravotni-cizinci', 'mazlicek'];

function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function generate(): ProductionEntry[] {
  const out: ProductionEntry[] = [];
  for (const period of PRODUCTION_PERIODS) {
    for (const companyId of COMPANIES) {
      for (const productType of PRODUCT_TYPES) {
        const seed = hash(`${period}|${companyId}|${productType}`);
        // co_demo má výrazně nižší produkci.
        const scale = companyId === 'co_demo' ? 0.25 : 1;
        const volume = Math.round((40000 + (seed % 48) * 11000) * scale);
        const insurerId = INSURERS[seed % INSURERS.length];
        if (volume <= 0) continue;
        out.push({ period, companyId, insurerId, productType, volume });
      }
    }
  }
  return out;
}

export const MOCK_PRODUCTION: ProductionEntry[] = generate();

/** Součet produkce přes filtr období (period === 'vse' = vše). */
export function sumBy(
  entries: ProductionEntry[],
  period: string,
  key: keyof Pick<ProductionEntry, 'companyId' | 'insurerId' | 'productType'>,
): Record<string, number> {
  const filtered = period === 'vse' ? entries : entries.filter((e) => e.period === period);
  const out: Record<string, number> = {};
  for (const e of filtered) out[e[key]] = (out[e[key]] ?? 0) + e.volume;
  return out;
}
