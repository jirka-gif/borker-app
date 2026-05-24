import {
  BarChart3,
  Calculator,
  Car,
  Contact,
  FileCheck2,
  FileClock,
  Folder,
  Handshake,
  Heart,
  HeartPulse,
  Home,
  LayoutDashboard,
  type LucideIcon,
  PawPrint,
  Percent,
  Plane,
  Scale,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Centrální mapování ikon dle klíče (string) na Lucide komponentu.
 * Umožňuje držet ikony v datech/konfiguraci jako string a renderovat je v UI.
 */
const ICONS: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  plane: Plane,
  shield: Shield,
  wallet: Wallet,
  pawprint: PawPrint,
  "heart-pulse": HeartPulse,
  heart: Heart,
  scale: Scale,
  "layout-dashboard": LayoutDashboard,
  calculator: Calculator,
  "file-clock": FileClock,
  "file-check": FileCheck2,
  users: Users,
  contact: Contact,
  folder: Folder,
  "bar-chart-3": BarChart3,
  percent: Percent,
  handshake: Handshake,
  settings: Settings,
};

interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, strokeWidth = 2 }: IconProps) {
  const Cmp = ICONS[name] ?? Calculator;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
