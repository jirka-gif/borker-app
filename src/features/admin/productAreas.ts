/**
 * Produktové oblasti jednotlivých pojišťoven (referenční přehled pro CRM/admin).
 * Klíč = id pojišťovny z mockData. Každá oblast má kategorii a volitelný popis.
 */

export interface ProductArea {
  category: string;
  detail?: string;
}

export const INSURER_PRODUCT_AREAS: Record<string, ProductArea[]> = {
  ins_allianz: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, skla, asistence, úraz, GAP, flotily' },
    { category: 'MAJETEK', detail: 'nemovitost, domácnost, odpovědnost, bytové domy' },
    { category: 'ŽIVOT', detail: 'rizikové životní, úraz, invalidita, závažná onemocnění, pracovní neschopnost' },
    { category: 'CESTOVNÍ', detail: 'krátkodobé, celoroční, storno' },
    { category: 'SME/CORPORATE', detail: 'podnikatelé, průmysl, odpovědnost, majetek, flotily' },
  ],
  ins_koop: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, flotily, skla, asistence' },
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, odpovědnost, bytové domy, obce' },
    { category: 'ŽIVOT', detail: 'životní, úrazové, dětské, invalidita, nemoci' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, zemědělství, odpovědnost, stroje, elektronika' },
    { category: 'CORPORATE', detail: 'průmyslová rizika' },
  ],
  ins_generali: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, flotily, GAP, asistence' },
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, odpovědnost, bytové domy' },
    { category: 'ŽIVOT', detail: 'životní, úrazové, invalidita, závažné nemoci, pracovní neschopnost' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, majetek, odpovědnost, kyber' },
    { category: 'CORPORATE', detail: 'průmysl, flotily, special risks' },
  ],
  ins_cpp: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, flotily, skla, asistence' },
    { category: 'MAJETEK', detail: 'nemovitost, domácnost, odpovědnost' },
    { category: 'ŽIVOT/ÚRAZ', detail: 'úrazové, rizikové složky' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, odpovědnost, majetek, vozidla' },
  ],
  ins_csob: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, asistence' },
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, odpovědnost, bytové domy' },
    { category: 'ŽIVOT', detail: 'životní, invalidita, závažné nemoci, úraz, pracovní neschopnost' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, odpovědnost, majetek' },
  ],
  ins_direct: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, skla, asistence' },
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, odpovědnost' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, odpovědnost, majetek, flotily podle distribučního modelu' },
  ],
  ins_uniqa: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, flotily, asistence' },
    { category: 'MAJETEK', detail: 'nemovitost, domácnost, odpovědnost' },
    { category: 'ŽIVOT', detail: 'životní, úrazové, invalidita, závažná onemocnění, investiční složky' },
    { category: 'CESTOVNÍ' },
    { category: 'ZDRAVOTNÍ', detail: 'zdravotní připojištění / cizinci podle nabídky' },
    { category: 'SME/CORPORATE', detail: 'podnikatelé, odpovědnost, majetek, zaměstnanecké benefity' },
  ],
  ins_slavia: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, asistence' },
    { category: 'MAJETEK', detail: 'nemovitost, domácnost, odpovědnost' },
    { category: 'CESTOVNÍ' },
    { category: 'SME', detail: 'podnikatelé, odpovědnost, majetek, speciální rizika' },
  ],
  ins_pillow: [
    { category: 'AUTO', detail: 'povinné ručení, havarijní, asistence, skla' },
    { category: 'ŽIVOT', detail: 'rizikové životní, dlouhodobá péče / vybraná rizika podle aktuální nabídky' },
  ],
  ins_simplea: [
    { category: 'ŽIVOT', detail: 'rizikové životní, smrt, invalidita, závažná onemocnění, pracovní neschopnost, úraz, hospitalizace, dětská rizika' },
  ],
  ins_youplus: [
    { category: 'ŽIVOT', detail: 'rizikové životní, úraz, invalidita, závažná onemocnění, pracovní neschopnost, hospitalizace, dětské pojištění, příp. investiční/rezervotvorné varianty' },
  ],
  ins_nn: [
    { category: 'ŽIVOT', detail: 'životní pojištění, rizikové složky, invalidita, závažná onemocnění, úraz, pracovní neschopnost' },
    { category: 'INVEST/RETIREMENT', detail: 'investiční/penzijní vazby podle skupiny a distribuce' },
  ],
  ins_kompoj: [
    { category: 'ŽIVOT', detail: 'životní pojištění, rizikové životní, investiční životní, úvěrové životní pojištění' },
    { category: 'BENEFITY', detail: 'zaměstnanecké/kolektivní programy' },
  ],
  ins_metlife: [
    { category: 'ŽIVOT/ÚRAZ', detail: 'životní pojištění, úrazové pojištění, invalidita, závažná onemocnění, hospitalizace' },
    { category: 'BENEFITY', detail: 'zaměstnanecké a skupinové programy' },
  ],
  ins_cardif: [
    { category: 'EMBEDDED/ÚVĚRY', detail: 'pojištění schopnosti splácet, pojištění úvěru, kreditní karty, leasing, spotřebitelské financování' },
    { category: 'RETAIL', detail: 'prodloužená záruka, ochrana nákupu, ztráta zaměstnání, neschopnost splácet' },
  ],
  ins_vzp: [
    { category: 'CESTOVNÍ', detail: 'krátkodobé, celoroční, léčebné výlohy, storno' },
    { category: 'ZDRAVOTNÍ/CIZINCI', detail: 'zdravotní pojištění cizinců' },
    { category: 'MAJETEK/ODPOVĚDNOST', detail: 'vybrané retail produkty podle aktuální nabídky' },
  ],
  ins_erv: [
    { category: 'CESTOVNÍ', detail: 'krátkodobé, celoroční, storno, léčebné výlohy, zavazadla, odpovědnost, sportovní rizika' },
    { category: 'CORPORATE', detail: 'služební cesty, cestovní programy pro firmy' },
  ],
  ins_maxima: [
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, odpovědnost' },
    { category: 'CESTOVNÍ' },
    { category: 'ZDRAVOTNÍ/CIZINCI' },
    { category: 'EMBEDDED', detail: 'retail/partner produkty podle distribuce' },
  ],
  ins_hvp: [
    { category: 'MAJETEK', detail: 'domácnost, nemovitost, obce, bytové domy' },
    { category: 'AUTO', detail: 'povinné ručení, havarijní dle nabídky' },
    { category: 'ODPOVĚDNOST' },
    { category: 'SME', detail: 'podnikatelé, majetek, odpovědnost' },
  ],
  ins_halali: [
    { category: 'SPECIAL', detail: 'myslivecké pojištění, odpovědnost myslivců, majetek mysliveckých organizací, úrazové krytí' },
  ],
  ins_colonnade: [
    { category: 'SPECIAL/CORPORATE', detail: 'profesní odpovědnost, D&O, kyber, majetek firem, odpovědnost, accident & health, cestovní, affinity/embedded programy' },
  ],
  ins_chubb: [
    { category: 'CORPORATE/SPECIAL', detail: 'D&O, kyber, profesní odpovědnost, majetek, odpovědnost, accident & health, travel, affinity/embedded, multinational programy' },
  ],
  ins_atradius: [
    { category: 'KREDITNÍ', detail: 'pojištění pohledávek, trade credit insurance, řízení kreditního rizika, inkaso/pohledávkové služby' },
  ],
  ins_credendo: [
    { category: 'KREDITNÍ/EXPORT', detail: 'krátkodobé úvěrové pojištění, obchodní úvěry, exportní rizika, politická/komerční rizika' },
  ],
  ins_egap: [
    { category: 'EXPORT/SPECIAL', detail: 'státem podporované exportní úvěrové pojištění, politická rizika, komerční rizika, investice v zahraničí, záruky/exportní financování' },
  ],
  ins_union: [
    { category: 'CESTOVNÍ', detail: 'cestovní pojištění, zdravotní krytí v zahraničí, storno / asistence podle aktuální nabídky' },
  ],
  ins_ipa: [
    { category: 'ASISTENČNÍ/SPECIAL', detail: 'cestovní asistence, technická asistence, právní/asistenční služby, embedded asistenční programy' },
  ],
  ins_sv: [
    { category: 'SPECIAL/SME', detail: 'samostatný pojistitel – produkt dle aktuální licence a smlouvy (doporučeno nevyplňovat bez produktových listů)' },
  ],
};
