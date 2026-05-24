export interface FormData {
  // Step 1: Základní údaje
  contractReplacement: boolean
  contractNumber: string
  insuranceCompany: string
  personType: 'fyzicka' | 'pravnicka' | 'podnikatel' | 'cizinec'
  ico: string
  companyName: string
  companyPosition: string
  personalId: string
  birthDate: string
  titleBefore: string
  firstName: string
  lastName: string
  titleAfter: string
  address: string
  sameAddress: boolean
  correspondenceAddress: string
  phone: string
  email: string
  consentData: boolean
  consentElectronic: boolean
  consentMarketing: boolean
  propertyAddress: string
  notApproved: boolean
  postalCode: string
  municipality: string
  cadastralArea: string
  parcelNumber: string
  parcelType: 'stavebni' | 'pozemkova' | 'nema-typ' | ''
  propertyRelation: 'vlastnik' | 'najemce'
  propertyRented: boolean
  propertyType: 'byt' | 'dum' | 'chata'
  ownershipType: 'osobni' | 'druzstevni' | ''
  goodCondition: boolean

  // Step 2: Detail nemovitosti
  insuranceType: 'stavba' | 'domacnost'
  insuranceStavba: boolean
  insuranceDomacnost: boolean
  apartmentLayout: string
  apartmentLocation: 'rodinny-dum' | 'bytovy-dum' | ''
  floorArea: string
  apartmentNumber: string
  // Pro Dům (house)
  totalBuiltArea: string
  totalUsableArea: string
  inhabitedAttic: boolean
  roofType: 'sikma' | 'rovna' | ''
  houseConstruction: string
  floors: 'jedno' | 'vice' | ''
  materialQuality: string
  cellarPercentage: 'none' | '25' | '50' | '75' | '100' | ''
  ancillaryBuildings: number
  apartmentConstruction: 'panel' | 'cihla' | 'drevo' | ''
  higherFloor: boolean
  apartmentQuality: 'standard' | 'nadstandard' | ''
  apartmentCondition: 'dobry' | 'po-rekonstrukci' | 'potrebuje-rekonstrukci' | ''
  hasBalconyOrTerrace: boolean
  hasBalcony: boolean
  balconyArea: string
  hasTerrace: boolean
  terraceArea: string
  garageParking: boolean
  hasElevator: boolean
  parkingSpace: boolean
  propertyValue: number
  householdValue: number
  specialValueItems: number
  equipmentAndFixedItems: number
  nonResidentialItems: number

  // Step 3: Kalkulace
  insuranceStartDate: string
  paymentFrequency: 'ročně' | 'pololetně' | 'čtvrtletně' | 'měsíčně'
  selectedOffer: InsuranceOffer | null

  // Step 4: Shrnutí
  contractMethod: 'telefon' | 'email' | ''
  meetingDiscrepancies: string
  recommendationReasons: string[]
  impactDescription: string[]
  clientRefusesRequirements: 'ne' | 'ano' | ''
  clientHasOtherContract: 'ne' | 'ano' | ''
  noDiscrepanciesAware: boolean
  meetingPlace: string
  contractType: 'nova' | 'nahrada' | ''
  conclusionMethod: 'podpisem' | 'zaplacenim' | 'digitalnim' | ''
  premiumDueNotification: 'sjednatel' | 'zakaznik' | ''
  firstPaymentMethod: 'platba' | 'prevod' | ''
  contractConcluded: 'osobne' | 'nadalku' | ''
}

export interface InsuranceOffer {
  provider: string
  productName: string
  price: number
  includedCoverages: string[]
  additionalOptions: AdditionalOption[]
}

export interface AdditionalOption {
  id: string
  name: string
  price: number
  enabled: boolean
  limit?: string
}
