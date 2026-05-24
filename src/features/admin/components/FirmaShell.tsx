'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Building2, LayoutDashboard, Palette, Percent, Settings, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useFirmaCompany } from '../FirmaCompanyProvider';
import { applyBranding, resetBranding } from '../branding';

const NAV = [
  { label: 'Přehled', href: '/firma', icon: LayoutDashboard },
  { label: 'Uživatelé', href: '/firma/uzivatele', icon: Users },
  { label: 'Pojišťovny', href: '/firma/pojistovny', icon: ShieldCheck },
  { label: 'Provize', href: '/firma/provize', icon: Percent },
  { label: 'Vzhled', href: '/firma/vzhled', icon: Palette },
  { label: 'Nastavení firmy', href: '/firma/nastaveni', icon: Settings },
];

export function FirmaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const company = useFirmaCompany();
  const isSuperAdmin = user?.role === 'admin';

  // White-label: aplikuj barvu firmy v rámci administrace firmy, po odchodu vrať default.
  useEffect(() => {
    if (company?.brandColor) applyBranding(company.brandColor);
    else resetBranding();
    return () => resetBranding();
  }, [company?.brandColor]);

  const isActive = (href: string) => (href === '/firma' ? pathname === '/firma' : pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          {company?.brandLogoUrl ? (
            <img src={company.brandLogoUrl} alt="logo" className="h-8 w-8 rounded-lg object-contain" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-2xs font-bold text-white">
              {company?.brandLogoText || <Building2 className="h-4 w-4" />}
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-foreground">{company?.name ?? 'Firma'}</div>
            <div className="text-2xs font-medium uppercase tracking-wide text-subtle">Administrace firmy</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-muted hover:bg-surface-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href={isSuperAdmin ? '/admin/firmy' : '/dashboard'}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {isSuperAdmin ? 'Zpět do administrace' : 'Zpět do hubu'}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-5 py-3 backdrop-blur">
          <nav className="flex gap-1 overflow-x-auto lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive(item.href) ? 'bg-brand-50 text-brand-700' : 'text-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{company?.name}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {(user?.name ?? 'FA')
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
