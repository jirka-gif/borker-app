"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User as UserIcon,
  X,
} from "lucide-react";
import { Avatar, Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  poradce: "Poradce",
  manazer: "Manažer",
  admin: "Administrátor",
  partner: "Partner",
  externista: "Externista",
};

/**
 * Plovoucí horní lišta hubu. Navigace v zaobalené kartě s lehkým stínem,
 * vlevo logo, vpravo hledání, přepínač režimu, notifikace a uživatel.
 */
export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex h-[58px] max-w-[1440px] items-center gap-2 rounded-2xl border border-border bg-surface/90 px-3 shadow-card backdrop-blur-md">
        {/* Logo + jemný separátor */}
        <div className="flex items-center gap-2 border-r border-border pr-3">
          <Link href="/dashboard" className="shrink-0 px-1">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigace (desktop) */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
              >
                <Icon name={item.iconKey} className="h-[18px] w-[18px]" />
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[3px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-brand-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Vyhledávání */}
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              placeholder="Hledat klienta, kalkulaci…"
              className="h-9 w-56 rounded-lg border border-transparent bg-surface-muted pl-9 pr-3 text-sm text-foreground placeholder:text-subtle transition-[width,background,border-color,box-shadow] hover:border-border-strong focus-visible:w-72 focus-visible:border-brand-400 focus-visible:bg-surface focus-visible:shadow-focus"
            />
          </div>

          {/* Přepínač režimu */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label={theme === "dark" ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          {/* Notifikace */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Notifikace"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-2 border-surface bg-brand-600"
            />
          </button>

          {/* Uživatel */}
          <Dropdown
            align="right"
            trigger={
              <span className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-surface-muted sm:pr-2.5">
                <Avatar name={user?.name ?? "?"} size="sm" />
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                  <span className="block text-2xs text-muted">
                    {user ? (ROLE_LABEL[user.role] ?? user.role) : ""}
                  </span>
                </span>
              </span>
            }
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <DropdownSeparator />
            {user?.role === "admin" && (
              <DropdownItem
                icon={<ShieldCheck className="h-4 w-4" />}
                onClick={() => router.push("/admin")}
              >
                Administrace platformy
              </DropdownItem>
            )}
            {["admin", "firma-admin", "manazer"].includes(user?.role ?? "") && (
              <DropdownItem
                icon={<Building2 className="h-4 w-4" />}
                onClick={() => router.push("/firma")}
              >
                Administrace firmy
              </DropdownItem>
            )}
            <DropdownItem icon={<UserIcon className="h-4 w-4" />}>
              Můj profil
            </DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />}>
              Nastavení
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              icon={<LogOut className="h-4 w-4" />}
              destructive
              onClick={logout}
            >
              Odhlásit se
            </DropdownItem>
          </Dropdown>

          {/* Mobilní přepínač menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobilní menu */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-[1440px] animate-fade-in rounded-2xl border border-border bg-surface p-2 shadow-popover md:hidden">
          <nav className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  <Icon name={item.iconKey} className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
