import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider, ThemeScript } from "@/lib/theme";
import "./globals.css";

// Fonty Geist + Geist Mono + Source Serif 4 načítáme přes Google Fonts (přes <link>),
// proměnné --font-sans / --font-mono / --font-serif jsou definované v globals.css.

export const metadata: Metadata = {
  title: {
    default: "Star Insurance Group",
    template: "%s · Star Insurance Group",
  },
  description:
    "Interní pracovní prostředí pro poradce – kalkulačky pojištění na jednom místě.",
};

export const viewport: Viewport = {
  themeColor: "#9e1b32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        {/* Musí běžet před hydratací – předejde záblesku světlého režimu. */}
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Source+Serif+4:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
