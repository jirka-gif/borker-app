'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Clock,
  Package,
  ScrollText,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Select } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { MOCK_DEAL_VOLUMES } from '@/features/admin/mockData';
import { PageHeader, StatCard } from '@/features/admin/components/primitives';
import { MOCK_PRODUCTION, PRODUCTION_PERIODS, periodLabel, sumBy } from '@/features/admin/production';
import { PRODUCT_TYPE_LABELS, type ProductType } from '@/features/admin/types';

function czk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(value);
}

/** Horizontální sloupcový žebříček produkce. */
function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((r) => r.value), 1);
  return (
    <div className="space-y-2.5">
      {sorted.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{r.label}</span>
            <span className="shrink-0 font-medium text-muted">{czk(r.value)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
              style={{ width: `${Math.max((r.value / max) * 100, 2)}%` }}
            />
          </div>
        </div>
      ))}
      {sorted.length === 0 && <p className="text-sm text-muted">Žádná produkce v tomto období.</p>}
    </div>
  );
}

interface InsurerRow {
  id: string;
  label: string;
  total: number;
  products: { label: string; value: number }[];
}

/** Produkce podle pojišťoven s rozbalením rozpadu po produktech. */
function InsurerProductionBars({ rows }: { rows: InsurerRow[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const max = Math.max(...rows.map((r) => r.total), 1);

  if (rows.length === 0) return <p className="text-sm text-muted">Žádná produkce v tomto období.</p>;

  return (
    <div className="space-y-1.5">
      {rows.map((r) => {
        const isOpen = Boolean(open[r.id]);
        const prodMax = Math.max(...r.products.map((p) => p.value), 1);
        return (
          <div key={r.id} className="rounded-lg">
            <button
              type="button"
              onClick={() => setOpen((p) => ({ ...p, [r.id]: !p[r.id] }))}
              className="w-full rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-surface-muted/50"
            >
              <div className="mb-1 flex items-baseline gap-2 text-sm">
                {isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />}
                <span className="truncate text-foreground">{r.label}</span>
                <span className="ml-auto shrink-0 font-medium text-muted">{czk(r.total)}</span>
              </div>
              <div className="ml-5 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                  style={{ width: `${Math.max((r.total / max) * 100, 2)}%` }}
                />
              </div>
            </button>

            {isOpen && (
              <div className="ml-5 mt-2 space-y-2 border-l border-border pl-3">
                {r.products
                  .sort((a, b) => b.value - a.value)
                  .map((p) => (
                    <div key={p.label}>
                      <div className="mb-0.5 flex items-baseline justify-between gap-3 text-xs">
                        <span className="truncate text-muted">{p.label}</span>
                        <span className="shrink-0 text-subtle">{czk(p.value)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-brand-300"
                          style={{ width: `${Math.max((p.value / prodMax) * 100, 3)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { insurers, products, companies, users, audit } = useAdminData();
  const [period, setPeriod] = useState('vse');

  const insurerName = (id: string) => insurers.find((i) => i.id === id)?.tradeName ?? id;
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  const insurerProduction = useMemo(() => {
    const filtered = period === 'vse' ? MOCK_PRODUCTION : MOCK_PRODUCTION.filter((e) => e.period === period);
    const map = new Map<string, { total: number; products: Record<string, number> }>();
    for (const e of filtered) {
      const cur = map.get(e.insurerId) ?? { total: 0, products: {} };
      cur.total += e.volume;
      cur.products[e.productType] = (cur.products[e.productType] ?? 0) + e.volume;
      map.set(e.insurerId, cur);
    }
    return Array.from(map.entries())
      .map(([id, v]) => ({
        id,
        label: insurerName(id),
        total: v.total,
        products: Object.entries(v.products).map(([t, value]) => ({
          label: PRODUCT_TYPE_LABELS[t as ProductType] ?? t,
          value,
        })),
      }))
      .sort((a, b) => b.total - a.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, insurers]);

  const byProduct = useMemo(() => {
    const agg = sumBy(MOCK_PRODUCTION, period, 'productType');
    return Object.entries(agg).map(([t, value]) => ({ label: PRODUCT_TYPE_LABELS[t as ProductType] ?? t, value }));
  }, [period]);

  const byCompany = useMemo(() => {
    const agg = sumBy(MOCK_PRODUCTION, period, 'companyId');
    return Object.entries(agg).map(([id, value]) => ({ label: companyName(id), value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, companies]);

  const activeInsurers = insurers.filter((i) => i.status === 'aktivni').length;
  const activeProducts = products.filter((p) => p.status === 'aktivni').length;
  const activeCompanies = companies.filter((c) => c.status === 'aktivni').length;

  // Průměrná provize firem → výpočet provize z objemu obchodů.
  const avgPct = companies.length
    ? companies.reduce((s, c) => s + (c.commissionPercent || 0), 0) / companies.length
    : 0;
  const commission = (volume: number) => Math.round((volume * avgPct) / 100);

  const dealCards = [
    { label: 'Neuzavřené obchody', volume: MOCK_DEAL_VOLUMES.neuzavrene, icon: <CircleDashed className="h-5 w-5" />, tone: 'text-warning' },
    { label: 'Rozpracované obchody', volume: MOCK_DEAL_VOLUMES.rozpracovane, icon: <Clock className="h-5 w-5" />, tone: 'text-info' },
    { label: 'Dokončené obchody', volume: MOCK_DEAL_VOLUMES.dokoncene, icon: <CheckCircle2 className="h-5 w-5" />, tone: 'text-success' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Přehled platformy Star Insurance Group." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pojišťovny" value={insurers.length} hint={`${activeInsurers} aktivních`} icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="Produkty" value={products.length} hint={`${activeProducts} aktivních`} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Firmy" value={companies.length} hint={`${activeCompanies} aktivních`} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Uživatelé" value={users.length} hint="napříč firmami" icon={<Users className="h-5 w-5" />} />
      </div>

      {/* Objem obchodů a provize */}
      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-foreground">Objem obchodů a provize</h2>
          <span className="text-xs text-subtle">Provize počítána průměrnou sazbou firem {avgPct.toFixed(1)} %</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dealCards.map((d) => (
            <div key={d.label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">{d.label}</span>
                <span className={d.tone}>{d.icon}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">{czk(d.volume)}</div>
              <div className="mt-1 text-xs text-subtle">objem (roční pojistné)</div>
              <div className="mt-3 border-t border-border pt-3">
                <div className="text-sm font-semibold text-brand-700">{czk(commission(d.volume))}</div>
                <div className="text-xs text-muted">odhad provize</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Produkce */}
      <div className="mt-8">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-semibold text-foreground">Produkce</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-subtle">Období sjednání:</span>
            <div className="w-44">
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={[
                  { value: 'vse', label: 'Vše' },
                  ...[...PRODUCTION_PERIODS].reverse().map((p) => ({ value: p, label: periodLabel(p) })),
                ]}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Produkce podle pojišťoven</h3>
            <p className="mb-4 text-xs text-subtle">Rozklikněte pojišťovnu pro rozpad po produktech.</p>
            <InsurerProductionBars rows={insurerProduction} />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Produkce podle produktů</h3>
            <Bars rows={byProduct} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Porovnání firem / makléřů podle produkce</h3>
          <Bars rows={byCompany} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Poslední aktivita */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-semibold text-foreground">Poslední aktivita</h2>
            </div>
            <div className="space-y-3">
              {audit.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-foreground">{a.summary}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {a.who} · {a.entity}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-subtle">{a.at}</span>
                </div>
              ))}
            </div>
            <Link href="/admin/audit" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
              Zobrazit celý audit log →
            </Link>
          </div>
        </div>

        {/* Rychlé akce */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">Rychlé akce</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/firmy', label: 'Založit makléřskou firmu', icon: Building2 },
              { href: '/admin/pojistovny', label: 'Přidat pojišťovnu', icon: ShieldCheck },
              { href: '/admin/produkty', label: 'Přidat produkt', icon: Package },
              { href: '/admin/uzivatele', label: 'Spravovat uživatele', icon: Users },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-600 hover:bg-brand-50"
              >
                <Icon className="h-4 w-4 text-brand-600" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
