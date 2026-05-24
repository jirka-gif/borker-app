import {
  INTERMEDIARY,
  INTERMEDIARY_MODE_LABELS,
  INTERMEDIARY_VARIANT_LABELS,
} from '@/config/intermediary';
import type { RecordInput, RecordState } from './types';
import {
  BROKER_DECLARATIONS,
  CLOSING_DECLARATIONS,
  CNB_NOTE,
  DECISION_AGREE,
  DECISION_REJECT,
  DISTANCE_NOTE,
  FALLBACK_NO_DISCREPANCIES,
  FALLBACK_NO_OTHER_NEEDS,
  HEADER_INTRO,
  HEADER_SUBTITLE,
  IMPACT_PAYMENT,
  TWO_COPIES_NOTE,
  complaintText,
} from './texts';

export interface RecordData {
  input: RecordInput;
  record: RecordState;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('cs-CZ');
}

/** Sestaví kompletní HTML dokument „Záznam z jednání" pro tisk / uložení do PDF. */
export function buildRecordHtml({ input, record: r }: RecordData): string {
  const c = input.customer;

  const row = (label: string, value: string) =>
    `<tr><th>${esc(label)}</th><td>${esc(value || '—')}</td></tr>`;

  const declarations = BROKER_DECLARATIONS.map((d) => `<p>${esc(d)}</p>`).join('');
  const modeLine = `V tomto konkrétním obchodním případě Zprostředkovatel vystupuje jako ${esc(
    INTERMEDIARY_MODE_LABELS[r.mode],
  )}.`;

  const scopeRows = input.scope.rows.map((row) => `<tr><th>${esc(row.label)}</th><td>${esc(row.value)}</td></tr>`).join('');
  const totalRow = input.scope.totalLabel
    ? `<tr><th>Roční pojistné</th><td><strong>${esc(input.scope.totalLabel)}</strong></td></tr>`
    : '';

  const representedSection = `<h3>Zastoupená</h3><table class="kv"><tbody>
        ${row('Jméno a příjmení', r.representativeName)}
        ${row('Typ zprostředkovatele', INTERMEDIARY_VARIANT_LABELS[r.intermediaryVariant])}
        ${row('IČ', r.representativeIco)}
        ${row('Adresa / Sídlo', r.representativeAddress)}
        ${row('Tel. / Email', [r.representativePhone, r.representativeEmail].filter(Boolean).join(' / '))}
      </tbody></table>`;

  const decisionText = r.customerAccepts
    ? `Zákazník se rozhodl a souhlasí se zvoleným rozsahem pojištění a s uzavřením pojistné smlouvy u: ${esc(
        r.recommendedProduct,
      )}. ${esc(DECISION_AGREE)}`
    : esc(DECISION_REJECT);

  const closingItems = CLOSING_DECLARATIONS.map((d) => `<li>${esc(d)}</li>`).join('');
  const impacts = [IMPACT_PAYMENT, ...input.impactParagraphs].map((p) => `<p>${esc(p)}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="cs"><head><meta charset="utf-8" />
<title>Záznam z jednání – ${esc(c.name || '—')}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1a1a1a; font-size: 11px; line-height: 1.5; margin: 0; padding: 32px 40px; }
  h1 { font-size: 18px; margin: 0 0 2px; color: #A82844; }
  h2 { font-size: 13px; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #A82844; color: #A82844; text-transform: uppercase; letter-spacing: .03em; }
  h3 { font-size: 12px; margin: 12px 0 6px; }
  p { margin: 0 0 6px; text-align: justify; }
  .sub { color: #555; font-size: 10px; margin-bottom: 14px; }
  table.kv { width: 100%; border-collapse: collapse; margin: 6px 0 10px; }
  table.kv th { text-align: left; width: 230px; vertical-align: top; padding: 4px 8px; background: #faf3f5; border: 1px solid #ecd9df; font-weight: 600; }
  table.kv td { padding: 4px 8px; border: 1px solid #ecd9df; }
  ul { margin: 4px 0 8px; padding-left: 18px; }
  li { margin-bottom: 4px; text-align: justify; }
  .muted { color: #666; }
  .box { border: 1px solid #ecd9df; border-radius: 6px; padding: 10px 12px; background: #fcfafb; margin: 6px 0; }
  table.offers { width: 100%; border-collapse: collapse; margin: 6px 0 4px; }
  table.offers th { background: #A82844; color: #fff; padding: 5px 8px; text-align: left; font-size: 10px; }
  table.offers td { border: 1px solid #ecd9df; padding: 5px 8px; }
  table.offers .r { text-align: right; }
  table.offers .c { text-align: center; }
  table.offers tr.rec td { background: #faf3f5; font-weight: 600; }
  .sign { display: flex; justify-content: space-between; margin-top: 40px; gap: 40px; }
  .sign div { flex: 1; border-top: 1px solid #999; padding-top: 6px; text-align: center; font-size: 10px; }
  .footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 9px; color: #888; display: flex; justify-content: space-between; }
  @media print { body { padding: 0; } @page { margin: 18mm 16mm; } }
</style></head>
<body>
  <h1>ZÁZNAM Z JEDNÁNÍ</h1>
  <div class="sub">${esc(HEADER_SUBTITLE)}</div>
  <p>${esc(HEADER_INTRO)}</p>

  <h2>Samostatný zprostředkovatel</h2>
  <table class="kv"><tbody>
    ${row('Název společnosti', INTERMEDIARY.companyName)}
    ${row('IČ', INTERMEDIARY.ico)}
    ${row('Sídlo', INTERMEDIARY.address)}
    ${row('Tel. / Email', `${INTERMEDIARY.phone} / ${INTERMEDIARY.email}`)}
  </tbody></table>
  <p class="muted">${esc(CNB_NOTE)} (${esc(INTERMEDIARY.cnbRegistryUrl)})</p>
  ${representedSection}

  <h2>Zájemce o pojištění (zákazník)</h2>
  <table class="kv"><tbody>
    ${row('Jméno / Název', c.name)}
    ${row(c.idLabel, c.idValue)}
    ${row('Korespondenční adresa', c.address)}
    ${c.permanentAddress ? row('Trvalé bydliště', c.permanentAddress) : ''}
    ${row('Telefon', c.phone)}
    ${row('E-mail', c.email)}
    ${row('Způsob jednání', r.contractMethod)}
    ${row('Sjednání pojistné smlouvy', r.signingMethod)}
  </tbody></table>

  <h2>Informace pro zákazníka</h2>
  <h3>Prohlášení Zprostředkovatele</h3>
  ${declarations}
  <p>${modeLine}</p>
  <p>${esc(complaintText(INTERMEDIARY.complaintEmail, INTERMEDIARY.web, INTERMEDIARY.complaintsUrl))}</p>

  <h2>Požadavky, potřeby a cíle zákazníka</h2>
  <table class="kv"><tbody>
    ${row('Druh požadovaného pojištění', input.insuranceKind)}
    ${row('Předmět pojištění', input.subjectLabel)}
    ${row('Pojištěné osoby', input.insuredPersons)}
    ${input.insuredPlace ? row('Adresa místa pojištění', input.insuredPlace) : ''}
  </tbody></table>
  <h3>Požadovaný rozsah pojištění (rizika a limity)</h3>
  <table class="kv"><tbody>${scopeRows}${totalRow}</tbody></table>
  <h3>Jiné potřeby, přání a cíle zákazníka</h3>
  <div class="box">${esc(r.otherNeeds || FALLBACK_NO_OTHER_NEEDS)}</div>
  <table class="kv"><tbody>
    ${input.amountBasis ? row('Stanovení pojistné částky', input.amountBasis) : ''}
    ${row('Pojistný zájem', r.insuredInterest)}
    ${row('Pojistná doba', `od ${formatDate(input.startDate)}${r.insuredEnd ? ` do ${formatDate(r.insuredEnd)}` : ' (na dobu neurčitou)'}`)}
    ${row('Frekvence placení', r.paymentFrequency)}
  </tbody></table>

  <h2>Doporučení pojistného produktu</h2>
  ${
    input.offers && input.offers.length > 0
      ? `<h3>Navrhovaná řešení</h3>
  <table class="offers"><thead><tr>
    <th>Pojišťovna</th><th>Produkt</th><th class="r">Pojistné (ročně)</th><th class="c">Doporučeno</th><th class="c">Volba zákazníka</th>
  </tr></thead><tbody>
    ${input.offers
      .map(
        (o) =>
          `<tr${o.recommended ? ' class="rec"' : ''}><td>${esc(o.insurer)}</td><td>${esc(
            o.product,
          )}</td><td class="r">${esc(o.priceLabel)}</td><td class="c">${
            o.recommended ? 'Ano' : 'Ne'
          }</td><td class="c">${o.chosen ? 'Ano' : 'Ne'}</td></tr>`,
      )
      .join('')}
  </tbody></table>
  <p class="muted" style="font-size:9px">Detailní porovnání vlastností nabídek obsahuje dokument „Detail porovnání nabídek", který je nedílnou přílohou tohoto Záznamu z jednání.</p>`
      : ''
  }
  <p><strong>Zákazníkovi byl doporučen pojistitel a produkt:</strong> ${esc(r.recommendedProduct)}</p>
  <h3>Odůvodnění</h3>
  <div class="box">${esc(r.recommendationReason || '—')}</div>

  <h2>Dopady a nesrovnalosti</h2>
  <p class="muted">Upozornění (ve smyslu § 2789 zákona č. 89/2012 Sb., občanského zákoníku) na nesrovnalosti mezi požadavky Zákazníka a nabízeným pojištěním:</p>
  <div class="box">${esc(r.hasDiscrepancies ? r.discrepancies || '—' : FALLBACK_NO_DISCREPANCIES)}</div>

  <h2>Popis dopadů sjednání / změny pojištění</h2>
  ${impacts}

  <h2>Rozhodnutí zákazníka</h2>
  <p>${decisionText}</p>
  ${r.decisionNote ? `<div class="box">${esc(r.decisionNote)}</div>` : ''}

  <h2>Závěr</h2>
  <p>Na základě údajů sdělených Zákazníkem byl vyhotoven tento záznam z jednání. Zákazník podpisem záznamu, či jinou Zprostředkovatelem akceptovanou autorizací prohlašuje, že:</p>
  <ul>${closingItems}</ul>
  <p class="muted">${esc(DISTANCE_NOTE)}</p>
  <p><strong>Souhlas se zasíláním informací v elektronické podobě:</strong> ${r.electronicConsent ? 'ANO' : 'NE'}${r.electronicConsent && c.email ? ` – na e-mail ${esc(c.email)}` : ''}</p>
  <p class="muted">${esc(TWO_COPIES_NOTE)}</p>
  <p><strong>Datum vystavení záznamu:</strong> ${formatDate(r.issueDate)}</p>

  <div class="sign">
    <div>${
      r.advisorSignedAt
        ? `Dne ${formatDate(r.advisorSignedAt)} podepsal ${esc(r.advisorSignedName)}<br/><span style="color:#888">zprostředkovatel (digitální podpis)</span>`
        : 'Zprostředkovatel'
    }</div>
    <div>${
      r.clientSigned
        ? `Podepsáno ověřením v ${r.clientSignMethod === 'sms' ? 'SMS na číslo' : 'e-mailu'} ${esc(
            r.clientSignContact,
          )}<br/><span style="color:#888">dne ${formatDate(r.clientSignedAt)}</span>`
        : 'Zákazník'
    }</div>
  </div>

  <div class="footer">
    <span>${esc(INTERMEDIARY.companyName)}</span>
    <span>Číslo verze dokumentu: ${esc(INTERMEDIARY.documentVersion)}</span>
  </div>
</body></html>`;
}

/** Otevře záznam v novém okně a spustí tiskový dialog (uložit jako PDF). */
export function openRecordPdf(data: RecordData): void {
  const html = buildRecordHtml(data);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}
