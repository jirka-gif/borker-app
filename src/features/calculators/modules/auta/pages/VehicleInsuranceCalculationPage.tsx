import React, { useState } from 'react';
import { Stepper } from '../components/Stepper';
import { VEHICLE_STEPS } from './vehicleSteps';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { VehicleInsuranceAdditionalPage } from './VehicleInsuranceAdditionalPage';
import { OfferCard, type OfferCardData } from '../../../shared/OfferCard';
import { mapCarResponseToOffers } from '../frenkAdapter';
import type { CarApiEnum, CarCalculateInput, CarCalculateResponse } from '@/lib/frenk/types';

// Standardní sada připojištění (v reálu vrací API pojišťovny).
const STANDARD_ADDONS = [
  { key: 'uraz', label: 'Úraz' },
  { key: 'zavazadla', label: 'Zavazadla' },
  { key: 'nahradni-vuz', label: 'Náhradní vůz' },
  { key: 'gap', label: 'GAP' },
  { key: 'prima-likvidace', label: 'Přímá likvidace' },
  { key: 'asistence-vyber', label: 'Asistence (výběr)' },
  { key: 'skla-vyber', label: 'Skla (výběr)' },
  { key: 'stret-se-zveri', label: 'Střet se zvěří' },
  { key: 'zivelni-rizika', label: 'Živelná rizika' },
];

// Nabízené obchodní slevy (% z pojistného).
const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20];

// Mock voucher kódy → sleva v %. V reálu validuje backend.
const DISCOUNT_VOUCHERS: Record<string, number> = {
  STAR5: 5,
  STAR10: 10,
  STAR20: 20,
  VITEJTE: 15,
};

// Mock 3 nejlepších nabídek (v reálu z API pojišťoven).
const RICH_OFFERS: OfferCardData[] = [
  {
    id: 'csob',
    insurer: 'ČSOB',
    logoText: 'ČSOB',
    productName: 'PREMIANT',
    coverages: [
      { key: 'pov', iconKey: 'shield', label: 'Povinné ručení', value: '200/200 mil.' },
      { key: 'hav', iconKey: 'car', label: 'Havarijní', value: 'spoluúčast 5 %' },
      { key: 'asist', iconKey: 'wrench', label: 'Asistence', value: 'Standard' },
      { key: 'sklo', iconKey: 'glass', label: 'Sklo', value: '15 000 Kč' },
      { key: 'najezd', iconKey: 'mileage', label: 'Roční nájezd', value: '10 000 km' },
    ],
    addons: STANDARD_ADDONS,
    totalPrice: 5523,
  },
  {
    id: 'cpp',
    insurer: 'ČPP',
    logoText: 'ČPP',
    productName: 'tarif',
    notice:
      'ČPP v kalkulaci nevrací rozpis cen jednotlivých připojištění. Aktuální cena se vztahuje k vybrané POV variantě; rozpis připojištění bude k dispozici až ve sjednání.',
    coverages: [
      { key: 'pov', iconKey: 'shield', label: 'Povinné ručení', value: '50/50 mil.' },
      { key: 'hav', iconKey: 'car', label: 'Havarijní', value: null },
      { key: 'asist', iconKey: 'wrench', label: 'Asistence', value: null },
      { key: 'sklo', iconKey: 'glass', label: 'Sklo', value: null },
      { key: 'najezd', iconKey: 'mileage', label: 'Roční nájezd', value: '7 000 km' },
    ],
    addons: STANDARD_ADDONS,
    addonsNote:
      'Tato pojišťovna v kalkulaci nevrací rozpis cen jednotlivých připojištění. Stav výše je z balíčku, který kalkulace vrátila.',
    totalPrice: 14893,
  },
  {
    id: 'koop',
    insurer: 'Kooperativa',
    logoText: 'KOOP',
    productName: 'NA MÍRU 100',
    coverages: [
      { key: 'pov', iconKey: 'shield', label: 'Povinné ručení', value: '100/100 mil.' },
      { key: 'hav', iconKey: 'car', label: 'Havarijní', value: 'spoluúčast 10 %' },
      { key: 'asist', iconKey: 'wrench', label: 'Asistence', value: 'Základ' },
      { key: 'sklo', iconKey: 'glass', label: 'Sklo', value: '15 000 Kč' },
      { key: 'najezd', iconKey: 'mileage', label: 'Roční nájezd', value: '12 000 km' },
    ],
    addons: STANDARD_ADDONS,
    totalPrice: 6420,
  },
];

interface VehicleInsuranceCalculationPageProps {
  onStepChange?: (step: number) => void;
}

interface InsuranceOffer {
  id: string;
  insurer: string;
  logo: string;
  totalPrice: number;
  coverages: CoverageDetail[];
  hasDiscount?: boolean;
}

interface CoverageDetail {
  name: string;
  price: number;
  details: string[];
}

export const VehicleInsuranceCalculationPage: React.FC<VehicleInsuranceCalculationPageProps> = ({ onStepChange }) => {
  const [hoveredOfferIndex, setHoveredOfferIndex] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string>(RICH_OFFERS[0].id);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showEditParametersModal, setShowEditParametersModal] = useState(false);

  // Živé nabídky z Frenk API (null = zatím se použije mock RICH_OFFERS).
  const [liveOffers, setLiveOffers] = useState<OfferCardData[] | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveCarrierErrors, setLiveCarrierErrors] = useState<
    { insurer: string; code: number; message: string; details: { message?: string | null; fields?: Array<string | null> }[] }[]
  >([]);
  const [lastRawResponse, setLastRawResponse] = useState<unknown>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const copyRawJson = async () => {
    if (!lastRawResponse) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(lastRawResponse, null, 2));
      setCopyMsg('JSON zkopírován do schránky');
      setTimeout(() => setCopyMsg(null), 2500);
    } catch {
      setCopyMsg('Kopírování selhalo');
      setTimeout(() => setCopyMsg(null), 2500);
    }
  };

  // Reálné volání BFF. Vstup je zatím ukázkový (mapování polí z formuláře je další krok).
  const loadLiveOffers = async () => {
    setLiveLoading(true);
    setLiveError(null);
    const apiEnums: CarApiEnum[] = [
      'insurance-car-csob',
      'insurance-car-kooperativa',
      'insurance-car-cpp',
      'insurance-car-slavia',
      'insurance-car-pillow',
    ];
    const payload: CarCalculateInput = {
      apiEnums,
      beginDate: new Date().toISOString().slice(0, 10),
      payment: { frequency: 'annually', paymentType: 'card' },
      vehicle: {
        usage: 'normal',
        type: 'passenger',
        fuelType: 'benzine',
        brand: 'VOLVO',
        model: 'XC40',
        engineCapacityCc: 1498,
        enginePowerKw: 96,
        countPlace: 5,
        maxWeight: 1840,
        mileageKm: 120000,
        actualValue: 400000,
        vin: 'YV1XZK7V8R2253841',
      },
      liability: { selected: true, liabilityLimit: 150000 },
      accident: { selected: false },
      policyholder: {
        type: 'physical',
        firstName: 'Test',
        lastName: 'Testovací',
        birthNumber: '7001011116',
        address: {
          street: 'Nerudova',
          city: 'Litoměřice',
          houseNumber: '1059/34',
          zip: '14000',
          country: 'CZ',
          wholeAddress: 'Nerudova 1059/34, Litoměřice',
        },
        email: 'test@email.cz',
        phone: '777888999',
      },
    };

    try {
      const res = await fetch('/api/insurance/auta/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as CarCalculateResponse & { error?: string };
      // Dočasné: ukáže přesný tvar odpovědi v konzoli prohlížeče (Vývojář → Konzole).
      console.log('[frenk] calculate response:', JSON.stringify(data, null, 2));
      if (!res.ok) {
        throw new Error(data.error || `Chyba ${res.status}`);
      }
      setLastRawResponse(data);
      const { offers, errors } = mapCarResponseToOffers(data);
      setLiveCarrierErrors(errors);
      if (!offers.length) {
        throw new Error(
          errors.length
            ? `Žádná pojišťovna nevrátila cenu (${errors.length}× chyba upstream).`
            : 'Žádná pojišťovna nevrátila nabídku.',
        );
      }
      setLiveOffers(offers);
      setSelectedOfferId(offers[0].id);
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : 'Načtení nabídek selhalo.');
    } finally {
      setLiveLoading(false);
    }
  };

  // Co se reálně zobrazí: živé nabídky, jinak mock.
  const displayedOffers = liveOffers ?? RICH_OFFERS;
  // Modal slev – id nabídky, jejíž slevu zrovna upravujeme (null = zavřeno).
  const [showDiscountModal, setShowDiscountModal] = useState<string | null>(null);
  // Uplatněné slevy per nabídka (id → %).
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  // Pracovní stav modalu.
  const [modalPercent, setModalPercent] = useState(0);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const discountFor = (id: string) => discounts[id] || 0;

  const openDiscountModal = (id: string) => {
    setShowDiscountModal(id);
    setModalPercent(discountFor(id));
    setVoucherInput('');
    setVoucherMsg(null);
  };

  const closeDiscountModal = () => {
    setShowDiscountModal(null);
    setVoucherInput('');
    setVoucherMsg(null);
  };

  const applyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    const found = DISCOUNT_VOUCHERS[code];
    if (found) {
      setModalPercent(found);
      setVoucherMsg({ ok: true, text: `Voucher ${code} uplatněn – sleva ${found} %.` });
    } else {
      setVoucherMsg({ ok: false, text: 'Neplatný kód voucheru.' });
    }
  };

  const confirmDiscount = () => {
    if (!showDiscountModal) return;
    setDiscounts((prev) => ({ ...prev, [showDiscountModal]: modalPercent }));
    closeDiscountModal();
  };

  // Mock data - v produkci by přišly z API
  const offerNumber = '1982899';
  const insuranceStartDate = '17.09.2025';
  const clientName = 'Marek Machula';
  const clientAddress = 'Machulová 198, 687 06 Brno';
  const vehicleInfo = 'VW Golf 6 WAGON III';
  const vin = 'JMZGJ537234567905';
  const spz = '6H37321';
  const vehicleValue = '295 868 Kč';
  const processedBy = 'Alena Alenová';
  const processedByEmail = 'alena.alenova@starinsurance.cz';

  const offers: InsuranceOffer[] = [
    {
      id: '1',
      insurer: 'ČSOB',
      logo: 'ČSOB',
      totalPrice: 5523,
      coverages: [
        {
          name: 'PREMIANT',
          price: 2749,
          details: [
            'limit 200/200 mil. Kč',
            'základní asistence - info',
            'úraz řidiče (+ 300.000 Kč, TN 300.000 Kč)',
            'osobní věci řidiče a osob blízkých (15.000 Kč)',
            '10 tis Kč = újma na vlastním vozidle, zapůjčení náhradního vozidla',
          ],
        },
        {
          name: 'SKLA',
          price: 1103,
          details: [
            'limit 15 000 Kč, sú 10% (50% první tři měsíce)',
            'smluvní servis bez spoluúčasti',
          ],
        },
        {
          name: 'ROZŠÍŘENÁ ASISTENCE',
          price: 133,
          details: ['není pojištěno'],
        },
        {
          name: 'STŘET SE ZVĚŘÍ (připojištění)',
          price: 1127,
          details: [
            'limit 100 000 Kč, sú 500 Kč',
            'území Evropy a na území celého Turecka',
          ],
        },
        {
          name: 'ŽIVELNÍ RIZIKA (připojištění)',
          price: 544,
          details: [
            'limit 100 000 Kč, sú 500 Kč',
            'území Evropy a na území celého Turecka',
          ],
        },
      ],
    },
    {
      id: '2',
      insurer: 'CPP',
      logo: 'CPP',
      totalPrice: 6069,
      coverages: [
        {
          name: 'SPECIÁLPOV',
          price: 2579,
          details: [
            'limit 100/100 mil. Kč',
            'asistence STANDARD v ČR i Evropě - info',
            'úraz řidiče († 100.000 Kč, TN 150.000 Kč, DO 100 Kč)',
          ],
        },
        {
          name: 'VŠECHNA SKLA',
          price: 1920,
          details: [
            'limit 15 000 Kč, sú 30% první tři měsíce, následně 500 Kč',
            'sú 500 Kč ihned po prohlídce Global Expert',
            'smluvní servis',
          ],
        },
        {
          name: 'ROZŠÍŘENÁ ASISTENCE',
          price: 700,
          details: ['není pojištěno'],
        },
        {
          name: 'STŘET SE ZVĚŘÍ (připojištění)',
          price: 785,
          details: [
            'limit 100 000 Kč',
            'povinná prohlídka Global Expert',
          ],
        },
        {
          name: 'ŽIVELNÍ RIZIKA (připojištění)',
          price: 785,
          details: [
            'limit 100 000 Kč, sú 10%',
            'do 30 km vzdušnou čarou od českých hranic',
          ],
        },
      ],
    },
    {
      id: '3',
      insurer: 'Kooperativa',
      logo: 'Kooperativa',
      totalPrice: 6420,
      coverages: [
        {
          name: 'NA MÍRU 100',
          price: 2919,
          details: [
            'limit 100/100 mil. Kč',
            'základní asistence ZÁKLAD - info',
            'úraz řidiče (+ 100.000 Kč, TN 200.000 Kč)',
            'přímá likvidace',
          ],
        },
        {
          name: 'VŠECHNA SKLA',
          price: 2516,
          details: [
            'limit 15 000 Kč, sú 500 Kč',
            'prohlídka GLOBAL EXPERTS za poplatek 200Kč',
            'samoprohlídka zadarmo',
          ],
        },
        {
          name: 'ROZŠÍŘENÁ ASISTENCE',
          price: 342,
          details: ['není pojištěno'],
        },
        {
          name: 'STŘET SE ZVĚŘÍ (připojištění)',
          price: 719,
          details: [
            'limit 100 000 Kč, sú 1% min. 1000 Kč',
            'okus ANO',
          ],
        },
      ],
      hasDiscount: true,
    },
  ];

  const allOffers = [
    { insurer: 'Pillow', price: 10523 },
    { insurer: 'ČSOB', price: 5523, highlighted: true },
    { insurer: 'Generali', price: 7523 },
    { insurer: 'Generali', price: 8523 },
    { insurer: 'Pillow', price: 10533 },
    { insurer: 'CPP', price: 6069 },
    { insurer: 'Generali', price: 7523 },
    { insurer: 'Generali', price: 10500 },
    { insurer: 'Kooperativa', price: 6420 },
    { insurer: 'Generali', price: 7333 },
    { insurer: 'Generali', price: 10500 },
  ];

  const maxPrice = Math.max(...allOffers.map(o => o.price));

  // Funkce pro nalezení detailní nabídky podle indexu v allOffers
  const findOfferDetails = (index: number): InsuranceOffer | null => {
    const offer = allOffers[index];
    if (!offer) return null;
    
    // Najdeme detailní nabídku podle názvu pojišťovny a ceny
    const found = offers.find(o => o.insurer === offer.insurer && o.totalPrice === offer.price);
    if (found) return found;
    
    // Pokud není nalezeno, vytvoříme základní strukturu
    return {
      id: `mock-${offer.insurer}-${index}`,
      insurer: offer.insurer,
      logo: offer.insurer,
      totalPrice: offer.price,
      coverages: [
        {
          name: 'ZÁKLADNÍ POJIŠTĚNÍ',
          price: Math.floor(offer.price * 0.6),
          details: ['Detaily pojištění budou načteny z API'],
        },
      ],
    };
  };

  // Handler pro hover
  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    
    setHoveredOfferIndex(index);
    
    // Vypočítat pozici modalu - uprostřed nad sloupcem
    let modalX = rect.left + rect.width / 2;
    // Pokud by modal přesahoval vpravo, posunout doleva
    if (modalX + 192 > viewportWidth) {
      modalX = viewportWidth - 192 - 10;
    }
    // Pokud by modal přesahoval vlevo, posunout doprava
    if (modalX - 192 < 0) {
      modalX = 192 + 10;
    }
    
    setHoverPosition({
      x: modalX,
      y: rect.top + scrollY - 20,
    });
  };

  const handleMouseLeave = () => {
    // Zavřít modal když myš opustí sloupec
    setHoveredOfferIndex(null);
    setHoverPosition(null);
  };

  const hoveredOfferDetails = hoveredOfferIndex !== null ? findOfferDetails(hoveredOfferIndex) : null;

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-6 py-4 shadow-sm">
        <Stepper
          currentStep={3}
          steps={VEHICLE_STEPS}
          onStepClick={onStepChange}
        />
      </div>

      <main>
        {/* Header s gradientem */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-border mb-6">
          {/* Informace o nabídce */}
          <div className="px-6 md:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              {/* Rámeček 1: Nabídka pojištění + číslo a Datum počátku */}
              <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-foreground">Nabídka pojištění</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted">Nabídka číslo:</span>
                    <span className="text-sm text-muted ml-1">{offerNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Počátek pojištění:</span>
                    <span className="text-sm text-foreground font-medium ml-1">{insuranceStartDate}</span>
                  </div>
                </div>
              </div>

              {/* Rámeček 2: Informace o vozidle */}
              <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <h3 className="text-sm font-semibold text-foreground">Vozidlo</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">{vehicleInfo}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">VIN:</span>
                    <span className="text-sm text-muted ml-1">{vin}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">SPZ:</span>
                    <span className="text-sm text-muted ml-1">{spz}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Hodnota vozidla:</span>
                    <span className="text-sm text-foreground font-medium ml-1">{vehicleValue}</span>
                  </div>
                </div>
              </div>

              {/* Rámeček 3: Jméno zákazníka a adresa */}
              <div className="bg-surface border border-border rounded-xl shadow-sm p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#A82844]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-foreground">Klient</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">{clientName}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted">{clientAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tlačítka akcí - spodní část, zarovnaná vpravo */}
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowEditParametersModal(true)}
                className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium"
              >
                Upravit parametry
              </button>
            </div>
          </div>
        </div>

        {/* Sekce Nabídky pojistitelů */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Nabídky pojistitelů
              {liveOffers && (
                <span className="ml-2 align-middle text-xs font-medium text-success">● živá data</span>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {lastRawResponse !== null && (
                <button
                  type="button"
                  onClick={copyRawJson}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-border-strong"
                  title="Zkopíruje syrovou odpověď z /calculate (k poslání kolegovi do backendu)"
                >
                  {copyMsg ?? 'Zkopírovat JSON pro Toma'}
                </button>
              )}
              <button
                type="button"
                onClick={loadLiveOffers}
                disabled={liveLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#A82844] px-4 py-2 text-sm font-medium text-[#A82844] transition-colors hover:bg-brand-50 disabled:opacity-60"
              >
                {liveLoading ? 'Načítám z pojišťoven…' : 'Načíst živé nabídky'}
              </button>
            </div>
          </div>

          {liveError && (
            <div className="mb-4 rounded-lg border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
              Nepodařilo se načíst živé nabídky: {liveError}
              <span className="block text-xs text-muted">Zobrazují se ukázková data.</span>
            </div>
          )}

          {liveCarrierErrors.length > 0 && (
            <div className="mb-4 rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
              <div className="font-medium">Některé pojišťovny nevrátily cenu:</div>
              <ul className="mt-2 space-y-2 text-xs">
                {liveCarrierErrors.map((e) => (
                  <li key={e.insurer} className="rounded-md bg-surface/60 p-2">
                    <div className="font-semibold">
                      {e.insurer} <span className="font-normal text-muted">· {e.message} (kód {e.code})</span>
                    </div>
                    {e.details.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-4 text-foreground">
                        {e.details.map((d, i) => (
                          <li key={i} className="list-disc">
                            {d.message || '—'}
                            {Array.isArray(d.fields) && d.fields.filter(Boolean).length > 0 && (
                              <span className="ml-1 text-muted">
                                ({d.fields.filter(Boolean).join(', ')})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 items-start lg:grid-cols-3 gap-6">
            {displayedOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                selected={selectedOfferId === offer.id}
                onSelect={() => setSelectedOfferId(offer.id)}
                discountPercent={discountFor(offer.id)}
                onApplyDiscount={() => openDiscountModal(offer.id)}
              />
            ))}
          </div>
        </div>

        {/* Sekce Porovnání všech nabídek */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Porovnání všech nabídek
          </h2>
          <div className="bg-surface rounded-lg border border-border shadow-sm p-4 sm:p-6">
            {/* Na mobilu pevná šířka sloupců + vodorovné posouvání, na desktopu roztažení přes celou šířku */}
            <div className="flex items-end gap-2 h-64 relative overflow-x-auto pb-1">
              {allOffers.map((offer, idx) => {
                const height = (offer.price / maxPrice) * 100;
                const isHovered = hoveredOfferIndex === idx;
                return (
                  <div
                    key={idx}
                    className="flex w-16 shrink-0 flex-col items-center cursor-pointer group sm:w-auto sm:flex-1 sm:min-w-0"
                    onMouseEnter={(e) => handleMouseEnter(idx, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`whitespace-nowrap text-xs font-semibold mb-1 transition-colors ${isHovered ? 'text-[#A82844]' : 'text-foreground'}`}>
                      {offer.price.toLocaleString('cs-CZ')} Kč
                    </div>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isHovered
                          ? 'bg-gradient-to-t from-[#C63D56] to-[#8B1E38]'
                          : 'bg-border-strong'
                      }`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    <div className={`text-xs mt-2 text-center truncate w-full transition-colors ${isHovered ? 'text-[#A82844] font-semibold' : 'text-muted'}`}>
                      {offer.insurer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer s frekvencí platby a PDF */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">
              Frekvence platby:
            </label>
            <div className="relative">
              <select
                defaultValue="annual"
                className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 py-2.5 text-sm text-foreground shadow-sm focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none transition hover:border-border-strong min-w-[150px]"
              >
                <option value="annual">Roční</option>
                <option value="semi-annual">Půlroční</option>
                <option value="quarterly">Čtvrtletní</option>
                <option value="monthly">Měsíční</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-subtle"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <button
              type="button"
              className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium whitespace-nowrap sm:min-w-[160px]"
            >
              Odeslat emailem
            </button>
            <button
              type="button"
              className="px-4 py-2.5 border border-[#A82844] text-[#A82844] rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium whitespace-nowrap sm:min-w-[160px]"
            >
              Stáhnout PDF
            </button>
          </div>
        </div>
      </main>

      {/* Modal s detailem nabídky při hoveru */}
      {hoveredOfferDetails && hoverPosition && (
        <div
          className="fixed z-50 pointer-events-auto"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-surface rounded-2xl shadow-2xl border border-border w-96 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header s X tlačítkem, logem a cenou */}
            <div className="bg-gradient-to-r from-brand-50 via-brand-100 to-brand-50 px-6 py-4 relative flex-shrink-0">
              {/* X tlačítko - bílé vlevo nahoře */}
              <button
                type="button"
                onClick={() => {
                  setHoveredOfferIndex(null);
                  setHoverPosition(null);
                }}
                className="absolute top-4 left-4 z-10 w-6 h-6 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center justify-between w-full pl-8">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {hoveredOfferDetails.insurer}
                  </div>
                  {(hoveredOfferDetails.insurer === 'CPP' || hoveredOfferDetails.insurer === 'ČPP') && (
                    <div className="text-xs text-muted">VIENNA INSURANCE GROUP</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#C63D56] via-[#8B1E38] to-[#A82844] bg-clip-text text-transparent">
                    {hoveredOfferDetails.totalPrice.toLocaleString('cs-CZ')}
                  </div>
                  <div className="text-sm font-semibold text-[#A82844]">Kč</div>
                </div>
              </div>
            </div>

            {/* Seznam pojištění - scrollovatelný */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {hoveredOfferDetails.coverages.map((coverage, idx) => {
                  const isDisabled = coverage.details[0] === 'není pojištěno';
                  return (
                    <div key={idx} className="border-b border-border pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold ${isDisabled ? 'text-subtle' : 'text-foreground'}`}>
                          {coverage.name}
                        </span>
                        <span className={`text-sm font-bold ml-2 whitespace-nowrap ${isDisabled ? 'text-subtle' : 'text-foreground'}`}>
                          {coverage.price.toLocaleString('cs-CZ')} Kč
                        </span>
                      </div>
                      <ul className={`text-xs space-y-1 ${isDisabled ? 'text-subtle' : 'text-muted'}`}>
                        {coverage.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-start">
                            <span className="mr-2">-</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tlačítko Přidat do nabídky - zelené */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <PrimaryButton className="w-full">
                Přidat do nabídky
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Modální okno pro obchodní slevy */}
      {showDiscountModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeDiscountModal}
        >
          <div
            className="bg-surface rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#C63D56] via-[#8B1E38] to-[#A82844] px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Obchodní slevy</h3>
                <button
                  type="button"
                  onClick={closeDiscountModal}
                  className="text-white hover:text-subtle transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Výběr slevy */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Výše slevy</label>
                <div className="flex flex-wrap gap-2">
                  {DISCOUNT_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setModalPercent(d);
                        setVoucherMsg(null);
                      }}
                      className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                        modalPercent === d
                          ? 'border-[#A82844] bg-brand-50 text-[#A82844]'
                          : 'border-border bg-surface text-foreground hover:border-border-strong'
                      }`}
                    >
                      {d === 0 ? 'Bez slevy' : `${d} %`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voucher */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  …nebo zadejte kód voucheru
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyVoucher()}
                    className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-[#A82844] focus:ring-2 focus:ring-[#A82844]/70 focus:outline-none"
                    placeholder="Např. STAR10"
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    className="shrink-0 rounded-lg border border-[#A82844] px-4 py-2 text-sm font-medium text-[#A82844] transition-colors hover:bg-brand-50"
                  >
                    Použít
                  </button>
                </div>
                {voucherMsg && (
                  <p className={`mt-2 text-xs font-medium ${voucherMsg.ok ? 'text-success' : 'text-danger'}`}>
                    {voucherMsg.text}
                  </p>
                )}
              </div>

              {/* Souhrn */}
              <div className="rounded-lg bg-surface-muted px-4 py-3 text-sm">
                {modalPercent > 0 ? (
                  <span className="font-medium text-foreground">
                    Uplatněná sleva: <span className="text-[#A82844]">{modalPercent} %</span>
                  </span>
                ) : (
                  <span className="text-muted">Zatím není zvolena žádná sleva.</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <SecondaryButton onClick={closeDiscountModal}>Zrušit</SecondaryButton>
              <PrimaryButton onClick={confirmDiscount}>Uplatnit slevu</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Modální okno pro úpravu parametrů */}
      {showEditParametersModal && (
        <div className="fixed inset-0 bg-muted bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col my-8">
            {/* Header modálního okna */}
            <div className="flex-shrink-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Upravit parametry pojištění</h2>
              <button
                type="button"
                onClick={() => setShowEditParametersModal(false)}
                className="text-subtle hover:text-muted transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Obsah - stránka Parametry pojištění bez headeru a stepperu */}
            <div className="flex-1 overflow-y-auto bg-[#F4F1EC]">
              <VehicleInsuranceAdditionalPage 
                hideHeader={true}
                hideStepper={true}
                onStepChange={(step) => {
                  // Pokud uživatel klikne na stepper v modálním okně, zavřeme modální okno
                  if (step !== 2) {
                    setShowEditParametersModal(false);
                    if (onStepChange) {
                      onStepChange(step);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

