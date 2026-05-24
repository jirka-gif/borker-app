/**
 * Navigace hubu. Aplikace není CRM – je to pracovní hub pro kalkulačky,
 * kalkulace a smlouvy. Po sjednání data odcházejí přes API do systémů a CRM.
 */
export interface NavItem {
  label: string;
  href: string;
  iconKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Přehled", href: "/dashboard", iconKey: "layout-dashboard" },
  { label: "Kalkulačky", href: "/kalkulacky", iconKey: "calculator" },
  { label: "Kalkulace", href: "/rozpracovane", iconKey: "file-clock" },
  { label: "Smlouvy", href: "/smlouvy", iconKey: "file-check" },
];
