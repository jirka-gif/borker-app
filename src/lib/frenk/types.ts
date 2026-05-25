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

/* --- Vstupní enumy (car) --- */
export type FrequencyEnum = 'single' | 'annually' | 'monthly' | 'quarterly' | 'semiannually';
export type PaymentTypeEnum = 'card' | 'transfer' | 'cash';
export type PersonTypeEnum = 'physical' | 'legal' | 'businessman' | 'foreigner';
export type FuelTypeEnum =
  | 'benzine'
  | 'diesel'
  | 'lpg'
  | 'cng'
  | 'electricity'
  | 'hybrid_diesel'
  | 'hybrid_benzine'
  | 'benzine_lpg'
  | 'other';

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
    usage: 'normal';
    type?: 'passenger';
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
  };
  liability: { selected: boolean; liabilityLimit: number };
  accident: {
    selected: boolean;
    complicityType?: number;
    assistance?: string;
    securityItems?: string[];
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
}

/** Odpověď: klíčem je apiEnum (např. "insurance-car-csob"). */
export interface CarCalculateResponse {
  insurances: Record<string, FrenkInsuranceResult>;
}
