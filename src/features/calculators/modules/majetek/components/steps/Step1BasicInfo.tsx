'use client'

import { Building2, Home, TreePine } from 'lucide-react'
import { FormData } from '../../types/formData'

interface Step1BasicInfoProps {
  formData: FormData
  onDataChange: (data: Partial<FormData>) => void
  onNext: () => void
}

export default function Step1BasicInfo({ formData, onDataChange, onNext }: Step1BasicInfoProps) {
  const handleChange = (field: keyof FormData, value: any) => {
    onDataChange({ [field]: value })
  }

  const formatDateForDateInput = (dateString: string) => {
    if (!dateString) return ''
    // Pokud je to ve formátu DD.MM.YYYY, převedeme na YYYY-MM-DD
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.')
      if (day && month && year) {
        return `${year}-${month}-${day}`
      }
    }
    // Pokud už je ve formátu YYYY-MM-DD, vrátíme jak je
    if (dateString.includes('-') && dateString.length === 10) {
      return dateString
    }
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Header Banner s připojeným boxem */}
      <div>
        {/* Datepicker a Náhrada smlouvy - připojený box */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
          {/* Datum počátku pojištění */}
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-2">
              Datum počátku pojištění
            </label>
            <input
              type="date"
              value={formData.insuranceStartDate ? formatDateForDateInput(formData.insuranceStartDate) : ''}
              onChange={(e) => handleChange('insuranceStartDate', e.target.value)}
              className="w-full sm:w-[180px] px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm h-[42px]"
            />
          </div>

          {/* Náhrada smlouvy - Toggle Switch */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-brand-900 whitespace-nowrap">
              Náhrada smlouvy
            </label>
            <div className="relative inline-flex items-center bg-surface-muted rounded-full p-1">
              <button
                type="button"
                onClick={() => handleChange('contractReplacement', true)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                  formData.contractReplacement
                    ? 'bg-surface text-danger border border-danger shadow-sm'
                    : 'text-muted'
                }`}
              >
                Ano
              </button>
              <button
                type="button"
                onClick={() => handleChange('contractReplacement', false)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                  !formData.contractReplacement
                    ? 'bg-surface text-danger border border-danger shadow-sm'
                    : 'text-muted'
                }`}
              >
                Ne
              </button>
            </div>
          </div>
        </div>

        {/* Podmíněné inputy pro náhradu smlouvy */}
        {formData.contractReplacement && (
          <>
            <div className="border-t border-border my-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {/* Číslo smlouvy */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Číslo smlouvy
                </label>
                <input
                  type="text"
                  value={formData.contractNumber || ''}
                  onChange={(e) => handleChange('contractNumber', e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                />
              </div>

              {/* Vyberte pojišťovnu */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Vyberte pojišťovnu
                </label>
                <select
                  value={formData.insuranceCompany || ''}
                  onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                  className="w-full h-[42px] px-4 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">Vyberte</option>
                  <option value="company1">Pojišťovna 1</option>
                  <option value="company2">Pojišťovna 2</option>
                  <option value="company3">Pojišťovna 3</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Informace o pojistníkovi */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-brand-600 mb-1">Informace o pojistníkovi</h2>
        <p className="text-sm text-muted mb-6">Zadejte informace o pojistníkovi.</p>

        {/* Typ osoby - Segmented control */}
        <div className="mb-6 border border-border rounded-xl p-4">
          <label className="block text-sm font-medium text-brand-900 mb-3">Typ</label>
          <div className="relative flex flex-col sm:flex-row sm:items-center bg-surface-muted rounded-2xl sm:rounded-full p-1 w-full">
            {[
              { value: 'obcan', label: 'Občan', mapValue: 'fyzicka' },
              { value: 'podnikatel', label: 'Fyzická osoba podnikatel', mapValue: 'podnikatel' },
              { value: 'pravnicka', label: 'Právnická osoba', mapValue: 'pravnicka' },
              { value: 'cizinec', label: 'Cizinec', mapValue: 'cizinec' },
            ].map((type) => {
              const isSelected = formData.personType === type.mapValue || 
                (type.value === 'obcan' && formData.personType === 'fyzicka')
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('personType', type.mapValue)}
                  className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                    isSelected
                      ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* IČO (pro Fyzická osoba podnikatel a Právnická osoba) nebo Rodné číslo */}
        {(formData.personType === 'podnikatel' || formData.personType === 'pravnicka') ? (
          <div className="mb-6 border border-border rounded-xl p-4">
            {/* IČO */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-900 mb-2">
                IČO
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formData.ico || ''}
                  onChange={(e) => handleChange('ico', e.target.value)}
                  placeholder="Např. 18628443"
                  className="w-full sm:w-[calc(25%-0.375rem)] px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-[42px]"
                />
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 font-medium h-[42px]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Načíst údaje
                </button>
              </div>
            </div>

            {/* Název společnosti */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-900 mb-2">
                Název společnosti
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-[42px]"
              />
            </div>

            {/* Jméno a tituly - 4 nebo 5 columns (5 pro Právnická osoba) */}
            <div className={`grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 ${formData.personType === 'pravnicka' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
              {formData.personType === 'pravnicka' && (
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">Pozice ve společnosti</label>
                  <select
                    value={formData.companyPosition || ''}
                    onChange={(e) => handleChange('companyPosition', e.target.value)}
                    className="w-full h-[42px] px-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                  >
                    <option value="">Vyberte</option>
                    <option value="jednatel">Jednatel</option>
                    <option value="společník">Společník</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Titul před jménem</label>
                <select
                  value={formData.titleBefore}
                  onChange={(e) => handleChange('titleBefore', e.target.value)}
                  className="w-full h-[42px] px-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">Vyberte</option>
                  <option value="Ing.">Ing.</option>
                  <option value="MUDr.">MUDr.</option>
                  <option value="Mgr.">Mgr.</option>
                  <option value="PhDr.">PhDr.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Jméno</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Jméno"
                  className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Příjmení</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Příjmení"
                  className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Titul za jménem</label>
                <input
                  type="text"
                  value={formData.titleAfter}
                  onChange={(e) => handleChange('titleAfter', e.target.value)}
                  placeholder="Např. PhD"
                  className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
                />
              </div>
            </div>

            {/* Rodné číslo - přesunuto pod tituly/jméno/příjmení */}
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                Rodné číslo (nepovinný údaj)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formData.personalId}
                  onChange={(e) => handleChange('personalId', e.target.value)}
                  placeholder="Např. 7812227665"
                  className="w-full sm:w-[calc(25%-0.375rem)] px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-[42px]"
                />
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 font-medium h-[42px]"
                >
                  <span className="text-lg leading-none">↑</span>
                  Načíst údaje
                </button>
              </div>
              <p className="text-xs text-muted mt-2">
                Zadejte číslice bez mezer, lomítek či pomlček. (Nepovinné)
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 border border-border rounded-xl p-4">
            {/* Rodné číslo nebo Datum narození (pro Cizinec) */}
            <div className="mb-6">
              {formData.personType === 'cizinec' ? (
                <>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Datum narození
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate ? formatDateForDateInput(formData.birthDate) : ''}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full sm:w-[calc(25%-0.375rem)] px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm h-[42px]"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Rodné číslo
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={formData.personalId}
                      onChange={(e) => handleChange('personalId', e.target.value)}
                      placeholder="XXXXXX/XXXX"
                      className="w-full sm:w-[calc(25%-0.375rem)] px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-[42px]"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 border-2 border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 font-medium h-[42px]"
                    >
                      <span className="text-lg leading-none">↑</span>
                      Načíst údaje
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Jméno a tituly - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Titul před jménem</label>
                <select
                  value={formData.titleBefore}
                  onChange={(e) => handleChange('titleBefore', e.target.value)}
                  className="w-full h-[42px] px-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">-</option>
                  <option value="Ing.">Ing.</option>
                  <option value="MUDr.">MUDr.</option>
                  <option value="Mgr.">Mgr.</option>
                  <option value="PhDr.">PhDr.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Jméno</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Jméno"
                  className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Příjmení</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Příjmení"
                  className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">Titul za jménem</label>
                <select
                  value={formData.titleAfter}
                  onChange={(e) => handleChange('titleAfter', e.target.value)}
                  className="w-full h-[42px] px-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">-</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Adresa */}
        <div className="mb-6 border border-border rounded-xl p-4">
          <label className="block text-sm font-medium text-brand-900 mb-2">Adresa klienta</label>
          <div className="relative">
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ulice, číslo popisné a orientační, obec, PSČ"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent pr-10 h-[42px]"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-subtle pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Korespondenční adresa - Checkbox */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.sameAddress}
                onChange={(e) => handleChange('sameAddress', e.target.checked)}
                className="w-5 h-5 text-success rounded border-border focus:ring-success"
              />
              <span className="ml-2 text-sm text-brand-900">
                Korespondenční adresa je odlišná od trvalé adresy
              </span>
            </label>

            {/* Korespondenční adresa - Input (zobrazí se když je checkbox zaškrtnutý) */}
            {formData.sameAddress && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-brand-900 mb-2">Korespondenční adresa</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.correspondenceAddress || ''}
                    onChange={(e) => handleChange('correspondenceAddress', e.target.value)}
                    placeholder="Ulice, číslo popisné a orientační, obec, PSČ"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent pr-10 h-[42px]"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-subtle pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kontakt - 2 columns */}
        <div className="border border-border rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-2">
              Telefonní číslo
            </label>
            <div className="flex gap-2">
              <select className="w-20 px-3 py-3 border border-border rounded-lg text-sm h-[42px]">
                <option>-</option>
                <option>+420</option>
                <option>+421</option>
              </select>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="123 456 789"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-2">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="vas@email.cz"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
            />
          </div>
          </div>
        </div>

        {/* Souhlasy */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consentData}
              onChange={(e) => handleChange('consentData', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
            />
            <span className="ml-2 text-sm text-brand-900">Souhlas se zpracováním údajů</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consentElectronic}
              onChange={(e) => handleChange('consentElectronic', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
            />
            <span className="ml-2 text-sm text-brand-900">Souhlas s elektronickou komunikací</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consentMarketing}
              onChange={(e) => handleChange('consentMarketing', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
            />
            <span className="ml-2 text-sm text-brand-900">Souhlas s marketingovou komunikací</span>
          </label>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm p-8 space-y-8">

        {/* Základní údaje k nemovitosti */}
        <div>
          <h2 className="text-xl font-semibold text-brand-600 mb-6">Základní údaje k nemovitosti</h2>

          {/* Typ nemovitosti a Druh vlastnictví v rámečku */}
          <div className="border border-border rounded-xl p-6 mb-6">
            {/* Typ nemovitosti - Large square cards */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-900 mb-3">
                Jakou nemovitost chcete pojistit?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: 'byt', label: 'Byt', Icon: Building2 },
                  { value: 'dum', label: 'Dům', Icon: Home },
                  { value: 'chata', label: 'Chata, chalupa', Icon: TreePine },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`relative p-5 sm:p-8 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] sm:min-h-[140px] ${
                      formData.propertyType === type.value
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <input
                      type="radio"
                      name="propertyType"
                      value={type.value}
                      checked={formData.propertyType === type.value}
                      onChange={(e) => handleChange('propertyType', e.target.value)}
                      className="sr-only"
                    />
                    {formData.propertyType === type.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <type.Icon
                      className="mb-3 h-11 w-11 text-brand-600"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div className="text-base font-semibold text-foreground">{type.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Druh vlastnictví - zobrazit pouze pro Byt */}
            {formData.propertyType === 'byt' && (
              <div className="w-full sm:w-[calc((100%-1rem)/2)]">
                <label className="block text-sm font-medium text-brand-900 mb-2">Druh vlastnictví</label>
                <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleChange('ownershipType', 'osobni')}
                    className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                      formData.ownershipType === 'osobni'
                        ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                        : 'text-muted'
                    }`}
                  >
                    Osobní
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('ownershipType', 'druzstevni')}
                    className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                      formData.ownershipType === 'druzstevni'
                        ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                        : 'text-muted'
                    }`}
                  >
                    Družstevní
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Adresa nemovitosti */}
          <div className="mb-6 border border-border rounded-xl p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-900 mb-2">
                Adresa nemovitosti
              </label>
              <input
                type="text"
                value={formData.propertyAddress}
                onChange={(e) => handleChange('propertyAddress', e.target.value)}
                placeholder="Ulice, číslo popisné a orientační, obec, PSČ"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 text-sm h-[42px]"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notApproved}
                  onChange={(e) => handleChange('notApproved', e.target.checked)}
                  className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                />
                <span className="ml-2 text-sm text-brand-900">Ještě není zkolaudováno</span>
              </label>
            </div>

            {/* Podmíněný formulář když je checkbox zaškrtnutý */}
            {formData.notApproved && (
              <div className="mt-6 bg-brand-50 rounded-xl p-6 space-y-6">
                {/* PSČ a Obec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      PSČ
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Obec
                    </label>
                    <input
                      type="text"
                      value={formData.municipality || ''}
                      onChange={(e) => handleChange('municipality', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                    />
                  </div>
                </div>

                {/* Katastrální území a Číslo parcely */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Katastrální území
                    </label>
                    <input
                      type="text"
                      value={formData.cadastralArea || ''}
                      onChange={(e) => handleChange('cadastralArea', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Číslo parcely
                    </label>
                    <input
                      type="text"
                      value={formData.parcelNumber || ''}
                      onChange={(e) => handleChange('parcelNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                    />
                  </div>
                </div>

                {/* Typ parcely */}
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">Typ parcely</label>
                  <div className="relative flex flex-col sm:flex-row sm:items-center bg-surface-muted rounded-2xl sm:rounded-full p-1 w-full max-w-2xl">
                    <button
                      type="button"
                      onClick={() => handleChange('parcelType', 'stavebni')}
                      className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.parcelType === 'stavebni'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Stavební
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('parcelType', 'pozemkova')}
                      className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.parcelType === 'pozemkova'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Pozemková
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('parcelType', 'nema-typ')}
                      className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.parcelType === 'nema-typ'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Nemá přidělený typ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vztah k nemovitosti */}
          <div className="mb-6 border border-border rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-900 mb-2">Vztah k nemovitosti</label>
                <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleChange('propertyRelation', 'vlastnik')}
                    className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                      formData.propertyRelation === 'vlastnik'
                        ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                        : 'text-muted'
                    }`}
                  >
                    Vlastník
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('propertyRelation', 'najemce')}
                    className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                      formData.propertyRelation === 'najemce'
                        ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                        : 'text-muted'
                    }`}
                  >
                    Nájemce
                  </button>
                </div>
              </div>

              {/* Pronajímáte nemovitost - zobrazit pouze pro Vlastník */}
              {formData.propertyRelation === 'vlastnik' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-900 mb-2">Pronajímáte nemovitost</label>
                  <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                    <button
                      type="button"
                      onClick={() => handleChange('propertyRented', false)}
                      className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        !formData.propertyRented
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Ne
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('propertyRented', true)}
                      className={`flex-1 px-6 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.propertyRented
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Ano
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.goodCondition}
                onChange={(e) => handleChange('goodCondition', e.target.checked)}
                className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
              />
              <span className="ml-2 text-sm text-brand-900">
                Domácnost je v dobrém stavu a bez chátrajících prvků
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer Button - Right aligned, gray */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-border-strong hover:bg-surface-muted0 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Pokračovat
        </button>
      </div>
    </div>
  )
}
