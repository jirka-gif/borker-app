# Star Insurance Group – interní aplikace

Interní webová aplikace agregující pojistné kalkulačky pro poradce Star Insurance Group.
Po přihlášení vidí poradce rozpracované kalkulace, naposledy použité a všechny dostupné
kalkulačky na jednom místě.

První fáze je zaměřená na frontend, je ale postavená tak, aby na ni šel snadno napojit
backend, CRM a reálné kalkulačky (i ty vytvořené v Cursoru).

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens řízené CSS proměnnými)
- **lucide-react** ikony
- Žádné externí UI knihovny – vlastní reusable komponentový systém

## Spuštění

```bash
npm install
npm run dev      # http://localhost:3000
```

Další skripty: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`.

### Demo přihlášení (1. fáze, mock auth)

```
Email:  demo@star.cz
Heslo:  demo1234
```

## Struktura projektu

```
src/
├── app/
│   ├── layout.tsx            # root layout + AuthProvider + font
│   ├── page.tsx              # redirect na /login
│   ├── login/                # přihlašovací stránka
│   ├── not-found.tsx
│   └── (app)/                # chráněná část aplikace (sidebar + topbar)
│       ├── layout.tsx        # AppShell
│       ├── dashboard/        # dashboard + skeleton loading
│       ├── kalkulacky/       # grid + detail [slug]
│       └── rozpracovane/     # přehled draftů s filtry
├── components/
│   ├── ui/                   # design system (Button, Card, Input, Modal, …)
│   ├── layout/               # Sidebar, Topbar, AppShell
│   ├── Logo, Icon, PageHeader, SectionHeading
├── features/                 # doménové celky
│   ├── dashboard/  drafts/  calculators/
├── config/                   # registr kalkulaček, navigace, stavy
├── lib/
│   ├── auth/                 # mock auth, session, AuthProvider
│   ├── data/                 # datová vrstva (dnes mock, později API)
│   └── utils.ts
├── types/                    # sdílené typy domény
└── middleware.ts             # ochrana rout na serveru
```

## Architektura a body napojení

- **Auth** – `lib/auth/service.ts` je mock. Pro reálný backend stačí přepsat
  `login`/`refresh` na volání API (POST `/auth/login`, `/auth/refresh`). Struktura
  je připravená na JWT + refresh token. Routy chrání `middleware.ts`.
- **Data** – komponenty čtou z `lib/data`. Dnes vrací mock; nahrazením těla funkcí
  za `fetch` se aplikace napojí na backend bez změny UI.
- **Kalkulačky** – registr v `config/calculators.ts`. Každá kalkulačka má `kind`:
  `interni` (formulář v aplikaci), `embedded` (vložený modul), `iframe`
  (externí nástroj v iframe) nebo `externi` (otevření v novém okně). Nová
  kalkulačka = jeden záznam v registru.
- **Continue flow** – tlačítko „Pokračovat“ u draftu vede na
  `/kalkulacky/[slug]?draft=…&step=…`, takže se poradce vrátí přesně do svého kroku.
- **Design system** – barvy jdou přebarvit jediným místem v `app/globals.css`
  (CSS proměnné `--brand-*` a sémantické tokeny). Připraveno i na dark mode.

## Připraveno pro další vývoj

Sidebar i typy počítají s budoucími sekcemi: Klienti, CRM, Dokumenty, Reporting,
Provize, Partneři, Nastavení – a s rolemi (poradce, manažer, admin, partner, externista).
Datové typy myslí na ukládání kalkulací, klientské profily, historii, export PDF a audit log.
