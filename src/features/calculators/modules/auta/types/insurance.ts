export type PolicyholderType = 'person' | 'selfEmployed' | 'company' | 'foreigner';

export type EntityRole = 'policyholder' | 'holder' | 'owner';

export type VehicleUsage = 'normal' | 'commercial';

export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng';

export type VehicleType = 'passenger' | 'commercial' | 'motorcycle' | 'trailer';

export type RegistrationType = 'permanent' | 'temporary';

export type PriceSource = 'invoice' | 'valuation' | 'policyholder';

export type VehicleOrigin = 'cz' | 'abroad';

export interface PersonFormData {
  birthNumber?: string;
  birthDate?: string;
  noBirthNumber?: boolean;
  titleBefore?: string;
  firstName: string;
  lastName: string;
  titleAfter?: string;
  address: string;
  hasDifferentCorrespondenceAddress?: boolean;
  correspondenceAddress?: string;
  phone: string;
  email?: string;
  consentElectronicCommunication: boolean;
  consentMarketingCommunication: boolean;
  consentDataProcessing: boolean;
  ico?: string;
}

export interface CompanyFormData {
  ico: string;
  companyName: string;
  representative: {
    position?: string;
    titleBefore?: string;
    firstName: string;
    lastName: string;
    titleAfter?: string;
    birthNumber?: string;
    birthDate?: string;
    noBirthNumber?: boolean;
  };
  address: string;
  hasDifferentCorrespondenceAddress?: boolean;
  correspondenceAddress?: string;
  phone: string;
  email?: string;
  consentElectronicCommunication: boolean;
  consentMarketingCommunication: boolean;
  consentDataProcessing: boolean;
  meetsLargeCompanyCriteria: boolean;
}

export interface PolicyholderData {
  type: PolicyholderType;
  person?: PersonFormData;
  company?: CompanyFormData;
  selfEmployed?: PersonFormData;
  foreigner?: PersonFormData;
}

export interface HolderData {
  sameAsPolicyholder: boolean;
  entity?: PersonFormData | CompanyFormData;
}

export interface OwnerData {
  type: 'sameAsPolicyholder' | 'sameAsHolder' | 'other';
  note?: string;
}

export interface VehicleData {
  plateNumber?: string;
  vin?: string;
  registrationType: RegistrationType;
  vehicleType: VehicleType;
  fuelType: FuelType;
  brand: string;
  model: string;
  usage: VehicleUsage;
  engineCapacity: number;
  maxPower: number;
  maxPermittedWeight: number;
  origin: VehicleOrigin;
  seatCount: number;
  firstRegistrationDate: string;
  purchaseDate: string;
  odometer: number;
  annualMileage: number;
  priceSource: PriceSource;
  vehiclePrice: number;
  priceWithVat: boolean;
  equipment: {
    parkingAssistant: boolean;
    automaticTransmission: boolean;
    fourWheelDrive: boolean;
    panoramicRoof: boolean;
  };
  hasExistingDamage: boolean;
  existingDamageDescription?: string;
}

export interface InsuranceData {
  startDate: string;
  contractReplacement: boolean;
  contractNumber?: string;
  insurer?: string;
}

export interface VehicleInsuranceBasicDataForm {
  insurance: InsuranceData;
  policyholder: PolicyholderData;
  holder: HolderData;
  owner: OwnerData;
  vehicle: VehicleData;
}

// Types for Step 2 - Additional Insurance and Discounts
export type MandatoryInsuranceLimit = 'none' | '50_50' | '50_60' | '70_70' | '100_100' | '150_150' | '200_200' | '300_300';

export type CascoInsuranceType = 'none' | 'allRisk';

export type CoverageScope = 'allRisk' | 'allGlass' | string;

export type DeductibleType = 'percentage' | 'fixed';

export interface MandatoryInsuranceData {
  limit: MandatoryInsuranceLimit;
}

export interface CascoInsuranceData {
  type: CascoInsuranceType;
  scope?: CoverageScope;
  deductibleType?: DeductibleType;
  deductibleValue?: string;
}

export interface AdditionalInsuranceItem {
  scope: CoverageScope;
  limit?: string;
  deductible?: string;
}

export interface AdditionalInsuranceData {
  items: AdditionalInsuranceItem[];
  checkboxes?: {
    [key: string]: boolean;
  };
}

export interface VehicleInsuranceAdditionalForm {
  mandatoryInsurance: MandatoryInsuranceData;
  cascoInsurance: CascoInsuranceData;
  additionalInsurance: AdditionalInsuranceData;
  vehicle?: {
    priceSource?: PriceSource;
    vehiclePrice?: number;
    priceWithVat?: boolean;
  };
}

