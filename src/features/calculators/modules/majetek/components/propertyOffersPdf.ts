/**
 * PDF draft nabídek pojištění majetku. Vypíše „top nabídky" (s detailem krytí
 * a připojištění) a souhrnnou tabulku ostatních nabídek. Otevře se v novém okně
 * a spustí tiskový dialog (uložit jako PDF) – stejný přístup jako u Záznamu z jednání.
 */

export interface PdfOfferAddon {
  name: string;
  price: number;
}

export interface PdfTopOffer {
  provider: string;
  productName: string;
  basePrice: number;
  included: string[];
  addons: PdfOfferAddon[];
  total: number;
  discountPercent: number;
  final: number;
}

export interface PdfOtherOffer {
  provider: string;
  price: number;
}

export interface PropertyOffersPdfData {
  clientName: string;
  propertyLabel: string;
  propertyAddress: string;
  offerNumber: string;
  startDate: string;
  paymentFrequency: string;
  topOffers: PdfTopOffer[];
  otherOffers: PdfOtherOffer[];
}

function esc(s: string): string {
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

export function buildOffersHtml(d: PropertyOffersPdfData): string {
  const today = new Date().toLocaleDateString('cs-CZ');

  const topCards = d.topOffers
    .map((o, i) => {
      const rank = i + 1;
      const discountLine =
        o.discountPercent > 0
          ? `<div class="disc">Sleva ${o.discountPercent} % · původně <s>${esc(czk(o.total))}</s></div>`
          : '';
      const included = o.included.map((c) => `<li>${esc(c)}</li>`).join('');
      const addons = o.addons.length
        ? o.addons
            .map((a) => `<li>${esc(a.name)} <span class="muted">(+ ${esc(czk(a.price))})</span></li>`)
            .join('')
        : '<li class="muted">Bez zvolených připojištění</li>';
      return `
        <div class="card ${rank === 1 ? 'best' : ''}">
          <div class="card-head">
            <div>
              <span class="rank">${rank === 1 ? 'Nejvýhodnější' : `Nabídka ${rank}`}</span>
              <div class="prov">${esc(o.provider)} — ${esc(o.productName)}</div>
            </div>
            <div class="price-box">
              <div class="price">${esc(czk(o.final))}</div>
              <div class="per">ročně</div>
              ${discountLine}
            </div>
          </div>
          <div class="cols">
            <div>
              <div class="lbl">V ceně</div>
              <ul>${included}</ul>
            </div>
            <div>
              <div class="lbl">Zvolená připojištění</div>
              <ul>${addons}</ul>
            </div>
          </div>
        </div>`;
    })
    .join('');

  const otherRows = d.otherOffers
    .map(
      (o) =>
        `<tr><td>${esc(o.provider)}</td><td class="r">${esc(czk(o.price))} / ročně</td></tr>`,
    )
    .join('');

  const otherTable = d.otherOffers.length
    ? `
      <h2>Souhrn dalších nabídek</h2>
      <table class="summary">
        <thead><tr><th>Pojišťovna</th><th class="r">Pojistné</th></tr></thead>
        <tbody>${otherRows}</tbody>
      </table>`
    : '';

  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Nabídka pojištění majetku</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1a1614; margin: 0; padding: 32px; background: #fff; }
  h1 { font-size: 20px; margin: 0 0 4px; color: #a82844; }
  h2 { font-size: 15px; margin: 28px 0 12px; color: #8b1e38; border-bottom: 2px solid #f5c2cb; padding-bottom: 6px; }
  .sub { color: #615d56; font-size: 12px; margin-bottom: 18px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; font-size: 12px; margin-bottom: 24px; border: 1px solid #e9e5dc; border-radius: 10px; padding: 14px 18px; }
  .meta .k { color: #615d56; }
  .meta .v { font-weight: 600; }
  .card { border: 1px solid #e9e5dc; border-radius: 12px; padding: 16px 18px; margin-bottom: 14px; page-break-inside: avoid; }
  .card.best { border-color: #a82844; background: #fdf2f4; }
  .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid #efe7e9; padding-bottom: 12px; margin-bottom: 12px; }
  .rank { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: #a82844; }
  .prov { font-size: 15px; font-weight: 700; margin-top: 2px; }
  .price-box { text-align: right; }
  .price { font-size: 22px; font-weight: 800; color: #a82844; }
  .per { font-size: 11px; color: #615d56; }
  .disc { font-size: 11px; color: #615d56; margin-top: 2px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: #615d56; margin-bottom: 6px; }
  ul { margin: 0; padding-left: 16px; }
  li { font-size: 12px; margin-bottom: 3px; }
  .muted { color: #928d83; }
  table.summary { width: 100%; border-collapse: collapse; font-size: 12px; }
  table.summary th, table.summary td { border: 1px solid #e9e5dc; padding: 7px 12px; text-align: left; }
  table.summary th { background: #f4f1ec; }
  .r { text-align: right; }
  .foot { margin-top: 26px; font-size: 10.5px; color: #928d83; line-height: 1.5; }
  .print-btn { position: sticky; top: 0; float: right; margin: 0 0 10px 10px; background: #a82844; color: #fff; border: 0; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
  @media print { body { padding: 0; } .no-print { display: none !important; } }
</style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Stáhnout / vytisknout PDF</button>
  <h1>Nabídka pojištění majetku</h1>
  <div class="sub">Orientační návrh nabídek k ${esc(today)}. Nejedná se o závaznou nabídku.</div>

  <div class="meta">
    <div><span class="k">Klient:</span> <span class="v">${esc(d.clientName || '—')}</span></div>
    <div><span class="k">Nabídka č.:</span> <span class="v">${esc(d.offerNumber || '—')}</span></div>
    <div><span class="k">Předmět:</span> <span class="v">${esc(d.propertyLabel)}</span></div>
    <div><span class="k">Počátek pojištění:</span> <span class="v">${esc(d.startDate || '—')}</span></div>
    <div><span class="k">Adresa:</span> <span class="v">${esc(d.propertyAddress || '—')}</span></div>
    <div><span class="k">Frekvence platby:</span> <span class="v">${esc(d.paymentFrequency || 'ročně')}</span></div>
  </div>

  <h2>Top nabídky</h2>
  ${topCards}

  ${otherTable}

  <div class="foot">
    Dokument je orientačním přehledem zpracovaným zprostředkovatelem Star Insurance Group. Ceny jsou roční,
    vycházejí ze zadaných parametrů a mohou se po finálním ocenění pojišťovnou lišit. Tento přehled neslouží
    jako návrh na uzavření pojistné smlouvy.
  </div>
</body>
</html>`;
}

export function openOffersPdf(data: PropertyOffersPdfData): void {
  const html = buildOffersHtml(data);

  // Spolehlivější napříč prohlížeči (vč. mobilního Safari) než prázdné okno + document.write.
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank');
  if (win) {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return;
  }

  // Fallback, když prohlížeč zablokuje nové okno – otevře dokument v aktuální záložce.
  window.location.href = url;
}
