/**
 * Generátor návrhů textů pro „Záznam z jednání". Simuluje AI asistenta –
 * v reálu by se napojil na jazykový model; zde vrací kontextově sestavené
 * návrhy z dat kalkulačky (produkt, rozsah, cena).
 */
import type { SuggestContext } from './types';

export type SuggestField =
  | 'otherNeeds'
  | 'insuredInterest'
  | 'recommendationReason'
  | 'discrepancies'
  | 'decisionNote';

const GENERATORS: Record<SuggestField, (ctx: SuggestContext) => string[]> = {
  otherNeeds: (ctx) => [
    `Zákazník požaduje ${ctx.productName.toLowerCase()} s důrazem na odpovídající rozsah krytí (${ctx.scopeSummary}). Klade důraz na jistotu a kvalitu krytí před nejnižší cenou.`,
    `Hlavním cílem zákazníka je dostatečná ochrana odpovídající jeho situaci. Preferuje navržený rozsah (${ctx.scopeSummary}) a srozumitelné podmínky.`,
    `Zákazník vyhledává spolehlivé ${ctx.productName.toLowerCase()} odpovídající jeho potřebám. Zvolený rozsah (${ctx.scopeSummary}) odpovídá jeho životní situaci a míře rizika.`,
  ],
  insuredInterest: (ctx) => [
    `Zákazník má pojistný zájem na ochraně před finančními dopady pojistné události související s předmětem pojištění. Vznik škodní události by pro něj znamenal přímou majetkovou ztrátu.`,
    `Pojistný zájem vyplývá z možnosti vzniku škody či újmy, jejíž náhrada by zatížila majetek zákazníka. Sjednáním ${ctx.productName.toLowerCase()} se před tímto rizikem chrání.`,
    `Zákazník prokazuje pojistný zájem tím, že mu v případě pojistné události hrozí přímá majetková ztráta, kterou navrženým pojištěním pokrývá.`,
  ],
  recommendationReason: (ctx) => [
    `Produkt „${ctx.recommendedProduct}" byl doporučen, protože svým rozsahem (${ctx.scopeSummary}) plně odpovídá zjištěným potřebám, požadavkům a pojistnému zájmu zákazníka${ctx.totalLabel ? ` při ceně ${ctx.totalLabel}` : ''}.`,
    `Doporučení vychází z poměru rozsahu krytí a ceny. Navržené řešení (${ctx.scopeSummary}) je v souladu s cílovým trhem zákazníka a odpovídá jeho požadavkům.`,
    `Vzhledem k požadavkům zákazníka na komplexní krytí byl vybrán produkt „${ctx.recommendedProduct}". Sjednaný rozsah (${ctx.scopeSummary}) odpovídá rizikovému profilu i finančním možnostem zákazníka.`,
  ],
  discrepancies: () => [
    'Mezi požadavky zákazníka a nabízeným pojištěním nebyly zjištěny zásadní nesrovnalosti. Zákazník byl upozorněn na výluky a limity plnění uvedené v pojistných podmínkách.',
    'Drobná nesrovnalost: zákazník původně zvažoval užší rozsah, byl však upozorněn, že nemusí pokrýt všechna relevantní rizika. Po vysvětlení zvolil navržený rozsah.',
    'Zákazník byl upozorněn, že pojištění se nevztahuje na škody způsobené úmyslně a na vybrané výluky dle pojistných podmínek. S tímto omezením byl srozuměn.',
  ],
  decisionNote: (ctx) => [
    `Zákazník se po vysvětlení rozsahu a podmínek rozhodl uzavřít „${ctx.recommendedProduct}". Rozhodnutí učinil svobodně a bez nátlaku.`,
    `Zákazník zvolil doporučené řešení, neboť nejlépe odpovídá jeho potřebám a pojistnému zájmu${ctx.totalLabel ? ` při přijatelné ceně ${ctx.totalLabel}` : ''}.`,
    `Po zvážení nabídky se zákazník rozhodl pro sjednání pojištění v navrženém rozsahu. Byl seznámen s obsahem, výlukami i výší pojistného a se sjednáním souhlasí.`,
  ],
};

export function suggestField(field: SuggestField, ctx: SuggestContext, variant: number): string {
  const variants = GENERATORS[field](ctx);
  return variants[variant % variants.length];
}
