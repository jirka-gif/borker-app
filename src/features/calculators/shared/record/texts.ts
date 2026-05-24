/**
 * Statické právní texty pro „Záznam z jednání" (§ 77 a 79 zák. č. 170/2018 Sb.,
 * ZDPZ). Produktově nezávislé. Produktově specifické dopady se předávají přes
 * `RecordInput.impactParagraphs`.
 *
 * Compliance: platforma EU pro řešení sporů (ec.europa.eu/odr) byla k srpnu
 * 2025 uzavřena → z textu o stížnostech vypuštěna. Odkazy na konkrétní web
 * zprostředkovatele se berou z configu.
 */

export const HEADER_SUBTITLE =
  've smyslu ust. § 77 a 79 zákona č. 170/2018 Sb., o distribuci pojištění a zajištění (dále též „ZDPZ")';

export const HEADER_INTRO =
  'Níže uvedené požadavky, potřeby a cíle jsou získávány pojišťovacím zprostředkovatelem za účelem vyhodnocení údajů před sjednáním nebo podstatnou změnou pojištění.';

export const CNB_NOTE =
  'Zprostředkovatel je evidován v registru samostatných zprostředkovatelů pojištění vedeném Českou národní bankou. Zápis ve zmíněném registru je možno ověřit na internetových stránkách České národní banky.';

export const BROKER_DECLARATIONS: string[] = [
  'Zprostředkovatel, vázaný zástupce a doplňkový pojišťovací zprostředkovatel nemá žádný přímý nebo nepřímý podíl na hlasovacích právech a základním kapitálu pojišťovny, se kterou má být pojištění sjednáno. Pojišťovna, se kterou má být pojištění sjednáno, ani žádná z osob danou pojišťovnu ovládající nemá přímý nebo nepřímý podíl na hlasovacích právech Zprostředkovatele, vázaného zástupce a doplňkového pojišťovacího zprostředkovatele.',
  'Zprostředkovatel potvrzuje, že svoji činnost vykonává s odbornou péčí, chrání zájmy spotřebitele, neuvádí nepravdivé, nepřesné, nedoložené, neúplné, nejasné nebo dvojsmyslné údaje a informace, nezamlčuje údaje o charakteru a vlastnostech poskytovaných služeb.',
  'Před uzavřením pojistné smlouvy je Zprostředkovatel povinen, zejména na základě informací poskytnutých zákazníkem a v závislosti na charakteru sjednávaného pojištění, zaznamenat požadavky, potřeby a cíle zákazníka související se sjednávaným pojištěním a důvody, na kterých Zprostředkovatel zakládá svá doporučení pro sjednání nebo podstatnou změnu pojištění.',
  'Zprostředkovatel je odměňován provizně pojišťovnou, u které je pojištění sjednáno, vázaný zástupce a doplňkový pojišťovací zprostředkovatel je odměňován Zprostředkovatelem. Zprostředkovatel nepřijímá odměnu hrazenou přímo zákazníkem.',
  'V případě, že zákazník (pojistník) je odlišný od pojištěného, prohlašuje, že má pojistný zájem. Tyto skutečnosti zákazník na žádost pojistitele osvědčí.',
];

export function complaintText(complaintEmail: string, web: string, complaintsUrl: string): string {
  return (
    `Bude-li zákazník (nebo jiná oprávněná osoba) s prací některého ze zaměstnanců, vázaných zástupců nebo doplňkových pojišťovacích zprostředkovatelů nespokojen, je oprávněn stěžovat si e-mailem: ${complaintEmail}, ` +
    'doporučeným dopisem adresovaným statutárnímu orgánu zaslaným na adresu sídla Zprostředkovatele, nebo orgánu dohledu nad činností pojišťovacích zprostředkovatelů, kterým je Česká národní banka (www.cnb.cz). ' +
    'V případě neživotního pojištění lze podat návrh na řešení sporu České obchodní inspekci (www.coi.cz) nebo Kanceláři ombudsmana České asociace pojišťoven (www.ombudsmancap.cz). ' +
    'V případě životního pojištění lze podat návrh na řešení sporu finančnímu arbitrovi (www.finarbitr.cz). Podáním stížnosti není dotčeno Vaše právo obrátit se na soud. ' +
    `Podrobná pravidla vyřizování stížností jsou upravena v reklamačním řádu umístěném na webových stránkách ${web}, v sekci ${complaintsUrl}.`
  );
}

export const IMPACT_PAYMENT =
  'Pojištění vzniká zaplacením prvního pojistného (pokud pojištění vzniká zaplacením). Pozdní uhrazení nebo neuhrazení pojistného může mít vliv na platnost pojistné smlouvy se všemi důsledky, které z její neplatnosti plynou. Pojištění je v souladu s cílovým trhem zákazníka.';

export const CLOSING_DECLARATIONS: string[] = [
  'všechny výše uvedené údaje jsou úplné a pravdivé, že nezamlčel žádné důležité údaje, které mu jsou nebo mohou být známy;',
  'všechny informace týkající se pojištění (mj. popis nabízených produktů včetně jejich dopadů a možných rizik) mu byly poskytnuty jasným a srozumitelným způsobem před uzavřením/změnou pojistné smlouvy a je schopen posoudit, zda navrhované pojištění odpovídá jeho potřebám, požadavkům a cílům;',
  'jeho požadavky, potřeby a cíle související se sjednávaným pojištěním jsou jasně, přesně a úplně zaznamenány;',
  'uvedené pojištění si vybral svobodně bez nátlaku, byl dostatečně seznámen s jeho obsahem, upozorněn na nepojištěné doplňky a výluky z pojištění a souhlasí s pojistnými podmínkami a výší pojistného;',
  'je si vědom toho, že údaje, které během jednání zamlčel či z jakéhokoli jiného důvodu nesdělil, nemohou být v záznamu a v následném doporučení zohledněny;',
  'převzal jednu kopii tohoto záznamu;',
  'převzal informaci o zpracování osobních údajů;',
  'pokud uvedl osobní údaje jiných osob, prohlašuje, že je k tomu oprávněn a má jejich souhlas;',
  'v rámci jednání se Zprostředkovatelem s dostatečným předstihem před sjednáním pojištění nebo jeho podstatnou změnou obdržel níže uvedené přílohy a je s nimi srozuměn.',
];

export const DISTANCE_NOTE =
  'V případě zprostředkování pojistné smlouvy distančním způsobem (tzv. prodej na dálku) dle § 1820 a násl. občanského zákoníku nemusí být tento záznam ze strany Zákazníka podepsán. Záznam z jednání je akceptován zaplacením pojistné smlouvy, ke které se tento záznam vztahuje. Zákazník má právo sdělit své připomínky či reklamace k záznamu z jednání jakýmkoliv způsobem, nejpozději však do zaplacení pojistného.';

export const TWO_COPIES_NOTE =
  'Tento dokument je vystaven ve dvou vyhotoveních, z nichž jedno náleží Zákazníkovi a jedno Zprostředkovateli.';

export const FALLBACK_NO_OTHER_NEEDS =
  'Zákazník neposkytl další informace týkající se jeho požadavků, potřeb a cílů.';

export const FALLBACK_NO_DISCREPANCIES =
  'Zákazník ani zprostředkovatel si nejsou vědomi žádných nesrovnalostí mezi požadavky Zákazníka a nabízeným pojištěním.';

export const DECISION_AGREE =
  'Rozsah pojištění odpovídá zjištěným potřebám, požadavkům a pojistnému zájmu zákazníka.';

export const DECISION_REJECT =
  'Zákazník odmítl poskytnuté doporučení Zprostředkovatele a rozhodl se pro sjednání jiného pojištění nebo jeho podstatnou změnu. Zákazník byl Zprostředkovatelem upozorněn, že požadované pojištění nebo jeho podstatná změna není pro zákazníka vhodná a z jakých důvodů. Bez ohledu na toto upozornění zákazník požaduje sjednání pojištění nebo jeho podstatnou změnu.';
