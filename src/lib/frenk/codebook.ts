/**
 * Číselníky pro UI – odráží oficiální enums z frenk.api.
 * Až vznikne dedikovaný endpoint `GET /api/codebook/car`, můžeme to přepnout
 * na fetch a tenhle modul jen sjednotí pole + lokalizované popisky.
 */

import type {
  AssistanceLevelEnum,
  CarTypeEnum,
  CarUsageEnum,
  FrequencyEnum,
  FuelTypeEnum,
  PaymentTypeEnum,
  PersonTypeEnum,
  SecurityItemEnum,
  UsePurposeEnum,
} from './types';

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const CAR_TYPE_OPTIONS: Option<CarTypeEnum>[] = [
  { value: 'passenger', label: 'Osobní' },
  { value: 'truckTo3500kg', label: 'Nákladní do 3 500 kg' },
  { value: 'truckOver3500kg', label: 'Nákladní nad 3 500 kg' },
  { value: 'motorcycle', label: 'Motocykl' },
  { value: 'bus', label: 'Autobus' },
  { value: 'trailer', label: 'Přívěs' },
];

export const FUEL_TYPE_OPTIONS: Option<FuelTypeEnum>[] = [
  { value: 'benzine', label: 'Benzín' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'lpg', label: 'LPG' },
  { value: 'cng', label: 'CNG' },
  { value: 'electricity', label: 'Elektřina' },
  { value: 'hybrid_diesel', label: 'Hybrid – diesel' },
  { value: 'hybrid_benzine', label: 'Hybrid – benzín' },
  { value: 'hybrid_hydrogenium', label: 'Hybrid – vodík' },
  { value: 'benzine_lpg', label: 'Benzín + LPG' },
  { value: 'diesel_lpg', label: 'Diesel + LPG' },
  { value: 'benzine_cng', label: 'Benzín + CNG' },
  { value: 'diesel_cng', label: 'Diesel + CNG' },
  { value: 'hydrogenium', label: 'Vodík' },
  { value: 'other', label: 'Jiné' },
];

export const CAR_USAGE_OPTIONS: Option<CarUsageEnum>[] = [
  { value: 'normal', label: 'Běžný provoz' },
  { value: 'commercial', label: 'Komerční přeprava' },
  { value: 'taxi', label: 'Taxislužba' },
  { value: 'drive_school', label: 'Autoškola' },
  { value: 'rental', label: 'Půjčovna' },
  { value: 'agriculture', label: 'Zemědělství' },
];

export const USE_PURPOSE_OPTIONS: Option<UsePurposeEnum>[] = [
  { value: 'private', label: 'Soukromé' },
  { value: 'person', label: 'Osobní' },
  { value: 'business', label: 'Podnikatelské' },
  { value: 'other', label: 'Jiné' },
  { value: 'priority_car', label: 'Vozidlo s právem přednosti' },
  { value: 'ambulance', label: 'Ambulance / záchranná služba' },
  { value: 'international', label: 'Mezinárodní doprava' },
  { value: 'school', label: 'Autoškola' },
  { value: 'historical', label: 'Historické vozidlo' },
  { value: 'dangerous_cargo', label: 'Nebezpečný náklad' },
  { value: 'competition', label: 'Závodní vozidlo' },
  { value: 'transport', label: 'Přeprava osob' },
];

export const FREQUENCY_OPTIONS: Option<FrequencyEnum>[] = [
  { value: 'annually', label: 'Roční' },
  { value: 'semiannually', label: 'Pololetní' },
  { value: 'quarterly', label: 'Čtvrtletní' },
  { value: 'monthly', label: 'Měsíční' },
  { value: 'single', label: 'Jednorázově' },
];

export const PAYMENT_TYPE_OPTIONS: Option<PaymentTypeEnum>[] = [
  { value: 'card', label: 'Platební karta' },
  { value: 'transfer', label: 'Bankovní převod' },
  { value: 'cash', label: 'Hotovost' },
];

export const PERSON_TYPE_OPTIONS: Option<PersonTypeEnum>[] = [
  { value: 'physical', label: 'Fyzická osoba' },
  { value: 'businessman', label: 'Fyzická osoba podnikatel' },
  { value: 'legal', label: 'Právnická osoba' },
  { value: 'foreigner', label: 'Cizinec' },
];

export const ASSISTANCE_LEVEL_OPTIONS: Option<AssistanceLevelEnum>[] = [
  { value: 'none', label: 'Bez asistence' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export const SECURITY_ITEM_OPTIONS: Option<SecurityItemEnum>[] = [
  { value: 'alarm', label: 'Alarm' },
  { value: 'immobiliser', label: 'Imobilizér' },
  { value: 'active_search', label: 'Aktivní vyhledávání' },
  { value: 'passive_search', label: 'Pasivní vyhledávání' },
  { value: 'mechanic_security', label: 'Mechanické zabezpečení' },
  { value: 'window_sign', label: 'Pískování oken' },
];
