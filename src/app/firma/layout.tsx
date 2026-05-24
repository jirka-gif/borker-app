'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { AdminDataProvider } from '@/features/admin/AdminDataProvider';
import { FirmaCompanyProvider } from '@/features/admin/FirmaCompanyProvider';
import { FirmaShell } from '@/features/admin/components/FirmaShell';

/**
 * Layout administrace firmy (tenant). Přístup má odpovědná osoba firmy
 * (firma-admin / manažer) a super admin (může firmu otevřít).
 */
export default function FirmaLayout({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const allowed = ['admin', 'firma-admin', 'manazer'].includes(user?.role ?? '');

  useEffect(() => {
    if (!initializing && !allowed) router.replace('/dashboard');
  }, [initializing, allowed, router]);

  if (initializing) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Načítání…</div>;
  }
  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-muted">
        Nemáte oprávnění k administraci firmy. Přesměrováváme vás…
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <Suspense fallback={null}>
        <FirmaCompanyProvider>
          <FirmaShell>{children}</FirmaShell>
        </FirmaCompanyProvider>
      </Suspense>
    </AdminDataProvider>
  );
}
