'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { AdminDataProvider } from '@/features/admin/AdminDataProvider';
import { AdminShell } from '@/features/admin/components/AdminShell';

/**
 * Layout globální administrace. Přístup má pouze Super Admin (role „admin").
 * Běžný poradce je přesměrován do hubu. (Tenant izolace a serverová kontrola
 * rolí se doplní s backendem.)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  const allowed = user?.role === 'admin';

  useEffect(() => {
    if (!initializing && !allowed) router.replace('/dashboard');
  }, [initializing, allowed, router]);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Načítání administrace…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-muted">
        Do globální administrace má přístup pouze Super Admin. Přesměrováváme vás do hubu…
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
