import { AppShell } from "@/components/layout/AppShell";

/** Layout pro všechny chráněné stránky (dashboard, kalkulačky, …). */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
