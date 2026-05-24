"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./TopNav";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

/**
 * Chráněný layout hubu. Bez sidebaru – navigace je v plovoucí horní liště
 * a obsah využívá celou šířku obrazovky. ThemeProvider sedí výš v RootLayoutu,
 * aby se přepínač režimu mohl projevit i na login obrazovce.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { initializing, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) router.replace("/login");
  }, [initializing, isAuthenticated, router]);

  if (initializing || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          <Logo size="lg" iconOnly />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-7 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
