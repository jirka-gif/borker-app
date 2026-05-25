'use client';

import React, { useState } from 'react';
import {
  Activity,
  Briefcase,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Info,
  LayoutGrid,
  type LucideIcon,
  Route,
  Scale,
  Shield,
  Wrench,
} from 'lucide-react';

/**
 * Sdílená karta nabídky pojištění (3 nejlepší) – používaná napříč produkty
 * (vozidla, majetek, cestovní, …). Nahoře hlavní rizika, pod nimi rozbalovací
 * sekce připojištění s přepínači. Připojištění a ceny v reálu vrací webové
 * služby (API) pojišťoven – zde jsou na mocku, struktura je připravená.
 */

const COVERAGE_ICONS: Record<string, LucideIcon> = {
  shield: Shield,
  car: Car,
  wrench: Wrench,
  glass: LayoutGrid,
  mileage: Route,
  health: HeartPulse,
  accident: Activity,
  liability: Shield,
  legal: Scale,
  baggage: Briefcase,
};

export interface OfferCoverage {
  key: string;
  /** Volitelná ikona; bez ní se zobrazí jen řádek s textem. */
  iconKey?: keyof typeof COVERAGE_ICONS | string;
  label: string;
  /** Hodnota krytí, nebo null pokud není v balíčku (zobrazí se „—"). */
  value: string | null;
  /** Zobrazí „✓" před hodnotou (kryto / v rámci balíčku). */
  included?: boolean;
}

export interface OfferAddon {
  key: string;
  label: string;
  defaultOn?: boolean;
}

export interface OfferCardData {
  id: string;
  insurer: string;
  /** Krátký text/iniciály do loga. */
  logoText: string;
  /** Např. „tarif", „Excelent". */
  productName: string;
  /** Informační notice (žlutý box) – např. když pojišťovna nevrací rozpis. */
  notice?: string;
  coverages: OfferCoverage[];
  addons: OfferAddon[];
  /** Poznámka pod přepínači (např. že rozpis cen není k dispozici). */
  addonsNote?: string;
  /** Hlavní cena v Kč. */
  totalPrice: number;
  /** Přípona za cenou (default „/ ročně"). Prázdný řetězec = bez přípony. */
  priceSuffix?: string;
  /** Druhý řádek pod cenou. null = skrýt, undefined = „X celkem". */
  priceNote?: string | null;
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex items-center gap-2"
    >
      <span className={`text-sm font-medium ${on ? 'text-brand-600' : 'text-muted'}`}>
        {on ? 'Ano' : 'Ne'}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          on ? 'bg-brand-600' : 'bg-border-strong'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${
            on ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

interface OfferCardProps {
  offer: OfferCardData;
  selected: boolean;
  onSelect: () => void;
  /** Sleva v % uplatněná na cenu (0 = bez slevy). */
  discountPercent?: number;
  /** Když je předáno, zobrazí se tlačítko „Slevy" otevírající modal. */
  onApplyDiscount?: () => void;
}

export function OfferCard({
  offer,
  selected,
  onSelect,
  discountPercent = 0,
  onApplyDiscount,
}: OfferCardProps) {
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(offer.addons.map((a) => [a.key, Boolean(a.defaultOn)])),
  );
  const [addonsOpen, setAddonsOpen] = useState(true);

  const activeCount = Object.values(active).filter(Boolean).length;
  const toggleAddon = (key: string) =>
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));

  const priceSuffix = offer.priceSuffix ?? '/ ročně';
  const priceNote =
    offer.priceNote === undefined ? `${formatCzk(offer.totalPrice)} celkem` : offer.priceNote;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition-all ${
        selected ? 'border-brand-600 shadow-card-brand' : 'border-border'
      }`}
    >
      {/* Hlavička – logo, název, výběr */}
      <button
        type="button"
        onClick={onSelect}
        className="flex items-start justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-sm font-bold text-brand-700">
            {offer.logoText}
          </div>
          <div>
            <div className="text-2xs font-medium uppercase tracking-wide text-subtle">
              {offer.insurer}
            </div>
            <div className="text-base font-semibold text-foreground">{offer.productName}</div>
          </div>
        </div>
        <span
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected ? 'border-brand-600 bg-brand-600' : 'border-border-strong'
          }`}
          aria-hidden="true"
        >
          {selected && <span className="h-2 w-2 rounded-full bg-surface" />}
        </span>
      </button>

      {/* Informační notice */}
      {offer.notice && (
        <div className="mx-5 mb-4 flex gap-2 rounded-lg border border-warning/30 bg-warning-bg px-3 py-2.5 text-xs leading-relaxed text-warning">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{offer.notice}</span>
        </div>
      )}

      {/* Hlavní rizika */}
      <div className="px-5">
        {offer.coverages.map((cov) => {
          const CovIcon = cov.iconKey ? COVERAGE_ICONS[cov.iconKey] ?? Shield : null;
          const disabled = cov.value === null;
          return (
            <div
              key={cov.key}
              className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="flex items-center gap-2.5">
                {CovIcon && (
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      disabled ? 'bg-surface-muted text-subtle' : 'bg-brand-50 text-brand-600'
                    }`}
                  >
                    <CovIcon className="h-4 w-4" />
                  </span>
                )}
                <span
                  className={`text-sm font-medium ${disabled ? 'text-subtle' : 'text-foreground'}`}
                >
                  {cov.label}
                </span>
              </span>
              <span
                className={`flex items-center gap-1 text-sm font-semibold ${
                  disabled ? 'text-subtle' : 'text-foreground'
                }`}
              >
                {cov.included && cov.value !== null && (
                  <Check className="h-3.5 w-3.5 text-brand-600" />
                )}
                {cov.value ?? '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Připojištění – rozbalovací */}
      <div className="mt-4 px-5">
        <button
          type="button"
          onClick={() => setAddonsOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700"
        >
          <span>
            <span className="font-semibold">{activeCount}</span> z {offer.addons.length} připojištění aktivní
          </span>
          {addonsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {addonsOpen && (
          <div className="mt-1">
            {offer.addons.map((addon) => (
              <div
                key={addon.key}
                className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="text-sm font-medium text-foreground">{addon.label}</span>
                <Toggle on={Boolean(active[addon.key])} onToggle={() => toggleAddon(addon.key)} />
              </div>
            ))}
          </div>
        )}

        {offer.addonsNote && (
          <p className="mt-3 text-xs leading-relaxed text-subtle">{offer.addonsNote}</p>
        )}

        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-2 hover:underline"
        >
          Pojistné podmínky
          <Info className="h-4 w-4 text-subtle" />
        </button>
      </div>

      {/* Tlačítko slev (volitelné) */}
      {onApplyDiscount && (
        <div className="mt-4 px-5">
          <button
            type="button"
            onClick={onApplyDiscount}
            className="w-full rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-200"
          >
            {discountPercent > 0 ? `Sleva ${discountPercent} % uplatněna` : 'Uplatnit slevy'}
          </button>
        </div>
      )}

      {/* Patička – cena */}
      <div className="mt-4 border-t border-border bg-surface-muted px-5 py-4 text-center">
        {discountPercent > 0 && (
          <div className="text-sm text-muted line-through">
            {formatCzk(offer.totalPrice)}
            {priceSuffix && <span> {priceSuffix}</span>}
          </div>
        )}
        <div className="text-xl font-bold text-foreground">
          {formatCzk(Math.round(offer.totalPrice * (1 - discountPercent / 100)))}
          {priceSuffix && <span className="text-sm font-medium text-muted"> {priceSuffix}</span>}
        </div>
        {discountPercent > 0 ? (
          <div className="mt-0.5 text-xs font-semibold text-success">Sleva {discountPercent} %</div>
        ) : (
          priceNote && <div className="mt-0.5 text-xs text-muted">{priceNote}</div>
        )}
      </div>
    </div>
  );
}
