'use client'

import { Home, Sofa } from 'lucide-react'
import { FormData } from '../../types/formData'

interface Step2PropertyDetailsProps {
  formData: FormData
  onDataChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2PropertyDetails({ formData, onDataChange, onNext, onBack }: Step2PropertyDetailsProps) {
  const handleChange = (field: keyof FormData, value: any) => {
    onDataChange({ [field]: value })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('cs-CZ').format(value)
  }

  const handleValueChange = (delta: number) => {
    const newValue = Math.max(0, formData.propertyValue + delta)
    handleChange('propertyValue', newValue)
  }

  const handleAncillaryBuildingsChange = (delta: number) => {
    const newValue = Math.max(0, (formData.ancillaryBuildings || 0) + delta)
    handleChange('ancillaryBuildings', newValue)
  }

  const handleHouseholdValueChange = (field: 'householdValue' | 'specialValueItems' | 'equipmentAndFixedItems' | 'nonResidentialItems', delta: number) => {
    const currentValue = formData[field] || 0
    const newValue = Math.max(0, currentValue + delta)
    handleChange(field, newValue)
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl shadow-sm p-8 space-y-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-brand-600 mb-1">Co budeme pojišťovat</h2>
          <p className="text-sm text-muted">Zadejte základní parametry pojištění.</p>
        </div>

        {/* Co chcete pojistit - Toggle switchy */}
        <div className="space-y-4">
          {/* Nemovitost */}
          <div className={`border border-border rounded-lg bg-surface ${formData.insuranceStavba ? 'p-6' : 'p-4'}`}>
            <div className="flex items-start justify-between mb-0">
              <div className="flex gap-4">
                <Home className="h-7 w-7 shrink-0 text-brand-600" strokeWidth={1.5} aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Nemovitost</span>
                  <p className="text-xs text-muted max-w-md">
                    je stavba nebo její část pevně spojená se zemí, včetně jejích stavebních součástí a pevně zabudovaného vybavení, která slouží k bydlení nebo jinému užívání.
                  </p>
                </div>
              </div>
              <div className="relative inline-flex items-center bg-surface-muted rounded-full p-1">
                <button
                  type="button"
                  onClick={() => handleChange('insuranceStavba', false)}
                  className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                    !formData.insuranceStavba
                      ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  Ne
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('insuranceStavba', true)}
                  className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                    formData.insuranceStavba
                      ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  Ano
                </button>
              </div>
            </div>

            {/* Všechny inputy pro Nemovitost - zobrazí se pouze když je "Ano" */}
            {formData.insuranceStavba && (
              <div className="mt-6 space-y-8 pt-6 border-t border-border">
                {formData.propertyType === 'dum' || formData.propertyType === 'chata' ? (
                  /* Formulář pro Dům */
                  <>
                    {/* Celková zastavěná plocha a Celková užitná plocha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Celková zastavěná plocha v m²
                        </label>
                        <input
                          type="text"
                          value={formData.totalBuiltArea}
                          onChange={(e) => handleChange('totalBuiltArea', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Celková užitná plocha v m²
                        </label>
                        <input
                          type="text"
                          value={formData.totalUsableArea}
                          onChange={(e) => handleChange('totalUsableArea', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                        />
                      </div>
                    </div>

                    {/* Konstrukce domu a Kvalita použitých materiálů - vedle sebe */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Konstrukce domu
                        </label>
                        <select
                          value={formData.houseConstruction}
                          onChange={(e) => handleChange('houseConstruction', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                        >
                          <option value="">Vyberte</option>
                          <option value="panel">Panel</option>
                          <option value="cihla">Cihla</option>
                          <option value="drevena">Dřevěná</option>
                          <option value="beton">Beton</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Kvalita použitých materiálů
                        </label>
                        <select
                          value={formData.materialQuality}
                          onChange={(e) => handleChange('materialQuality', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                        >
                          <option value="">Vyberte</option>
                          <option value="vysoka">Vysoká</option>
                          <option value="stredni">Střední</option>
                          <option value="nizka">Nízká</option>
                        </select>
                      </div>
                    </div>

                    {/* Typ střechy a Počet podlaží - vedle sebe */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Typ střechy
                        </label>
                        <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                          <button
                            type="button"
                            onClick={() => handleChange('roofType', 'sikma')}
                            className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                              formData.roofType === 'sikma'
                                ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                                : 'text-muted'
                            }`}
                          >
                            Šikmá střecha
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChange('roofType', 'rovna')}
                            className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                              formData.roofType === 'rovna'
                                ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                                : 'text-muted'
                            }`}
                          >
                            Rovná střecha
                          </button>
                        </div>
                        
                        {/* Checkbox pro šikmou střechu */}
                        {formData.roofType === 'sikma' && (
                          <label className="flex items-center cursor-pointer mt-4">
                            <input
                              type="checkbox"
                              checked={formData.inhabitedAttic}
                              onChange={(e) => handleChange('inhabitedAttic', e.target.checked)}
                              className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                            />
                            <span className="ml-2 text-sm text-brand-900">Podkroví je určeno k bydlení (využíváno je více než 50 % jeho plochy)</span>
                          </label>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-900 mb-2">
                          Počet podlaží
                        </label>
                        <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                          <button
                            type="button"
                            onClick={() => handleChange('floors', 'jedno')}
                            className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                              formData.floors === 'jedno'
                                ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                                : 'text-muted'
                            }`}
                          >
                            Jedno podlaží
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChange('floors', 'vice')}
                            className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                              formData.floors === 'vice'
                                ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                                : 'text-muted'
                            }`}
                          >
                            Více podlaží
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Podsklepení */}
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Podsklepení (kolik % zastavěné plochy stavby zabírá sklep)
                      </label>
                      <div className="relative flex flex-col sm:flex-row sm:items-center bg-surface-muted rounded-2xl sm:rounded-full p-1 w-full gap-1">
                        <button
                          type="button"
                          onClick={() => handleChange('cellarPercentage', 'none')}
                          className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                            formData.cellarPercentage === 'none'
                              ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                              : 'text-muted'
                          }`}
                        >
                          Nemá sklep
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('cellarPercentage', '25')}
                          className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                            formData.cellarPercentage === '25'
                              ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                              : 'text-muted'
                          }`}
                        >
                          do 25% plochy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('cellarPercentage', '50')}
                          className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                            formData.cellarPercentage === '50'
                              ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                              : 'text-muted'
                          }`}
                        >
                          do 50% plochy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('cellarPercentage', '75')}
                          className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                            formData.cellarPercentage === '75'
                              ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                              : 'text-muted'
                          }`}
                        >
                          do 75% plochy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('cellarPercentage', '100')}
                          className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                            formData.cellarPercentage === '100'
                              ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                              : 'text-muted'
                          }`}
                        >
                          100% plochy
                        </button>
                      </div>
                    </div>

                    {/* Hodnota nemovitosti - Purple box */}
                    <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                      <h3 className="text-lg font-semibold text-brand-600 mb-1">Hodnota nemovitosti</h3>
                      <p className="text-sm text-brand-700 mb-4">
                        Hodnota stavby je cena, za kterou by bylo možné na trhu koupit stejný byt, stejné kvality, ve stejné lokalitě.
                      </p>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Zadejte cenu stavby
                      </label>
                      <div className="flex items-center gap-2 max-w-md mb-6">
                        <button
                          type="button"
                          onClick={() => handleValueChange(-10000)}
                          className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={formatCurrency(formData.propertyValue)}
                          readOnly
                          className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleValueChange(10000)}
                          className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                        >
                          +
                        </button>
                        <span className="text-brand-900 font-medium">Kč</span>
                      </div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Vedlejší stavby a prostory
                      </label>
                      <div className="flex items-center gap-2 max-w-md">
                        <button
                          type="button"
                          onClick={() => handleAncillaryBuildingsChange(-10000)}
                          className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={formatCurrency(formData.ancillaryBuildings || 0)}
                          readOnly
                          className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleAncillaryBuildingsChange(10000)}
                          className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                        >
                          +
                        </button>
                        <span className="text-brand-900 font-medium">Kč</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Formulář pro Byt (současný stav) */
                  <>
                    {/* Dispozice, plocha, číslo bytu, umístění */}
                <div className="border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Dispozice bytu
                      </label>
                      <select
                        value={formData.apartmentLayout}
                        onChange={(e) => handleChange('apartmentLayout', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                      >
                        <option value="">Vyberte</option>
                        <option value="1+kk">1+kk</option>
                        <option value="1+1">1+1</option>
                        <option value="2+kk">2+kk</option>
                        <option value="2+1">2+1</option>
                        <option value="3+kk">3+kk</option>
                        <option value="3+1">3+1</option>
                        <option value="4+kk">4+kk</option>
                        <option value="4+1">4+1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Podlahová plocha v m²
                      </label>
                      <input
                        type="text"
                        value={formData.floorArea}
                        onChange={(e) => handleChange('floorArea', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-900 mb-2">
                        Číslo bytu
                      </label>
                      <input
                        type="text"
                        value={formData.apartmentNumber}
                        onChange={(e) => handleChange('apartmentNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px]"
                      />
                    </div>
                  </div>

                  {/* Umístění bytu */}
                  <div className="mt-4 mb-4 w-full sm:w-[calc((100%-1rem)/2)]">
                    <label className="block text-sm font-medium text-brand-900 mb-2">Umístění bytu</label>
                    <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full">
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentLocation', 'rodinny-dum')}
                        className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 whitespace-nowrap ${
                          formData.apartmentLocation === 'rodinny-dum'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        V rodinném domě
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentLocation', 'bytovy-dum')}
                        className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 whitespace-nowrap ${
                          formData.apartmentLocation === 'bytovy-dum'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        V bytovém domě
                      </button>
                    </div>
                  </div>

                  {/* Byt se nachází ve vyšším patře */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.higherFloor}
                      onChange={(e) => handleChange('higherFloor', e.target.checked)}
                      className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-brand-900">Byt se nachází ve vyšším patře</span>
                    <svg className="w-4 h-4 ml-1 text-subtle" fill="currentColor" viewBox="0 0 20 20" aria-label="Okna jsou umístěna minimálně 1.5m nad terénem">
                      <title>Okna jsou umístěna minimálně 1.5m nad terénem</title>
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </label>
                </div>

                {/* Konstrukce nemovitosti */}
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-sm font-medium text-brand-900 mb-2">Konstrukce nemovitosti</h3>
                  <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full sm:w-[calc((100%-1rem)/2)]">
                    <button
                      type="button"
                      onClick={() => handleChange('apartmentConstruction', 'panel')}
                      className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.apartmentConstruction === 'panel'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Panel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('apartmentConstruction', 'cihla')}
                      className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.apartmentConstruction === 'cihla'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Cihla
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('apartmentConstruction', 'drevo')}
                      className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                        formData.apartmentConstruction === 'drevo'
                          ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                          : 'text-muted'
                      }`}
                    >
                      Dřevo
                    </button>
                  </div>
                </div>

                {/* Kvalita bytu a Stav bytu v jednom rámečku */}
                <div className="border border-border rounded-lg p-6 space-y-6">
                  {/* Kvalita bytu */}
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Kvalita bytu</label>
                    <div className="relative flex items-center bg-surface-muted rounded-full p-1 w-full sm:w-[calc((100%-1rem)/2)]">
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentQuality', 'standard')}
                        className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.apartmentQuality === 'standard'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentQuality', 'nadstandard')}
                        className={`flex-1 px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.apartmentQuality === 'nadstandard'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Nadstandard
                      </button>
                    </div>
                  </div>

                  {/* Stav bytu */}
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Stav bytu</label>
                    <div className="relative flex flex-col sm:flex-row sm:items-center bg-surface-muted rounded-2xl sm:rounded-full p-1 w-full max-w-2xl">
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentCondition', 'dobry')}
                        className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.apartmentCondition === 'dobry'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Dobře udržovaný
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentCondition', 'po-rekonstrukci')}
                        className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.apartmentCondition === 'po-rekonstrukci'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Po rekonstrukci/ Novostavba
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('apartmentCondition', 'potrebuje-rekonstrukci')}
                        className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.apartmentCondition === 'potrebuje-rekonstrukci'
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Potřebuje rekonstrukci
                      </button>
                    </div>
                  </div>
                </div>

                {/* Má byt balkon nebo terasu */}
                <div className={`border border-border rounded-lg ${formData.hasBalconyOrTerrace ? 'p-6' : 'p-4'}`}>
                  <div className="flex items-center justify-between mb-0">
                    <h3 className="text-sm font-medium text-brand-900">Má byt balkon nebo terasu?</h3>
                    <div className="relative inline-flex items-center bg-surface-muted rounded-full p-1">
                      <button
                        type="button"
                        onClick={() => handleChange('hasBalconyOrTerrace', false)}
                        className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          !formData.hasBalconyOrTerrace
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Ne
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('hasBalconyOrTerrace', true)}
                        className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                          formData.hasBalconyOrTerrace
                            ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                            : 'text-muted'
                        }`}
                      >
                        Ano
                      </button>
                    </div>
                  </div>

                  {/* Balkon a terasa - zobrazí se pouze když je "Ano" */}
                  {formData.hasBalconyOrTerrace && (
                    <div className="mt-6 space-y-4 pt-6 border-t border-border">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasBalcony}
                            onChange={(e) => handleChange('hasBalcony', e.target.checked)}
                            className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                          />
                          <span className="ml-2 text-sm font-medium text-brand-900">Byt má balkon</span>
                        </label>
                        <input
                          type="text"
                          value={formData.balconyArea}
                          onChange={(e) => handleChange('balconyArea', e.target.value)}
                          placeholder="Plocha balkonu v m²"
                          disabled={!formData.hasBalcony}
                          className={`w-48 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px] ${
                            !formData.hasBalcony ? 'bg-surface-muted text-subtle cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasTerrace}
                            onChange={(e) => handleChange('hasTerrace', e.target.checked)}
                            className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                          />
                          <span className="ml-2 text-sm font-medium text-brand-900">Byt má terasu</span>
                        </label>
                        <input
                          type="text"
                          value={formData.terraceArea}
                          onChange={(e) => handleChange('terraceArea', e.target.value)}
                          placeholder="Plocha terasy v m²"
                          disabled={!formData.hasTerrace}
                          className={`w-48 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-[42px] ${
                            !formData.hasTerrace ? 'bg-surface-muted text-subtle cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Vybavení domu a bytu */}
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-sm font-medium text-brand-900 mb-4">Vybavení domu a bytu</h3>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.garageParking}
                        onChange={(e) => handleChange('garageParking', e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm text-brand-900">Garážové stání</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasElevator}
                        onChange={(e) => handleChange('hasElevator', e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm text-brand-900">V domě je výtah</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.parkingSpace}
                        onChange={(e) => handleChange('parkingSpace', e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded border-border focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm text-brand-900">Parkovací stání</span>
                    </label>
                  </div>
                </div>

                {/* Hodnota nemovitosti - Purple box */}
                <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                  <h3 className="text-lg font-semibold text-brand-600 mb-1">Hodnota nemovitosti</h3>
                  <p className="text-sm text-brand-700 mb-4">
                    Hodnota stavby je cena, za kterou by bylo možné na trhu koupit stejný byt, stejné kvality, ve stejné lokalitě.
                  </p>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Zadejte cenu stavby
                  </label>
                  <div className="flex items-center gap-2 max-w-md">
                    <button
                      type="button"
                      onClick={() => handleValueChange(-10000)}
                      className="w-10 h-10 rounded-full bg-border-strong hover:bg-border-strong flex items-center justify-center text-brand-900 font-semibold transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={formatCurrency(formData.propertyValue)}
                      readOnly
                      className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => handleValueChange(10000)}
                      className="w-10 h-10 rounded-full bg-border-strong hover:bg-border-strong flex items-center justify-center text-brand-900 font-semibold transition-colors"
                    >
                      +
                    </button>
                    <span className="text-brand-900 font-medium">Kč</span>
                  </div>
                </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Domácnost */}
          <div className={`border border-border rounded-lg bg-surface ${formData.insuranceDomacnost ? 'p-6' : 'p-4'}`}>
            <div className="flex items-start justify-between mb-0">
              <div className="flex gap-4">
                <Sofa className="h-7 w-7 shrink-0 text-brand-600" strokeWidth={1.5} aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Domácnost</span>
                  <p className="text-xs text-muted max-w-md">
                    tvoří soubor movitých věcí sloužících k běžnému užívání osobami žijícími ve společné domácnosti v pojištěné nemovitosti.
                  </p>
                </div>
              </div>
              <div className="relative inline-flex items-center bg-surface-muted rounded-full p-1">
                <button
                  type="button"
                  onClick={() => handleChange('insuranceDomacnost', false)}
                  className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                    !formData.insuranceDomacnost
                      ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  Ne
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('insuranceDomacnost', true)}
                  className={`px-3 py-2 rounded-full font-medium text-sm transition-all relative z-10 ${
                    formData.insuranceDomacnost
                      ? 'bg-surface text-brand-600 border border-brand-600 shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  Ano
                </button>
              </div>
            </div>

            {/* Hodnota domácnosti - zobrazí se pouze když je "Ano" */}
            {formData.insuranceDomacnost && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                  <h3 className="text-lg font-semibold text-brand-600 mb-1">Hodnota domácnosti</h3>
                  <p className="text-sm text-brand-700 mb-6">
                    Do hodnoty domácnosti započítejte všechny věci, které máte doma. Počítejte s částkou, za kolik by bylo možné tyto věci pořídit jako nové v současných cenách.
                  </p>

                  {/* Hodnota domácnosti */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Hodnota domácnosti
                    </label>
                    <div className="flex items-center gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('householdValue', -10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={formatCurrency(formData.householdValue || 0)}
                        readOnly
                        className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('householdValue', 10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                      <span className="text-brand-900 font-medium">Kč</span>
                    </div>
                  </div>

                  {/* Věci zvláštní hodnoty */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Věci zvláštní hodnoty
                    </label>
                    <div className="flex items-center gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('specialValueItems', -10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={formatCurrency(formData.specialValueItems || 0)}
                        readOnly
                        className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('specialValueItems', 10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                      <span className="text-brand-900 font-medium">Kč</span>
                    </div>
                  </div>

                  {/* Vybavení i věci připevněné */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Vybavení i věci připevněné
                    </label>
                    <div className="flex items-center gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('equipmentAndFixedItems', -10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={formatCurrency(formData.equipmentAndFixedItems || 0)}
                        readOnly
                        className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('equipmentAndFixedItems', 10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                      <span className="text-brand-900 font-medium">Kč</span>
                    </div>
                  </div>

                  {/* Věci v nebytových prostorech */}
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">
                      Věci v nebytových prostorech
                    </label>
                    <div className="flex items-center gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('nonResidentialItems', -10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={formatCurrency(formData.nonResidentialItems || 0)}
                        readOnly
                        className="flex-1 min-w-0 px-4 py-3 border border-border rounded-lg bg-surface text-center font-semibold text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => handleHouseholdValueChange('nonResidentialItems', 10000)}
                        className="shrink-0 w-10 h-10 rounded-lg border border-brand-200 bg-surface hover:bg-brand-50 flex items-center justify-center text-brand-700 text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                      <span className="text-brand-900 font-medium">Kč</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-border-strong hover:bg-border-strong text-brand-900 font-semibold rounded-lg transition-colors text-sm"
        >
          Zpět
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-success hover:bg-success text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Pokračovat
        </button>
      </div>
    </div>
  )
}
