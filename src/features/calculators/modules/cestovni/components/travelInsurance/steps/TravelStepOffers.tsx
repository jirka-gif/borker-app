import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, MapPin, Users } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../../components/ui/Button';
import { TravelFormValues } from '../TravelInsuranceCalculator';
import { TravelOffer } from '../../../lib/travelQuotes';
import {
  OfferCard,
  type OfferCardData,
  type OfferCoverage,
} from '../../../../../shared/OfferCard';

interface TravelStepOffersProps {
  offers: TravelOffer[];
  onNext: () => void;
  onBack: () => void;
}

// Hlavní krytí cestovního pojištění (v reálu vrací API pojišťovny).
const TRAVEL_COVERAGES: OfferCoverage[] = [
  { key: 'health', iconKey: 'health', label: 'Léčebné výlohy', value: 'Zahrnuto', included: true },
  { key: 'accident', iconKey: 'accident', label: 'Úraz', value: 'Dle podmínek' },
  { key: 'liability', iconKey: 'liability', label: 'Odpovědnost', value: 'Dle podmínek', included: true },
  { key: 'legal', iconKey: 'legal', label: 'Právní asistence', value: 'Dle podmínek' },
  { key: 'baggage', iconKey: 'baggage', label: 'Zavazadla', value: 'Dle podmínek' },
];

// Standardní připojištění (toggle) – v reálu vrací API pojišťovny.
const TRAVEL_ADDONS = [
  { key: 'storno', label: 'Storno zájezdu' },
  { key: 'rizikove-sporty', label: 'Rizikové sporty' },
  { key: 'sportovni-vybava', label: 'Sportovní výbava' },
  { key: 'uraz', label: 'Úraz' },
  { key: 'zavazadla', label: 'Zavazadla' },
  { key: 'asistence-vozidla', label: 'Asistence vozidla' },
  { key: 'nahradni-vozidlo', label: 'Náhradní vozidlo' },
  { key: 'manualni-prace', label: 'Manuální práce' },
];

function initials(name: string): string {
  return name.replace(/[^A-Za-zÁ-Žá-ž]/g, '').slice(0, 2).toUpperCase();
}

const ZONE_LABELS: Record<string, string> = {
  eu: 'Evropa',
  world: 'Svět (bez USA)',
  world_with_usa: 'Celý svět',
  cz: 'Česká republika',
};

const TRANSPORT_LABELS: Record<string, string> = {
  plane: 'Letadlem',
  car: 'Autem',
  car_and_plane: 'Autem i letadlem',
  other: 'Vše ostatní',
};

const TRIP_TYPE_LABELS: Record<string, string> = {
  work: 'Pracovní',
  relax: 'Relax',
  adrenaline: 'Adrenalin & Sport',
  organized_sport: 'Organizovaný sport',
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('cs-CZ');
}

function travellersLabel(n: number): string {
  if (n === 1) return '1 osoba';
  if (n >= 2 && n <= 4) return `${n} osoby`;
  return `${n} osob`;
}

function toOfferCardData(offer: TravelOffer): OfferCardData {
  return {
    id: offer.id,
    insurer: offer.insurerName,
    logoText: initials(offer.insurerName),
    productName: offer.productName,
    coverages: TRAVEL_COVERAGES,
    addons: TRAVEL_ADDONS,
    totalPrice: offer.totalPrice,
    priceSuffix: '',
    priceNote: null,
  };
}

export function TravelStepOffers({ offers, onNext, onBack }: TravelStepOffersProps) {
  const { setValue, getValues } = useFormContext<TravelFormValues>();
  const v = getValues();
  const zoneLabel = ZONE_LABELS[v.destinationZone] ?? '—';
  const term = v.fullYearInsurance
    ? 'Celoroční pojištění'
    : v.dateFrom || v.dateTo
      ? `${formatDate(v.dateFrom)} – ${formatDate(v.dateTo)}`
      : '—';
  const travellersCount = v.travellers?.length ?? 0;

  const sortedOffers = [...offers].sort((a, b) => a.totalPrice - b.totalPrice);
  const topThree = sortedOffers.slice(0, 3);
  const maxPrice = Math.max(...sortedOffers.map((o) => o.totalPrice), 1);

  const [selectedId, setSelectedId] = useState<string>(topThree[0]?.id ?? '');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      maximumFractionDigits: 0,
    }).format(price);

  const handleSelect = (offer: TravelOffer) => {
    setSelectedId(offer.id);
    setValue('coverageLevel', offer.coverageLevel);
  };

  return (
    <div className="space-y-8">
      {/* Souhrn zadání */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Nabídka pojištění</h3>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted">Nabídka číslo:</span>
                <span className="ml-1 text-sm text-muted">2042318</span>
              </div>
              <div>
                <span className="text-xs text-muted">Termín:</span>
                <span className="ml-1 text-sm font-medium text-foreground">{term}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Cesta</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">{zoneLabel}</div>
              <div>
                <span className="text-xs text-muted">Doprava:</span>
                <span className="ml-1 text-sm text-muted">
                  {TRANSPORT_LABELS[v.transportation] ?? '—'}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted">Typ cesty:</span>
                <span className="ml-1 text-sm text-muted">
                  {TRIP_TYPE_LABELS[v.tripType] ?? '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Cestující</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                {travellersLabel(travellersCount)}
              </div>
              {v.travellers?.[0]?.name && (
                <div className="text-sm text-muted">
                  {v.travellers
                    .map((t) => t.name)
                    .filter(Boolean)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-brand-600 px-4 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            Upravit zadání
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-1 text-foreground">
          Našli jsme {offers.length}{' '}
          {offers.length === 1 ? 'nabídku' : offers.length < 5 ? 'nabídky' : 'nabídek'} pro tvoji cestu
        </h2>
        <p className="text-muted">Vyber si pojišťovnu a připojištění podle tvých potřeb</p>
      </div>

      {/* 3 nejlepší nabídky – stejná karta jako u vozidel a majetku */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Nejlepší nabídky</h3>
        <div className="grid grid-cols-1 items-start lg:grid-cols-3 gap-6">
          {topThree.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={toOfferCardData(offer)}
              selected={selectedId === offer.id}
              onSelect={() => handleSelect(offer)}
            />
          ))}
        </div>
      </div>

      {/* Porovnání všech nabídek – sloupcový graf */}
      {sortedOffers.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Porovnání všech nabídek</h3>
          <div className="rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6">
            <div className="flex h-64 items-end gap-2 overflow-x-auto pb-1">
              {sortedOffers.map((offer, idx) => {
                const height = (offer.totalPrice / maxPrice) * 100;
                const isHovered = hoveredIndex === idx;
                const isSelected = selectedId === offer.id;
                return (
                  <div
                    key={offer.id}
                    className="flex w-16 shrink-0 cursor-pointer flex-col items-center sm:w-auto sm:min-w-0 sm:flex-1"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleSelect(offer)}
                  >
                    <div
                      className={`mb-1 whitespace-nowrap text-xs font-semibold transition-colors ${
                        isHovered || isSelected ? 'text-[#A82844]' : 'text-foreground'
                      }`}
                    >
                      {formatPrice(offer.totalPrice)}
                    </div>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isHovered || isSelected
                          ? 'bg-gradient-to-t from-[#C63D56] to-[#8B1E38]'
                          : 'bg-border-strong'
                      }`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    <div
                      className={`mt-2 w-full truncate text-center text-xs transition-colors ${
                        isHovered || isSelected ? 'font-semibold text-[#A82844]' : 'text-muted'
                      }`}
                    >
                      {offer.insurerName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <SecondaryButton onClick={onBack}>Zpět</SecondaryButton>
        <PrimaryButton onClick={onNext} disabled={!selectedId}>
          Pokračovat
        </PrimaryButton>
      </div>
    </div>
  );
}
