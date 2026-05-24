'use client'

import { useState } from 'react'
import ProgressIndicator from './ProgressIndicator'
import Step1BasicInfo from './steps/Step1BasicInfo'
import Step2PropertyDetails from './steps/Step2PropertyDetails'
import Step3Calculation from './steps/Step3Calculation'
import PropertyContractPage from './PropertyContractPage'
import { FormData } from '../types/formData'
import { RecordStep } from '../../../shared/record/RecordStep'
import { initialRecord, type RecordState } from '../../../shared/record/types'
import { openRecordPdf } from '../../../shared/record/recordPrint'
import { buildPropertyRecordInput } from '../propertyRecordInput'

export default function MultiStepInsuranceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [record, setRecord] = useState<RecordState>(initialRecord)
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    contractReplacement: false,
    contractNumber: '',
    insuranceCompany: '',
    personType: 'fyzicka',
    ico: '',
    companyName: '',
    companyPosition: '',
    personalId: '',
    birthDate: '',
    titleBefore: '',
    firstName: '',
    lastName: '',
    titleAfter: '',
    address: '',
    sameAddress: false,
    correspondenceAddress: '',
    phone: '',
    email: '',
    consentData: false,
    consentElectronic: false,
    consentMarketing: false,
    propertyAddress: '',
    notApproved: false,
    postalCode: '',
    municipality: '',
    cadastralArea: '',
    parcelNumber: '',
    parcelType: '',
    propertyRelation: 'vlastnik',
    propertyRented: false,
    propertyType: 'byt',
    ownershipType: '',
    goodCondition: false,
    
    // Step 2
    insuranceType: 'stavba',
    insuranceStavba: false,
    insuranceDomacnost: false,
    apartmentLayout: '',
    apartmentLocation: '',
    floorArea: '',
    apartmentNumber: '',
    totalBuiltArea: '',
    totalUsableArea: '',
    inhabitedAttic: false,
    roofType: '',
    houseConstruction: '',
    floors: '',
    materialQuality: '',
    cellarPercentage: '',
    apartmentConstruction: '',
    higherFloor: false,
    apartmentQuality: '',
    apartmentCondition: '',
    hasBalconyOrTerrace: false,
    hasBalcony: false,
    balconyArea: '',
    hasTerrace: false,
    terraceArea: '',
    garageParking: false,
    hasElevator: false,
    parkingSpace: false,
    propertyValue: 0,
    ancillaryBuildings: 0,
    householdValue: 0,
    specialValueItems: 0,
    equipmentAndFixedItems: 0,
    nonResidentialItems: 0,
    
    // Step 3
    insuranceStartDate: '',
    paymentFrequency: 'ročně',
    selectedOffer: null,
    
    // Step 4
    contractMethod: '',
    meetingDiscrepancies: '',
    recommendationReasons: [],
    impactDescription: [],
    clientRefusesRequirements: '',
    clientHasOtherContract: '',
    noDiscrepanciesAware: false,
    meetingPlace: '',
    contractType: 'nova',
    conclusionMethod: 'podpisem',
    premiumDueNotification: '',
    firstPaymentMethod: 'platba',
    contractConcluded: 'osobne',
  })

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const downloadRecord = () =>
    openRecordPdf({ input: buildPropertyRecordInput(formData), record })

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDataChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} onDataChange={handleDataChange} onNext={handleNext} />
      case 2:
        return <Step2PropertyDetails formData={formData} onDataChange={handleDataChange} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step3Calculation formData={formData} onDataChange={handleDataChange} onNext={handleNext} onBack={handleBack} />
      case 4:
        return (
          <RecordStep
            input={buildPropertyRecordInput(formData)}
            record={record}
            onRecordChange={setRecord}
            onBack={handleBack}
            onConclude={() => setCurrentStep(5)}
          />
        )
      case 5:
        return (
          <PropertyContractPage onStepChange={setCurrentStep} onDownloadRecord={downloadRecord} />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Lišta kroků (rámec dodává hostitelská stránka hubu) */}
      <div className="mb-6 rounded-2xl border border-border bg-surface px-3 py-4 shadow-sm sm:px-6">
        <ProgressIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      {/* Obsah aktuálního kroku */}
      <div>{renderStep()}</div>
    </div>
  )
}
