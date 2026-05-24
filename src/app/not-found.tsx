import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo size="lg" iconOnly className="mb-6" />
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-foreground">
        Stránka nenalezena
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Tato stránka neexistuje nebo byla přesunuta.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Zpět na dashboard
      </Link>
    </main>
  );
}
