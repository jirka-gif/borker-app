import type { Config } from "tailwindcss";

/**
 * Star Insurance Group – design system.
 * Barvy jsou řízené CSS proměnnými (viz globals.css), aby šlo téma přebarvit
 * a aby fungoval dark mode (data-theme="dark" na <html>) bez zásahu do komponent.
 */
const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          // Pojmenované barvy vložené kalkulačky vozidel (původní „petrisk" paleta).
          purple: "#A020F0",
          pink: "#FF4B8B",
          orange: "#FF8A00",
          green: "#00A03E",
        },
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        "surface-warm": "rgb(var(--surface-warm) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-bg": "rgb(var(--success-bg) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        "warning-bg": "rgb(var(--warning-bg) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-bg": "rgb(var(--danger-bg) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        "info-bg": "rgb(var(--info-bg) / <alpha-value>)",
        "accent-peach": "rgb(var(--accent-peach) / <alpha-value>)",
        "accent-sky": "rgb(var(--accent-sky) / <alpha-value>)",
        "accent-sage": "rgb(var(--accent-sage) / <alpha-value>)",
        "accent-lilac": "rgb(var(--accent-lilac) / <alpha-value>)",
        "accent-mint": "rgb(var(--accent-mint) / <alpha-value>)",
      },
      borderRadius: {
        // Sjednoceno s design preview – ostřejší, profesionálnější geometrie.
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        // Minimální stíny – spíš jako tenká linka než hluboké stíny.
        soft: "0 1px 2px rgb(15 16 20 / 0.04)",
        card: "0 1px 2px rgb(15 16 20 / 0.04), 0 0 0 1px rgb(var(--border))",
        "card-hover":
          "0 1px 2px rgb(15 16 20 / 0.06), 0 8px 24px -8px rgb(15 16 20 / 0.18)",
        "card-brand": "0 0 0 1px rgb(var(--brand-600) / 0.4)",
        popover:
          "0 1px 2px rgb(15 16 20 / 0.06), 0 8px 24px -8px rgb(15 16 20 / 0.18), 0 0 0 1px rgb(var(--border))",
        focus: "0 0 0 3px rgb(var(--ring) / 0.25)",
        "btn-primary":
          "inset 0 1px 0 rgb(255 255 255 / 0.10), 0 1px 2px rgb(var(--brand-700) / 0.30)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
