/**
 * PDF „Kompletní porovnání nabídek" pro pojištění vozidel.
 *
 * Vizuálně sladěno se Záznamem z jednání (stejné fonty, kapitálky,
 * jemné rámečky, brand-vínová). Barvy se generují z `brandColor` (hex),
 * který se předá z administrace — tedy paleta je editovatelná v adminu.
 *
 * Strukturně modelováno podle vzoru klienta:
 *   1) Titulní strana (klient, vozidlo, požadavky, souhrn nabídek)
 *   2) Kontakt (zprostředkovatel + poradce)
 *   3) Detail Povinné ručení
 *   4) Detail Havarijní pojištění
 *   5) Detail Připojištění (skla / asistence / úraz řidiče / …)
 *   — pro chybějící hodnoty se zobrazí „—" / „Riziko nepojištěno".
 */

import { hexToPalette } from '@/features/admin/branding';

/* ---------- Typy vstupních dat ---------- */

export interface PdfCoverage {
  /* Povinné ručení */
  povLimit?: string;
  povTerritory?: string;
  povProductName?: string;

  /* Havarijní pojištění */
  havProductName?: string;
  havDeductible?: string;
  havInsuredAmount?: string;
  havTerritory?: string;
  havCoversAccident?: string;
  havCoversTheft?: string;
  havCoversVandalism?: string;
  havCoversElement?: string;

  /* Pojištění skel */
  glassPremium?: string;
  glassLimit?: string;
  glassDeductible?: string;
  glassTerritory?: string;
  glassCoversAccident?: string;
  glassCoversElement?: string;

  /* Pojištění zavazadel */
  luggageStatus?: string; // "Riziko nepojištěno" / "V ceně"
  luggagePremium?: string;
  luggageLimit?: string;
  luggageDeductible?: string;
  luggageTerritory?: string;
  luggageCoversTheft?: string;
  luggageCoversVandalism?: string;
  luggageCoversCrashLoss?: string;
  luggageCoversImpact?: string;
  luggageCoversWildlife?: string;
  luggageItemsPersonal?: string;
  luggageItemsRoofBox?: string;
  luggageItemsCarrierMounted?: string;
  luggageItemsChildSeat?: string;
  luggageItemsExtraEquip?: string;
  luggageItemsProfessional?: string;
  luggageItemsTrailer?: string;
  luggageIncludesAvTech?: string;
  luggageIncludesAnimals?: string;
  luggageIncludesFurCoats?: string;
  luggageIncludesLeatherClothes?: string;
  luggageIncludesWeapons?: string;
  luggageIncludesTools?: string;
  luggageIncludesVehicleParts?: string;
  luggageIncludesWrongStorage?: string;
  luggageIncludesVisibleItems?: string;
  luggageIncludesNightTheft?: string;
  luggageIncludesProfessionalUse?: string;
  luggageIncludesExternalCarrierDamage?: string;

  /* Úraz řidiče */
  driverAccidentPremium?: string;
  driverAccidentDeath?: string;
  driverAccidentDisability?: string;
  driverAccidentTerritory?: string;

  /* Úraz osob ve vozidle (vč. řidiče) */
  passengersAccidentPremium?: string;
  passengersAccidentDeath?: string;
  passengersAccidentDisability?: string;
  passengersAccidentTerritory?: string;

  /* Asistenční služby */
  assistanceProductName?: string;
  assistanceLevel?: string;
  assistanceRepairCz?: string;
  assistanceRepairAbroad?: string;
  assistanceReplacementVehicleCz?: string;
  assistanceReplacementVehicleAbroad?: string;
  assistanceLodgingCz?: string;
  assistanceLodgingAbroad?: string;
  assistanceTransportCz?: string;
  assistanceTransportAbroad?: string;
  assistanceTowingCz?: string;
  assistanceTowingAbroad?: string;

  /* Další doplňková pojištění */
  addonName?: string;
  addonLimit?: string;
  addonPremium?: string;

  /* Specifické benefity */
  specificBenefits?: string;

  /* Souhrn */
  mileageLabel?: string;
}

export interface PdfVehicleOffer {
  id: string;
  insurer: string;
  productName?: string;
  /** rozpis cen (po složkách). Když není, použije se `totalPrice`. */
  pricePov?: number;
  priceHav?: number;
  priceAddons?: number;
  /** override popisku v sloupci „Připojištění" v souhrnu (např. „Započítáno do celkového pojistného"). */
  addonsLabel?: string;
  totalPrice: number;
  discountPercent?: number;
  finalPrice: number;
  coverage?: PdfCoverage;
}

export interface VehicleOffersPdfData {
  brandColor?: string; // hex, default #A82844
  broker: { companyName: string; phone?: string; email?: string };
  advisor: { name: string; email?: string; phone?: string };
  client: {
    name: string;
    ico?: string;
    role?: string;
    phone?: string;
    email?: string;
    address?: string;
    operator?: string;
    owner?: string;
  };
  vehicle: {
    title: string;
    type?: string;
    vin?: string;
    year?: number | string;
    value?: string;
    mileageKm?: number | string;
    engineCapacityCc?: number | string;
    enginePowerKw?: number | string;
    usage?: string;
    weight?: number | string;
    fuel?: string;
  };
  requirements: {
    liabilityLimit?: string;
    deductible?: string;
    startDate?: string;
    frequency?: string;
  };
  offers: PdfVehicleOffer[];
  validityDate?: string;
}

/* ---------- Helpery ---------- */

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function czk(n: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(n);
}

function rgbVar(triplet: string | undefined): string {
  // hexToPalette vrací "168 40 68" → potřebujeme "rgb(168, 40, 68)"
  if (!triplet) return 'rgb(168, 40, 68)';
  const parts = triplet.split(/\s+/).map((s) => Number(s));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 'rgb(168, 40, 68)';
  return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
}

function dash(v: string | number | undefined | null): string {
  if (v === undefined || v === null || v === '') return '—';
  return esc(v);
}

/** Sestaví <colgroup> + hlavičku tabulky se sloupci pro každou pojišťovnu. */
function tableHeader(offers: PdfVehicleOffer[], firstLabel = 'Atribut'): string {
  const cols = offers
    .map(() => `<col style="width:${Math.floor(80 / offers.length)}%" />`)
    .join('');
  const ths = offers.map((o) => `<th>${esc(o.insurer)}</th>`).join('');
  return `
    <colgroup>
      <col style="width:20%" />
      ${cols}
    </colgroup>
    <thead><tr><th>${esc(firstLabel)}</th>${ths}</tr></thead>`;
}

/** Vrátí jeden řádek tabulky: label + buňka per pojišťovna podle resolveru. */
function row(
  label: string,
  offers: PdfVehicleOffer[],
  resolve: (o: PdfVehicleOffer) => string,
): string {
  const tds = offers.map((o) => `<td>${resolve(o)}</td>`).join('');
  return `<tr><th>${esc(label)}</th>${tds}</tr>`;
}

/** True, pokud všechny pojišťovny nemají hodnotu pro daný resolver (skryje se prázdná sekce). */
function allEmpty(offers: PdfVehicleOffer[], resolve: (o: PdfVehicleOffer) => string | undefined | null): boolean {
  return offers.every((o) => !resolve(o));
}

/** Podhlavička přes celou šířku tabulky (např. „Krytí", „Předmět pojištění"). */
function subhead(label: string, totalCols: number): string {
  return `<tr class="subhead"><th colspan="${totalCols + 1}">${esc(label)}</th></tr>`;
}

/** Plnohodnotný odstavec textu přes celou šířku (např. „Standardní výluky"). */
function paragraphRow(label: string, text: string, totalCols: number): string {
  return `<tr class="paragraph"><th>${esc(label)}</th><td colspan="${totalCols}">${esc(text)}</td></tr>`;
}

/* ---------- Build HTML ---------- */

export function buildVehicleOffersHtml(d: VehicleOffersPdfData): string {
  const brandHex = d.brandColor || '#A82844';
  const palette = hexToPalette(brandHex) ?? {
    50: '253 242 244',
    100: '251 227 231',
    200: '245 194 203',
    600: '168 40 68',
    700: '139 30 56',
    800: '109 26 48',
  };
  const today = new Date().toLocaleString('cs-CZ');
  const validity = d.validityDate || new Date().toLocaleDateString('cs-CZ');
  const offers = d.offers;

  // Souhrnná tabulka (Navrhovaná řešení)
  const summaryRows = `
    ${row('Povinné ručení', offers, (o) => (o.pricePov != null ? esc(czk(o.pricePov)) : dash(undefined)))}
    ${row('Havarijní pojištění', offers, (o) => (o.priceHav != null ? esc(czk(o.priceHav)) : dash(undefined)))}
    ${row('Připojištění', offers, (o) =>
      o.priceAddons != null
        ? esc(czk(o.priceAddons))
        : o.addonsLabel
          ? `<span class="muted">${esc(o.addonsLabel)}</span>`
          : dash(undefined),
    )}
    ${row('Kalkulováno pro nájezd', offers, (o) => esc(o.coverage?.mileageLabel || 'Nájezd nevybrán'))}
    <tr class="total">
      <th>Celkem ročně (po slevě)</th>
      ${offers.map((o) => `<td><strong>${esc(czk(o.finalPrice))}</strong></td>`).join('')}
    </tr>
    ${offers.some((o) => (o.discountPercent ?? 0) > 0)
      ? `<tr class="discount-row"><th>Sleva</th>${offers
          .map((o) =>
            (o.discountPercent ?? 0) > 0
              ? `<td><span class="pill">−${o.discountPercent} %</span></td>`
              : '<td class="muted">—</td>',
          )
          .join('')}</tr>`
      : ''}
  `;

  const N = offers.length;

  // -- Detail: Povinné ručení
  const povTable = `
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Pojistné (ročně)', offers, (o) => (o.pricePov != null ? esc(czk(o.pricePov)) : dash(undefined)))}
        ${row('Produkt', offers, (o) => dash(o.coverage?.povProductName || o.productName))}
        ${row('Limit plnění', offers, (o) => dash(o.coverage?.povLimit))}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.povTerritory))}
      </tbody>
    </table>`;

  // -- Detail: Havarijní pojištění (s Krytí)
  const havTable = `
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Pojistné (ročně)', offers, (o) => (o.priceHav != null ? esc(czk(o.priceHav)) : dash(undefined)))}
        ${row('Produkt', offers, (o) => dash(o.coverage?.havProductName || o.productName))}
        ${row('Spoluúčast', offers, (o) => dash(o.coverage?.havDeductible))}
        ${row('Pojistná částka', offers, (o) => dash(o.coverage?.havInsuredAmount))}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.havTerritory))}
        ${subhead('Krytí', N)}
        ${row('Havárie', offers, (o) => dash(o.coverage?.havCoversAccident))}
        ${row('Odcizení', offers, (o) => dash(o.coverage?.havCoversTheft))}
        ${row('Vandalismus', offers, (o) => dash(o.coverage?.havCoversVandalism))}
        ${row('Živel', offers, (o) => dash(o.coverage?.havCoversElement))}
      </tbody>
    </table>`;

  // -- Připojištění: Skla
  const glassSection = `
    <h3>Pojištění skel</h3>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Lhůtní pojistné', offers, (o) => dash(o.coverage?.glassPremium))}
        ${row('Limit', offers, (o) => dash(o.coverage?.glassLimit))}
        ${row('Spoluúčast', offers, (o) => dash(o.coverage?.glassDeductible))}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.glassTerritory))}
        ${subhead('Krytí', N)}
        ${row('Dopravní nehoda', offers, (o) => dash(o.coverage?.glassCoversAccident))}
        ${row('Živel', offers, (o) => dash(o.coverage?.glassCoversElement))}
      </tbody>
    </table>`;

  // -- Připojištění: Zavazadla (rozsáhlá sekce)
  const STANDARD_LUGGAGE_EXCLUSIONS =
    'Peníze, ceniny, cenné papíry a směnky, vkladní a šekové knížky, platební a jiné karty, osobní doklady všeho druhu, letenky apod. včetně nákladů spojených s jejich znovupořízením, drahé kovy a kameny a předměty z nich, šperky, perly, polodrahokamy, písemnosti, plány, jiná dokumentace, umělecká díla, zvláštní kulturní a historické hodnoty, starožitnosti, sbírky a věci sběratelského zájmu.';

  const luggageSection = `
    <h3>Pojištění zavazadel</h3>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Stav', offers, (o) => dash(o.coverage?.luggageStatus || 'Riziko nepojištěno'))}
        ${row('Lhůtní pojistné', offers, (o) => dash(o.coverage?.luggagePremium))}
        ${row('Limit', offers, (o) => dash(o.coverage?.luggageLimit))}
        ${row('Spoluúčast', offers, (o) => dash(o.coverage?.luggageDeductible))}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.luggageTerritory))}
        ${subhead('Krytí', N)}
        ${row('Odcizení', offers, (o) => dash(o.coverage?.luggageCoversTheft))}
        ${row('Vandalismus', offers, (o) => dash(o.coverage?.luggageCoversVandalism))}
        ${row('Ztráta při dopravní nehodě', offers, (o) => dash(o.coverage?.luggageCoversCrashLoss))}
        ${row('Pád či náraz věci', offers, (o) => dash(o.coverage?.luggageCoversImpact))}
        ${row('Srážka se zvěří', offers, (o) => dash(o.coverage?.luggageCoversWildlife))}
        ${subhead('Předmět pojištění', N)}
        ${row('Zavazadla a osobní věci cestujících ve vozidle', offers, (o) => dash(o.coverage?.luggageItemsPersonal))}
        ${row('Věci ve střešním boxu', offers, (o) => dash(o.coverage?.luggageItemsRoofBox))}
        ${row('Věci upevněné na nosiči vozidla', offers, (o) => dash(o.coverage?.luggageItemsCarrierMounted))}
        ${row('Dětská autosedačka', offers, (o) => dash(o.coverage?.luggageItemsChildSeat))}
        ${row('Dodatečná výbava vozidla v PS', offers, (o) => dash(o.coverage?.luggageItemsExtraEquip))}
        ${row('Přístroje pro výkon povolání', offers, (o) => dash(o.coverage?.luggageItemsProfessional))}
        ${row('Věci v přívěsném vozíku', offers, (o) => dash(o.coverage?.luggageItemsTrailer))}
        ${paragraphRow('Standardní výluky', STANDARD_LUGGAGE_EXCLUSIONS, N)}
        ${subhead('Je v rámci pojištění kryto následující?', N)}
        ${row('Audiovizuální technika a výpočetní technika', offers, (o) => dash(o.coverage?.luggageIncludesAvTech))}
        ${row('Zvířata', offers, (o) => dash(o.coverage?.luggageIncludesAnimals))}
        ${row('Kožichy', offers, (o) => dash(o.coverage?.luggageIncludesFurCoats))}
        ${row('Kožené oděvní svršky', offers, (o) => dash(o.coverage?.luggageIncludesLeatherClothes))}
        ${row('Zbraně, střelivo, příslušenství a náhradní díly', offers, (o) => dash(o.coverage?.luggageIncludesWeapons))}
        ${row('Nářadí, nástroje, přístroje', offers, (o) => dash(o.coverage?.luggageIncludesTools))}
        ${row('Příslušenství, vybavení a náhradní díly vozidel', offers, (o) => dash(o.coverage?.luggageIncludesVehicleParts))}
        ${row('Nesprávné uložení a následné škody', offers, (o) => dash(o.coverage?.luggageIncludesWrongStorage))}
        ${row('Věci zvenčí viditelné nebo patrné (mimo dětské autosedačky)', offers, (o) => dash(o.coverage?.luggageIncludesVisibleItems))}
        ${row('Odcizení mezi 22. a 6. hodinou', offers, (o) => dash(o.coverage?.luggageIncludesNightTheft))}
        ${row('Věci sloužící k výkonu povolání / podnikání', offers, (o) => dash(o.coverage?.luggageIncludesProfessionalUse))}
        ${row('Poškození zavazadel na vnějším nosiči živlem', offers, (o) => dash(o.coverage?.luggageIncludesExternalCarrierDamage))}
      </tbody>
    </table>`;

  // -- Připojištění: Úraz řidiče
  const driverAccidentSection = `
    <h3>Pojištění úrazu řidiče</h3>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Lhůtní pojistné', offers, (o) => dash(o.coverage?.driverAccidentPremium))}
        ${row('Pojistná částka pro smrt úrazem', offers, (o) => dash(o.coverage?.driverAccidentDeath))}
        ${row('Pojistná částka pro trvalé následky / invaliditu', offers, (o) =>
          dash(o.coverage?.driverAccidentDisability),
        )}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.driverAccidentTerritory))}
      </tbody>
    </table>`;

  // -- Připojištění: Úraz osob ve vozidle (vč. řidiče)
  const passengersSection = `
    <h3>Úraz všech osob ve vozidle (včetně řidiče)</h3>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Lhůtní pojistné', offers, (o) => dash(o.coverage?.passengersAccidentPremium))}
        ${row('Pojistná částka pro smrt úrazem', offers, (o) =>
          dash(o.coverage?.passengersAccidentDeath),
        )}
        ${row('Pojistná částka pro trvalé následky / invaliditu', offers, (o) =>
          dash(o.coverage?.passengersAccidentDisability),
        )}
        ${row('Územní platnost', offers, (o) => dash(o.coverage?.passengersAccidentTerritory))}
      </tbody>
    </table>`;

  // -- Asistenční služby (v ČR / v zahraničí dvojice)
  const assistanceSection = `
    <h2>Asistenční služby</h2>
    <table class="detail">
      ${tableHeader(offers, 'Atribut')}
      <tbody>
        ${row('Asistence (produkt)', offers, (o) =>
          dash(o.coverage?.assistanceProductName || o.coverage?.assistanceLevel),
        )}
        ${subhead('Limity opravy na místě', N)}
        ${row('v ČR', offers, (o) => dash(o.coverage?.assistanceRepairCz))}
        ${row('v zahraničí', offers, (o) => dash(o.coverage?.assistanceRepairAbroad))}
        ${subhead('Limity vyproštění vozidla', N)}
        ${row('v ČR', offers, (o) => dash(o.coverage?.assistanceTowingCz))}
        ${row('v zahraničí', offers, (o) => dash(o.coverage?.assistanceTowingAbroad))}
        ${subhead('Náhradní vozidlo při nehodě', N)}
        ${row('v ČR', offers, (o) => dash(o.coverage?.assistanceReplacementVehicleCz))}
        ${row('v zahraničí', offers, (o) => dash(o.coverage?.assistanceReplacementVehicleAbroad))}
        ${subhead('Náhradní ubytování', N)}
        ${row('v ČR', offers, (o) => dash(o.coverage?.assistanceLodgingCz))}
        ${row('v zahraničí', offers, (o) => dash(o.coverage?.assistanceLodgingAbroad))}
        ${subhead('Náhradní doprava', N)}
        ${row('v ČR', offers, (o) => dash(o.coverage?.assistanceTransportCz))}
        ${row('v zahraničí', offers, (o) => dash(o.coverage?.assistanceTransportAbroad))}
      </tbody>
    </table>`;

  // -- Další doplňková pojištění
  const addonsSection = `
    <h2>Další doplňková pojištění</h2>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Název pojištění', offers, (o) => dash(o.coverage?.addonName))}
        ${row('Limit', offers, (o) => dash(o.coverage?.addonLimit))}
        ${row('Lhůtní pojistné', offers, (o) => dash(o.coverage?.addonPremium))}
      </tbody>
    </table>`;

  // -- Specifické benefity produktů
  const benefitsSection = `
    <h2>Specifické benefity produktů</h2>
    <table class="detail">
      ${tableHeader(offers)}
      <tbody>
        ${row('Popis', offers, (o) => dash(o.coverage?.specificBenefits))}
      </tbody>
    </table>`;

  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8" />
<title>Kompletní porovnání nabídek – pojištění vozidla</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<style>
  :root {
    --brand-50: ${rgbVar(palette[50])};
    --brand-100: ${rgbVar(palette[100])};
    --brand-200: ${rgbVar(palette[200])};
    --brand-600: ${rgbVar(palette[600])};
    --brand-700: ${rgbVar(palette[700])};
    --brand-800: ${rgbVar(palette[800])};
    --ink: #1a1614;
    --muted: #615d56;
    --subtle: #928d83;
    --line: #e9e5dc;
    --soft: #f6f3ee;
  }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: var(--ink); margin: 0; padding: 28px 32px; background: #fff; font-size: 12px; }

  /* Hlavička */
  .brand-bar { height: 6px; background: linear-gradient(90deg, var(--brand-700), var(--brand-600), var(--brand-200)); border-radius: 3px; margin-bottom: 14px; }
  .top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; }
  .top .date { font-size: 11px; color: var(--muted); }
  h1 { font-size: 18px; margin: 0; color: var(--brand-700); letter-spacing: 0.04em; text-transform: uppercase; }
  h2 { font-size: 12px; margin: 22px 0 8px; color: var(--brand-700); letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 2px solid var(--brand-200); padding-bottom: 4px; }
  h3 { font-size: 11.5px; margin: 14px 0 6px; color: var(--brand-800); letter-spacing: 0.04em; text-transform: uppercase; }

  /* Klientský/vozidlový blok */
  .card { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 28px; }
  .kv { font-size: 11.5px; }
  .kv .k { color: var(--muted); }
  .kv .v { font-weight: 600; }
  .same-as { color: var(--muted); font-style: italic; }

  /* Vozidlo */
  .vehicle-title { font-size: 13px; font-weight: 700; margin: 14px 0 4px; }
  .vehicle-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px 18px; font-size: 11px; color: var(--muted); }
  .vehicle-meta b { color: var(--ink); }

  /* Požadavky klienta — boxy */
  .req-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 6px; }
  .req-box { border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; background: var(--soft); }
  .req-box .l { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .req-box .v { font-size: 12px; font-weight: 700; margin-top: 2px; }

  /* Tabulky */
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; page-break-inside: avoid; table-layout: fixed; }
  table th, table td { border: 1px solid var(--line); padding: 5px 6px; text-align: left; vertical-align: top; word-wrap: break-word; }
  table thead th { background: var(--brand-600); color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; font-size: 9.5px; }
  table tbody th { background: var(--soft); color: var(--ink); font-weight: 600; }
  table.summary td { font-weight: 600; }
  table.summary tr.total { background: var(--brand-50); }
  table.summary tr.total th, table.summary tr.total td { font-size: 13px; }
  table.summary tr.discount-row td { color: var(--brand-700); }
  table.detail { margin-bottom: 14px; }
  table .subhead th { background: var(--brand-50); color: var(--brand-700); text-transform: uppercase; letter-spacing: 0.04em; font-size: 10px; }
  table .paragraph td { color: var(--muted); font-size: 10.5px; line-height: 1.4; }
  .muted { color: var(--muted); }
  .pill { display: inline-block; padding: 2px 8px; background: var(--brand-50); color: var(--brand-700); border-radius: 999px; font-weight: 700; font-size: 10.5px; }

  /* Stránkování */
  .page-break { page-break-before: always; }

  /* Tlačítko v rohu k tisku — vidí jen na obrazovce */
  .print-bar { display: flex; gap: 8px; align-items: center; margin: 0 0 14px; }
  .print-btn { background: var(--brand-600); color: #fff; border: 0; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .print-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .print-status { font-size: 12px; color: var(--muted); }
  @media print { body { padding: 0; } .no-print { display: none !important; } }

  .foot { margin-top: 26px; font-size: 10px; color: var(--subtle); line-height: 1.5; }
</style>
</head>
<body>
  <div class="print-bar no-print">
    <button id="dl-btn" class="print-btn" onclick="downloadPdf()">Stáhnout PDF</button>
    <span id="dl-status" class="print-status">Připravuji PDF…</span>
  </div>

  <div id="pdf-content">
  <div class="brand-bar"></div>
  <div class="top">
    <h1>Kompletní porovnání nabídek</h1>
    <span class="date">${esc(today)}</span>
  </div>

  <!-- Klient -->
  <h2>Klient</h2>
  <div class="card">
    <div class="grid-2">
      <div class="kv"><span class="k">Pojistník: </span><span class="v">${esc(d.client.name)}</span></div>
      <div class="kv"><span class="k">IČO: </span><span class="v">${dash(d.client.ico)}</span></div>
      <div class="kv"><span class="k">Adresa: </span><span class="v">${dash(d.client.address)}</span></div>
      <div class="kv"><span class="k">Telefon: </span><span class="v">${dash(d.client.phone)}</span></div>
      <div class="kv"><span class="k">E-mail: </span><span class="v">${dash(d.client.email)}</span></div>
      <div class="kv"><span class="k">Role: </span><span class="v">${dash(d.client.role || 'Pojistník')}</span></div>
      <div class="kv"><span class="k">Provozovatel: </span><span class="v">${esc(d.client.operator || 'Shodný s pojistníkem')}</span></div>
      <div class="kv"><span class="k">Vlastník: </span><span class="v">${esc(d.client.owner || 'Shodný s pojistníkem')}</span></div>
    </div>
  </div>

  <!-- Vozidlo -->
  <h2>Vozidlo</h2>
  <div class="card">
    <div class="vehicle-title">${esc(d.vehicle.title)}</div>
    <div class="vehicle-meta">
      <div>Druh: <b>${dash(d.vehicle.type)}</b></div>
      <div>VIN: <b>${dash(d.vehicle.vin)}</b></div>
      <div>Rok výroby: <b>${dash(d.vehicle.year)}</b></div>
      <div>Hodnota: <b>${dash(d.vehicle.value)}</b></div>
      <div>Najeté km: <b>${dash(d.vehicle.mileageKm)}</b></div>
      <div>Zdvih: <b>${dash(d.vehicle.engineCapacityCc)} ccm</b></div>
      <div>Výkon: <b>${dash(d.vehicle.enginePowerKw)} kW</b></div>
      <div>Užití: <b>${dash(d.vehicle.usage)}</b></div>
      <div>Hmotnost: <b>${dash(d.vehicle.weight)} kg</b></div>
      <div>Palivo: <b>${dash(d.vehicle.fuel)}</b></div>
    </div>
  </div>

  <!-- Požadavky klienta -->
  <h2>Požadavky klienta</h2>
  <div class="req-grid">
    <div class="req-box"><div class="l">Limit povinného ručení</div><div class="v">${dash(d.requirements.liabilityLimit)}</div></div>
    <div class="req-box"><div class="l">Spoluúčast</div><div class="v">${dash(d.requirements.deductible)}</div></div>
    <div class="req-box"><div class="l">Počátek pojištění</div><div class="v">${dash(d.requirements.startDate)}</div></div>
    <div class="req-box"><div class="l">Frekvence placení</div><div class="v">${dash(d.requirements.frequency)}</div></div>
  </div>

  <!-- Navrhovaná řešení -->
  <h2>Navrhovaná řešení</h2>
  <table class="summary">
    ${tableHeader(offers, '')}
    <tbody>
      ${summaryRows}
    </tbody>
  </table>

  <!-- KONTAKT -->
  <div class="page-break"></div>
  <h2>Kontakt</h2>
  <div class="card">
    <div class="grid-2">
      <div class="kv"><span class="k">Zprostředkovatel: </span><span class="v">${esc(d.broker.companyName)}</span></div>
      <div class="kv"><span class="k">Telefon: </span><span class="v">${dash(d.broker.phone)}</span></div>
      <div class="kv"><span class="k">E-mail: </span><span class="v">${dash(d.broker.email)}</span></div>
      <div class="kv"><span class="k">Poradce: </span><span class="v">${esc(d.advisor.name)}</span></div>
      <div class="kv"><span class="k">Telefon poradce: </span><span class="v">${dash(d.advisor.phone)}</span></div>
      <div class="kv"><span class="k">E-mail poradce: </span><span class="v">${dash(d.advisor.email)}</span></div>
    </div>
  </div>

  <!-- POVINNÉ RUČENÍ -->
  <div class="page-break"></div>
  <h2>Povinné ručení</h2>
  ${povTable}

  <!-- HAVARIJNÍ POJIŠTĚNÍ -->
  <h2>Havarijní pojištění</h2>
  ${havTable}

  <!-- PŘIPOJIŠTĚNÍ -->
  <div class="page-break"></div>
  <h2>Připojištění</h2>
  ${glassSection}
  ${luggageSection}
  ${driverAccidentSection}
  ${passengersSection}

  <!-- ASISTENČNÍ SLUŽBY -->
  <div class="page-break"></div>
  ${assistanceSection}

  <!-- DALŠÍ DOPLŇKOVÁ POJIŠTĚNÍ -->
  ${addonsSection}

  <!-- SPECIFICKÉ BENEFITY -->
  ${benefitsSection}

  <div class="foot">
    Dokument je orientačním přehledem zpracovaným zprostředkovatelem ${esc(d.broker.companyName)}. Ceny jsou roční,
    vycházejí ze zadaných parametrů a po finálním ocenění pojišťovnou se mohou lišit. Tento přehled neslouží
    jako návrh na uzavření pojistné smlouvy. Kalkulace platná ke dni ${esc(validity)}.
  </div>
  </div><!-- /#pdf-content -->

  <script>
    (function() {
      const btn = document.getElementById('dl-btn');
      const status = document.getElementById('dl-status');
      window.downloadPdf = async function() {
        if (typeof html2pdf === 'undefined') {
          status.textContent = 'Knihovna PDF ještě nedoběhla, zkus prosím za chvíli znovu.';
          return;
        }
        btn.disabled = true;
        status.textContent = 'Generuji PDF…';
        try {
          await html2pdf().set({
            margin: 8,
            filename: 'kompletni-porovnani-nabidek.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['table', 'tr'] }
          }).from(document.getElementById('pdf-content')).save();
          status.textContent = 'Hotovo. PDF se uložilo do Stahování.';
        } catch (e) {
          status.textContent = 'Stažení selhalo, klikni znovu.';
        } finally {
          btn.disabled = false;
        }
      };
      // Auto-spuštění po načtení knihovny (s krátkou rezervou na fonts).
      window.addEventListener('load', function() {
        setTimeout(window.downloadPdf, 600);
      });
    })();
  </script>
</body>
</html>`;
}

/* ---------- Otevření v novém okně ---------- */

export function openVehicleOffersPdf(data: VehicleOffersPdfData): void {
  const html = buildVehicleOffersHtml(data);
  // Stejný osvědčený přístup jako u Záznamu z jednání: nové okno + document.write
  // (Safari má s blob: URL u "Uložit jako PDF" potíže – ukládá prázdnou stránku).
  const win = window.open('', '_blank');
  if (!win) {
    // Fallback: navigace v aktuální záložce přes data URL.
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    window.location.href = dataUrl;
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
}

/* ---------- Pomocník pro čtení aktuální brand barvy z CSS proměnných ---------- */

export function readBrandHexFromCssVar(): string {
  if (typeof document === 'undefined') return '#A82844';
  const triplet = getComputedStyle(document.documentElement).getPropertyValue('--brand-600').trim();
  if (!triplet) return '#A82844';
  const parts = triplet.split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '#A82844';
  const hex = parts.map((n) => n.toString(16).padStart(2, '0')).join('');
  return `#${hex}`;
}
