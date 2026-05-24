'use client'

import { useState } from 'react'
import { FormData, InsuranceOffer, AdditionalOption } from '../../types/formData'
import { openOffersPdf, type PropertyOffersPdfData } from '../propertyOffersPdf'

/** Nabízené slevy (% z pojistného). */
const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20]

interface Step3CalculationProps {
  formData: FormData
  onDataChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Calculation({ formData, onDataChange, onNext, onBack }: Step3CalculationProps) {
  const [offers] = useState<InsuranceOffer[]>([
    {
      provider: 'CSOB',
      productName: 'PREMIANT',
      price: 1500,
      includedCoverages: [
        'Požár, výbuch, blesk',
        'Voda z vodovodního zařízení',
        'Odcizení vloupáním',
        'Živelní pohromy (vichřice, krupobití, tíha sněhu)',
        'Základní asistence zahrnuta',
      ],
      additionalOptions: [
        { id: 'atmosfericke', name: 'Atmosferické srážky', price: 150, enabled: true },
        { id: 'povoden', name: 'Povodeň a záplava', price: 150, enabled: true },
        { id: 'voda', name: 'Vodní škody - ztráta vody', price: 100, enabled: false },
        { id: 'odcizeni', name: 'Odcizení', price: 180, enabled: false },
        { id: 'prepeti', name: 'Přepětí', price: 100, enabled: false },
        { id: 'vandalismus', name: 'Vandalismus', price: 90, enabled: false },
        { id: 'fasada', name: 'Poškození fasády', price: 200, enabled: false },
        { id: 'skla', name: 'Rozbití skel', price: 240, enabled: false },
        { id: 'asistence', name: 'Rozšířená asistence', price: 200, enabled: false },
        { id: 'pravni', name: 'Právní asistence', price: 150, enabled: false },
        { id: 'it', name: 'IT asistence', price: 100, enabled: false },
        { id: 'odpovednost', name: 'Pojištění odpovědnosti', price: 500, enabled: false },
      ],
    },
    {
      provider: 'CPP',
      productName: 'SPECIÁLPOV',
      price: 1540,
      includedCoverages: [
        'Požár, výbuch, blesk',
        'Voda z vodovodního zařízení',
        'Odcizení vloupáním',
        'Živelní pohromy (vichřice, krupobití, tíha sněhu)',
        'Základní asistence zahrnuta',
      ],
      additionalOptions: [
        { id: 'atmosfericke', name: 'Atmosferické srážky', price: 158, enabled: true },
        { id: 'povoden', name: 'Povodeň a záplava', price: 158, enabled: true },
        { id: 'voda', name: 'Vodní škody - ztráta vody', price: 105, enabled: false },
        { id: 'odcizeni', name: 'Odcizení', price: 189, enabled: false },
        { id: 'prepeti', name: 'Přepětí', price: 105, enabled: false },
        { id: 'vandalismus', name: 'Vandalismus', price: 95, enabled: false },
        { id: 'fasada', name: 'Poškození fasády', price: 210, enabled: false },
        { id: 'skla', name: 'Rozbití skel', price: 461, enabled: false },
        { id: 'asistence', name: 'Rozšířená asistence', price: 14, enabled: false },
        { id: 'pravni', name: 'Právní asistence', price: 11, enabled: false },
        { id: 'it', name: 'IT asistence', price: 7, enabled: false },
        { id: 'odpovednost', name: 'Pojištění odpovědnosti', price: 550, enabled: false },
      ],
    },
    {
      provider: 'Kooperativa',
      productName: 'NA MÍRU 100',
      price: 1734,
      includedCoverages: [
        'Požár, výbuch, blesk',
        'Voda z vodovodního zařízení',
        'Odcizení vloupáním',
        'Živelní pohromy (vichřice, krupobití, tíha sněhu)',
        'Základní asistence zahrnuta',
      ],
      additionalOptions: [
        { id: 'atmosfericke', name: 'Atmosferické srážky', price: 168, enabled: true },
        { id: 'povoden', name: 'Povodeň a záplava', price: 168, enabled: true },
        { id: 'voda', name: 'Vodní škody - ztráta vody', price: 112, enabled: false },
        { id: 'odcizeni', name: 'Odcizení', price: 202, enabled: false },
        { id: 'prepeti', name: 'Přepětí', price: 112, enabled: false },
        { id: 'vandalismus', name: 'Vandalismus', price: 101, enabled: false },
        { id: 'fasada', name: 'Poškození fasády', price: 224, enabled: false },
        { id: 'skla', name: 'Rozbití skel', price: 618, enabled: false },
        { id: 'asistence', name: 'Rozšířená asistence', price: 68, enabled: false },
        { id: 'pravni', name: 'Právní asistence', price: 51, enabled: false },
        { id: 'it', name: 'IT asistence', price: 34, enabled: false },
        { id: 'odpovednost', name: 'Pojištění odpovědnosti', price: 600, enabled: false },
      ],
    },
  ])

  const [selectedOffers, setSelectedOffers] = useState<InsuranceOffer[]>(offers)
  // Sleva v % per nabídka + které nabídce je zrovna otevřený výběr slevy.
  const [discounts, setDiscounts] = useState<Record<number, number>>({})
  const [openDiscount, setOpenDiscount] = useState<number | null>(null)

  const discountFor = (index: number) => discounts[index] || 0

  const handleToggleOption = (offerIndex: number, optionId: string) => {
    const updated = [...selectedOffers]
    const option = updated[offerIndex].additionalOptions.find((o) => o.id === optionId)
    if (option) {
      option.enabled = !option.enabled
      setSelectedOffers(updated)
    }
  }

  const calculateTotalPrice = (offer: InsuranceOffer) => {
    const basePrice = offer.price
    const additionalPrice = offer.additionalOptions
      .filter((opt) => opt.enabled)
      .reduce((sum, opt) => sum + opt.price, 0)
    return basePrice + additionalPrice
  }

  // Cena po uplatnění slevy (zaokrouhleno na celé Kč).
  const finalPrice = (offer: InsuranceOffer, index: number) =>
    Math.round(calculateTotalPrice(offer) * (1 - discountFor(index) / 100))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Další nabídky (pouze pro porovnání / souhrn – bez detailu).
  const otherOffers = [
    { provider: 'Pillow', price: 1420 },
    { provider: 'Allianz', price: 1620 },
  ]

  const allPrices = [
    ...selectedOffers.map((o, i) => ({ provider: o.provider, price: finalPrice(o, i) })),
    ...otherOffers,
  ]

  const minPrice = Math.min(...allPrices.map((p) => p.price))

  const propertyLabel =
    formData.propertyType === 'byt' ? 'Byt' : formData.propertyType === 'dum' ? 'Dům' : 'Chata, chalupa'

  // Sestaví data a otevře PDF draft nabídek.
  const handleDownloadPdf = () => {
    const sorted = selectedOffers
      .map((o, i) => ({ o, i }))
      .sort((a, b) => finalPrice(a.o, a.i) - finalPrice(b.o, b.i))

    const data: PropertyOffersPdfData = {
      clientName:
        formData.firstName && formData.lastName
          ? `${formData.firstName} ${formData.lastName}`
          : formData.companyName || '',
      propertyLabel,
      propertyAddress: formData.propertyAddress || '',
      offerNumber: '1982899',
      startDate: formData.insuranceStartDate || '',
      paymentFrequency: formData.paymentFrequency || 'ročně',
      topOffers: sorted.map(({ o, i }) => ({
        provider: o.provider,
        productName: o.productName,
        basePrice: o.price,
        included: o.includedCoverages,
        addons: o.additionalOptions
          .filter((opt) => opt.enabled)
          .map((opt) => ({ name: opt.name, price: opt.price })),
        total: calculateTotalPrice(o),
        discountPercent: discountFor(i),
        final: finalPrice(o, i),
      })),
      otherOffers,
    }
    openOffersPdf(data)
  }

  return (
    <div className="space-y-8">
      {/* Offer Details Section - Three Cards in One Box */}
      <div className="bg-surface rounded-xl shadow-sm p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {/* Nabídka pojištění */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-foreground">Nabídka pojištění</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Nabídka číslo: <span className="font-semibold text-foreground">1982899</span></p>
              <p className="text-sm text-muted">Počátek pojištění: <span className="font-semibold text-foreground">14.01.2026</span></p>
            </div>
          </div>

          {/* Nemovitost */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-sm font-semibold text-foreground">Nemovitost</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-semibold">
                {formData.propertyType === 'byt' ? 'Byt' : formData.propertyType === 'dum' ? 'Dům' : 'Chata, chalupa'}
              </p>
              <p className="text-sm text-muted break-words">{formData.propertyAddress || '-'}</p>
            </div>
          </div>

          {/* Klient */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-sm font-semibold text-foreground">Klient</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-semibold">
                {formData.firstName && formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}`
                  : '-'}
              </p>
              <p className="text-sm text-muted break-words">{formData.address || '-'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button className="px-6 py-2 border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold rounded-lg transition-colors text-sm">
            Upravit parametry
          </button>
        </div>
      </div>

      {/* Insurance Providers Section */}
      <h2 className="text-xl font-semibold text-foreground mb-6">Nabídky pojistitelů</h2>

      {/* Insurance Offers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedOffers.map((offer, index) => {
          const totalPrice = calculateTotalPrice(offer)
          const discount = discountFor(index)
          const priceAfter = finalPrice(offer, index)
          return (
            <div key={index} className="bg-surface rounded-xl shadow-sm p-8 space-y-5 relative">
              <button 
                type="button"
                className="absolute top-6 right-6 z-10 w-6 h-6 flex items-center justify-center text-subtle hover:text-muted transition-colors"
                aria-label="Zavřít"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="space-y-4">
                <div className="bg-brand-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-muted mb-2 font-medium">{offer.provider}</div>
                  {discount > 0 && (
                    <div className="text-sm text-muted line-through">{formatCurrency(totalPrice)}</div>
                  )}
                  <div className="text-3xl font-bold text-brand-600 mb-1">{formatCurrency(priceAfter)}</div>
                  <div className="text-xs text-muted mb-3">
                    Ročně{discount > 0 && <span className="ml-1 font-semibold text-success">· sleva {discount} %</span>}
                  </div>
                  <div className="text-base font-semibold text-brand-600">{offer.productName}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-brand-900 mb-2">V ceně:</div>
                  <ul className="space-y-1">
                    {offer.includedCoverages.map((coverage, i) => (
                      <li key={i} className="flex items-start text-sm text-muted">
                        <svg className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {coverage}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-brand-900 mb-2">Možnosti připojištění:</div>
                  <div className="space-y-4">
                    {offer.additionalOptions.map((option) => (
                      <div key={option.id} className="flex items-center justify-between gap-2 py-2">
                        <label className="flex items-center flex-1 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={option.enabled}
                            onChange={() => handleToggleOption(index, option.id)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                              option.enabled ? 'bg-success' : 'bg-border-strong'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-surface rounded-full shadow-md transform transition-transform mt-0.5 ${
                                option.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </div>
                          <span className="ml-2 text-sm text-foreground flex-1 break-words">{option.name}</span>
                        </label>
                        <span className="text-sm font-semibold text-foreground whitespace-nowrap ml-2">
                          + {formatCurrency(option.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setOpenDiscount(openDiscount === index ? null : index)}
                    className="w-full px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    {discount > 0 ? `Sleva ${discount} % uplatněna` : 'Uplatnit slevu'}
                  </button>
                  {openDiscount === index && (
                    <div className="rounded-lg border border-border bg-surface-muted p-3">
                      <div className="mb-2 text-xs font-medium text-muted">Zvolte výši slevy</div>
                      <div className="flex flex-wrap gap-2">
                        {DISCOUNT_OPTIONS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setDiscounts((prev) => ({ ...prev, [index]: d }))
                              setOpenDiscount(null)
                            }}
                            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                              discount === d
                                ? 'border-brand-600 bg-brand-50 text-brand-700'
                                : 'border-border bg-surface text-foreground hover:border-border-strong'
                            }`}
                          >
                            {d === 0 ? 'Bez slevy' : `${d} %`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onDataChange({ selectedOffer: offer })
                      onNext()
                    }}
                    className="w-full px-4 py-2 bg-success hover:bg-success text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Sjednat
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Comparison Chart - Column Chart */}
      <div className="bg-surface rounded-xl shadow-sm p-5 sm:p-8">
        <h3 className="text-xl font-semibold text-brand-900 mb-6">Porovnání všech nabídek</h3>
        <div className="flex items-end justify-center gap-3 h-64 pb-8 overflow-x-auto sm:gap-6">
          {allPrices.map((item, index) => {
            const maxPrice = Math.max(...allPrices.map((p) => p.price))
            const heightPercent = (item.price / maxPrice) * 100
            return (
              <div key={index} className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-auto sm:flex-1">
                <div className="whitespace-nowrap text-sm font-semibold text-foreground mb-2">
                  {formatCurrency(item.price)}
                </div>
                <div 
                  className={`w-full rounded-t transition-all relative ${
                    item.provider === 'Pillow' ? 'bg-brand-600' : 'bg-border-strong'
                  }`}
                  style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                />
                <div className="text-xs text-brand-900 font-medium text-center mt-2">
                  {item.provider}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Frequency and Actions Box */}
      <div className="bg-surface rounded-xl shadow-sm p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-4 items-center">
            <label className="text-sm text-brand-900 whitespace-nowrap">Frekvence platby:</label>
            <select
              value={formData.paymentFrequency}
              onChange={(e) => onDataChange({ paymentFrequency: e.target.value as any })}
              className="px-4 py-2 border border-border rounded-lg text-sm h-[42px] w-[180px]"
            >
              <option value="ročně">Ročně</option>
              <option value="pololetně">Pololetně</option>
              <option value="čtvrtletně">Čtvrtletně</option>
              <option value="měsíčně">Měsíčně</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 border border-brand-600 rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 text-sm text-brand-600 h-[42px]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Odeslat emailem
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 border border-brand-600 rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2 text-sm text-brand-600 h-[42px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Stáhnout PDF
            </button>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-surface-muted hover:bg-border-strong text-foreground font-semibold rounded-lg transition-colors text-sm"
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
