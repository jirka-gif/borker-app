/**
 * BFF proxy: výpočet nabídek pojištění vozidel přes Frenk API (apicore).
 * Prohlížeč volá tento endpoint (stejná doména), server přidá JWT a zavolá
 * https://api.frenkee.cz/api/insurance/car/calculate.
 *
 * V reálu se sem doplní validace vstupu (zod) a apiEnums se poskládají
 * z pojišťoven, které má přihlášená firma zapnuté (admin sekce „Pojišťovny").
 */

import { NextResponse } from 'next/server';
import { calculateCar } from '@/lib/frenk/insurance';
import { FrenkError } from '@/lib/frenk/client';
import type { CarCalculateInput } from '@/lib/frenk/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let input: CarCalculateInput;
  try {
    input = (await request.json()) as CarCalculateInput;
  } catch {
    return NextResponse.json({ error: 'Neplatné tělo požadavku.' }, { status: 400 });
  }

  if (!input?.apiEnums?.length) {
    return NextResponse.json({ error: 'Chybí apiEnums (výběr pojišťoven).' }, { status: 400 });
  }

  try {
    const data = await calculateCar(input);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof FrenkError) {
      return NextResponse.json(
        { error: err.message, detail: err.body },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json({ error: 'Výpočet selhal.' }, { status: 502 });
  }
}
