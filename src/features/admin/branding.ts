/**
 * White-label branding na úrovni firmy. Z jedné barvy vygeneruje paletu
 * --brand-50…900 (formát „R G B" pro Tailwind <alpha-value>) a aplikuje ji
 * jako CSS proměnné na <html>. Reset vrátí výchozí barvy Star Insurance.
 */

const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB | null {
  const m = hex.trim().replace('#', '');
  if (!/^([0-9a-fA-F]{6})$/.test(m)) return null;
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  };
}

function mix(c: RGB, target: RGB, t: number): RGB {
  return {
    r: Math.round(c.r + (target.r - c.r) * t),
    g: Math.round(c.g + (target.g - c.g) * t),
    b: Math.round(c.b + (target.b - c.b) * t),
  };
}

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

/** Poměry mixu vůči bílé (světlé odstíny) / černé (tmavé). 600 = základ. */
const MIX: Record<number, { to: 'white' | 'black' | 'base'; t: number }> = {
  50: { to: 'white', t: 0.92 },
  100: { to: 'white', t: 0.84 },
  200: { to: 'white', t: 0.68 },
  300: { to: 'white', t: 0.5 },
  400: { to: 'white', t: 0.28 },
  500: { to: 'white', t: 0.12 },
  600: { to: 'base', t: 0 },
  700: { to: 'black', t: 0.18 },
  800: { to: 'black', t: 0.34 },
  900: { to: 'black', t: 0.5 },
};

export function hexToPalette(hex: string): Record<number, string> | null {
  const base = hexToRgb(hex);
  if (!base) return null;
  const out: Record<number, string> = {};
  for (const key of SHADE_KEYS) {
    const cfg = MIX[key];
    const c = cfg.to === 'base' ? base : mix(base, cfg.to === 'white' ? WHITE : BLACK, cfg.t);
    out[key] = `${c.r} ${c.g} ${c.b}`;
  }
  return out;
}

export function applyBranding(hex: string): void {
  const palette = hexToPalette(hex);
  if (!palette || typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const key of SHADE_KEYS) root.style.setProperty(`--brand-${key}`, palette[key]);
}

export function resetBranding(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const key of SHADE_KEYS) root.style.removeProperty(`--brand-${key}`);
}

/** Předvolené barvy pro rychlý výběr. */
export const BRAND_PRESETS: { name: string; hex: string }[] = [
  { name: 'Star (vínová)', hex: '#A82844' },
  { name: 'Modrá', hex: '#2563EB' },
  { name: 'Tyrkysová', hex: '#0D9488' },
  { name: 'Zelená', hex: '#16A34A' },
  { name: 'Fialová', hex: '#7C3AED' },
  { name: 'Oranžová', hex: '#EA580C' },
  { name: 'Antracit', hex: '#334155' },
];
