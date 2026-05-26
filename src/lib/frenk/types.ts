/**
 * Typy pro Frenk API (apicore) – BFF agregátor pojišťoven na https://api.frenkee.cz.
 * Odvozeno z OpenAPI (src/Api/Doc/openapi.yaml). Záměrně pragmatické – pokrývá
 * auth + linku „car"; další linky se přidají stejným vzorem.
 */

/* --- Auth --- */
export interface FrenkLoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface FrenkRefreshResponse {
  access_token: string;
}

/* --- apiEnums (dispatch na pojišťovny) --- */
export type CarApiEnum =
  | 'insurance-car-direct'
  | 'insurance-car-slavia'
  | 'insurance-car-pillow'
  | 'insurance-car-csob'
  | 'insurance-car-uniqa'
  | 'insurance-car-pvzp'
  | 'insurance-car-generali'
  | 'insurance-car-kooperativa'
  | 'insurance-car-cpp'
  | 'insurance-car-allianz';

/* --- Vstupní enumy (car) – zdroj pravdy: src/Api/Action/Insurance/Car/Enums v frenk.api --- */
export type FrequencyEnum = 'single' | 'annually' | 'monthly' | 'quarterly' | 'semiannually';
export type PaymentTypeEnum = 'card' | 'transfer' | 'cash';
export type PersonTypeEnum = 'physical' | 'legal' | 'businessman' | 'foreigner';

export type CarTypeEnum =
  | 'passenger'
  | 'truckTo3500kg'
  | 'truckOver3500kg'
  | 'motorcycle'
  | 'bus'
  | 'trailer';

export type FuelTypeEnum =
  | 'benzine'
  | 'diesel'
  | 'lpg'
  | 'cng'
  | 'electricity'
  | 'hybrid_diesel'
  | 'hybrid_benzine'
  | 'hybrid_hydrogenium'
  | 'benzine_lpg'
  | 'diesel_lpg'
  | 'benzine_cng'
  | 'diesel_cng'
  | 'hydrogenium'
  | 'other';

export type CarUsageEnum =
  | 'normal'
  | 'commercial'
  | 'taxi'
  | 'drive_school'
  | 'rental'
  | 'agriculture';

export type UsePurposeEnum =
  | 'private'
  | 'person'
  | 'business'
  | 'other'
  | 'priority_car'
  | 'ambulance'
  | 'international'
  | 'school'
  | 'historical'
  | 'dangerous_cargo'
  | 'competition'
  | 'transport';

export type AssistanceLevelEnum = 'none' | 'S' | 'M' | 'L' | 'XL';

export type SecurityItemEnum =
  | 'alarm'
  | 'immobiliser'
  | 'active_search'
  | 'passive_search'
  | 'mechanic_security'
  | 'window_sign';

/* --- Car calculate input --- */
export interface FrenkAddress {
  street: string;
  city: string;
  houseNumber: string;
  zip: string;
  country: string;
  wholeAddress: string;
}

export interface FrenkPerson {
  type: PersonTypeEnum;
  firstName?: string;
  lastName?: string;
  birthNumber?: string;
  address: FrenkAddress;
  email?: string;
  phone?: string;
}

export interface CarCalculateInput {
  apiEnums: CarApiEnum[];
  beginDate: string; // YYYY-MM-DD
  endDate?: string;
  payment?: { frequency?: FrequencyEnum; paymentType?: PaymentTypeEnum };
  vehicle: {
    usage: CarUsageEnum;
    type?: CarTypeEnum;
    fuelType: FuelTypeEnum;
    spz?: string;
    brand: string;
    model: string;
    engineCapacityCc: number;
    enginePowerKw: number;
    countPlace?: number;
    maxWeight: number;
    mileageKm?: number;
    leadingDate?: string;
    actualValue?: number;
    vin?: string;
    registrationCertificate?: string;
    expectedKm?: number | null;
    withoutVAT?: boolean | null;
    usePurpose?: UsePurposeEnum;
  };
  liability: { selected: boolean; liabilityLimit: number };
  accident: {
    selected: boolean;
    complicityType?: number;
    assistance?: AssistanceLevelEnum;
    securityItems?: SecurityItemEnum[];
    participation?: string | null;
  };
  policyholder: FrenkPerson;
  owner?: FrenkPerson | null;
}

/* --- Car calculate output --- */
export interface FrenkPackage {
  name: string;
  code: string;
  price: number;
}

export interface FrenkDocument {
  name: string;
  url: string;
  contentType?: string;
  documentType?: string | null;
}

export interface FrenkInsuranceResult {
  price: number;
  priceAfterSale: number;
  packages: FrenkPackage[];
  documents?: FrenkDocument[] | null;
  bundledProduct?: boolean | null;
  bundleIncludes?: string[] | null;
  warnings?: Record<string, string> | null;
}

/** Strukturovaná chyba z `errors[]` (skutečná hláška, případně dotčená pole). */
export interface FrenkErrorDetail {
  message?: string | null;
  fields?: Array<string | null>;
}

/** Když carrier kalkulaci nevrátí, přijde pod jeho klíčem tento chybový tvar. */
export interface FrenkInsuranceError {
  error: number;
  message: string;
  errors?: FrenkErrorDetail[] | unknown[];
}

export type FrenkInsuranceEntry = FrenkInsuranceResult | FrenkInsuranceError;

/** Rozliší úspěšnou nabídku od chybové. */
export function isFrenkError(entry: FrenkInsuranceEntry): entry is FrenkInsuranceError {
  return typeof (entry as FrenkInsuranceError)?.error === 'number';
}

/** Odpověď: klíčem je apiEnum (např. "insurance-car-csob"). */
export interface CarCalculateResponse {
  insurances: Record<string, FrenkInsuranceEntry>;
}
