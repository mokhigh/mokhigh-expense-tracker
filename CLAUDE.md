# Mokhigh Expense Tracker

## Project

Single-user, mobile-first PWA for tracking personal expenses. Expenses are entered from an iPhone (Safari, installed as a home-screen PWA); dashboards/reports are reviewed on a laptop. Data syncs through Supabase — there is no custom backend in this repo.

## Stack

- **Build**: Vite + React 18
- **Language**: JavaScript (`.jsx` / `.js`) — no TypeScript
- **UI**: MUI v6 (`@mui/material`, `@mui/icons-material`, Emotion)
- **Dates / pickers**: `@mui/x-date-pickers` with date-fns
- **Charts**: `@mui/x-charts`
- **Animations**: `motion` (standalone package, successor to framer-motion)
- **Routing**: `react-router-dom`
- **State**: `zustand`
- **Data / auth**: `@supabase/supabase-js`
- **Offline cache + write queue**: `dexie` (IndexedDB)
- **PWA**: `vite-plugin-pwa` (Workbox, auto-update)
- **Hosting**: Vercel

## Conventions (hard rules)

- **JavaScript only.** Do not introduce TypeScript, `.ts`, or `.tsx` files.
- **UI from MUI.** Don't add other component libraries (no Chakra, Mantine, Radix, etc.). Style via MUI `sx` prop / theme, or Emotion `styled` when needed.
- **Animations via `motion`.** Import from `'motion/react'`, e.g. `import { motion } from 'motion/react'`. Do NOT install or import `framer-motion`.
- **State**: Zustand for cross-component state; local `useState` for component-local UI state. Avoid Redux / MobX.
- **Data access goes through `src/lib/`** (`supabase.js`, `db.js`, `sync.js`). Components must not call Supabase directly.
- **Mobile-first.** Design at 375px width first; enhance at the `md` breakpoint for laptop. Respect `env(safe-area-inset-*)` on iOS.
- **No TypeScript-style prop docs.** Keep components small; use sensible defaults instead of PropTypes.

## Folder map

```
src/
  main.jsx                # entry: Theme + Router + LocalizationProvider
  App.jsx                 # routes, wrapped in <AppShell>
  theme/                  # MUI theme (light, mobile-first defaults)
  routes/                 # top-level pages (AddExpense, Expenses, Dashboard, Settings)
  components/
    layout/               # AppShell (responsive: bottom nav / sidebar)
    common/               # shared presentational components
  features/expenses/      # feature-scoped components + hooks
  lib/                    # supabase client, dexie db, sync queue
  store/                  # zustand stores
  hooks/                  # generic hooks
  utils/                  # pure helpers
public/
  icons/                  # PWA icons (192, 512, 512-maskable)
  apple-touch-icon.png    # iOS home-screen icon
```

## Scripts

- `npm run dev` — Vite dev server (host enabled; reach it from your phone on the LAN)
- `npm run build` — production build
- `npm run preview` — serve the built app (needed to test the PWA/manifest/SW)
- `npm run lint` — ESLint
- `npm run format` — Prettier
