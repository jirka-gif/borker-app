/**
 * Mock integrace na externí registry. Rozhraní je připravené tak, aby se dalo
 * nahradit reálným voláním API (ARES, ČNB/JERS) bez změny volajícího kódu.
 */

export interface AresResult {
  ico: string;
  name: string;
  legalForm: string;
  address: string;
  dic: string;
  createdAt: string;
  status: string;
}

export interface CnbCompanyResult {
  found: boolean;
  /** Typ subjektu dle ČNB. */
  subjectType: string;
  /** Typ oprávnění k činnosti (např. „Registrace"). */
  authorizationType: string;
  registrationNumber: string;
  /** Datum oprávnění k činnosti. */
  validFrom: string;
  /** Doba trvání oprávnění. */
  validUntil: string;
  active: boolean;
  /** Povolené činnosti = skupiny odbornosti (id 1–7). */
  expertiseGroups: number[];
  /** Přeshraniční služby (kódy zemí). */
  crossBorder: string[];
  /** Pokuty a sankce. */
  sanctions: string;
  /** Související vazby (počty). */
  related: {
    responsiblePersons: number;
    vazaniZastupci: number;
    pojistovny: number;
    pobocky: number;
    /** Id pojišťoven, se kterými má subjekt vazbu (dle registru). */
    insurerIds: string[];
  };
}

export interface CnbPersonResult {
  found: boolean;
  registrationNumber: string;
  authorizationType: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pseudonáhodná, ale deterministická data podle IČO (pro demo). */
function pseudoFromIco(ico: string): string {
  let h = 0;
  for (const ch of ico) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return String(h);
}

/** Mock dotaz do ARES – v reálu GET https://ares.gov.cz/.../ekonomicke-subjekty/{ico} */
export async function aresLookup(ico: string): Promise<AresResult> {
  await delay(700);
  const clean = ico.replace(/\D/g, '');
  if (clean.length < 6) throw new Error('Neplatné IČO.');
  const seed = pseudoFromIco(clean);
  const names = ['Makléřská kancelář', 'Pojišťovací poradenství', 'Finanční služby', 'Insurance Group'];
  const cities = ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Olomouc'];
  const name = `${names[Number(seed) % names.length]} ${clean.slice(0, 4)} s.r.o.`;
  return {
    ico: clean,
    name,
    legalForm: 'Společnost s ručením omezeným',
    address: `Hlavní ${(Number(seed) % 200) + 1}, ${cities[Number(seed) % cities.length]}`,
    dic: `CZ${clean.padEnd(8, '0').slice(0, 8)}`,
    createdAt: `20${10 + (Number(seed) % 14)}-0${1 + (Number(seed) % 9)}-15`,
    status: 'Aktivní',
  };
}

/** Mock ověření firmy v registru ČNB / JERS – vrací plný profil subjektu. */
export async function cnbVerifyCompany(ico: string, _name: string): Promise<CnbCompanyResult> {
  await delay(700);
  const clean = ico.replace(/\D/g, '');
  const found = clean.length >= 6;
  const seed = Number(pseudoFromIco(clean));
  const year = 2017 + (seed % 8);
  return {
    found,
    subjectType: found ? 'Samostatný zprostředkovatel dle zákona o distribuci pojištění a zajištění' : '',
    authorizationType: found ? 'Registrace' : '',
    registrationNumber: found ? `${String(seed).slice(0, 6)}PA` : '',
    validFrom: found ? `${year}-0${1 + (seed % 9)}-12` : '',
    validUntil: found ? '2026-12-31' : '',
    active: found,
    expertiseGroups: found ? [1, 2, 3, 4, 5] : [],
    crossBorder: found ? ['PL', 'SK'] : [],
    sanctions: found ? 'bez záznamu' : '',
    related: found
      ? {
          responsiblePersons: 1,
          vazaniZastupci: 2,
          pojistovny: 12,
          pobocky: 4,
          insurerIds: [
            'ins_allianz',
            'ins_cpp',
            'ins_csob',
            'ins_direct',
            'ins_generali',
            'ins_kompoj',
            'ins_koop',
            'ins_pillow',
            'ins_vzp',
            'ins_slavia',
            'ins_sv',
            'ins_uniqa',
          ],
        }
      : { responsiblePersons: 0, vazaniZastupci: 0, pojistovny: 0, pobocky: 0, insurerIds: [] },
  };
}

/** Mock ověření osoby v registru ČNB / JERS. */
export async function cnbVerifyPerson(
  firstName: string,
  lastName: string,
  registrationNumber: string,
): Promise<CnbPersonResult> {
  await delay(600);
  const found = Boolean(lastName && (registrationNumber || firstName));
  return {
    found,
    registrationNumber: registrationNumber || (found ? `${pseudoFromIco(lastName).slice(0, 6)}VZ` : ''),
    authorizationType: found ? 'Zápis do registru' : '',
    validFrom: found ? '2025-04-02' : '',
    validUntil: found ? '2026-12-31' : '',
    active: found,
  };
}
