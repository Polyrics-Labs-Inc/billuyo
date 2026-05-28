# BilluYo — Agent Instructions

## Stack
Vue 3 (`<script setup>`), TypeScript (strict), Pinia (composition stores), vue-router (history mode), Tailwind CSS 3, Vite 6, pnpm.

## Commands
- `pnpm dev` — dev server
- `pnpm build` — typecheck (`vue-tsc --noEmit`) then `vite build`
- `pnpm typecheck` — `vue-tsc --noEmit` only (separate from build)
- `pnpm lint` — `eslint . --ext .vue,.ts --fix` (no eslint dep installed — may fail)
- `pnpm preview` — serve built `dist/`

## Architecture
- **100% client-side**, no backend. All data in `localStorage` under `billuyo:` keys.
- **Repository pattern**: `Repository<T>` interface → per-entity interfaces (`ICategoryRepository`, `IAccountRepository`, etc.) → `LocalStorageRepository<T>` base → per-entity localStorage impls (`LocalStorageCategoryRepository`, etc.). One domain file per entity in `src/repositories/`. Each store uses its typed repo class. All localStorage implementations live in `src/repositories/localStorage/`.
- **App bootstrap** (`App.vue`): loads all stores in parallel, sets locale from settings, redirects to `/onboarding` if not onboarded.
- **Routing**: `/onboarding` (no layout), `/` nested in `AppLayout` (bottom nav shell). 20 lazy-loaded page components.
- **Obligations**: two collections — `Obligation` (recurring template) + `ObligationAction` (per-period instance, linked to a transaction).
- **API sync layer**: `SyncedRepository<T>` in `src/api/sync/` wraps any localStorage repo and enqueues create/update/delete to a FIFO queue persisted in `billuyo:syncQueue`. `SyncEngine` retries on failure (5 max, then dead-letter in `billuyo:syncDeadLetter`). Lazy init, no-op if `VITE_API_URL` is empty.

## Design System
- Claymorphism: `tailwind.config.js` defines clay colors, radii, 6 shadow layers, 4 animations. See `DESIGN.md`.
- `@tailwindcss/forms` with `strategy: 'class'` — use `form-input`, `form-select`, etc.
- Custom `clay-*` CSS classes in `styles/claymorphism.css`.
- Font: **ElmsSans** (18 weights, italic variants) — defined via `@font-face` in `styles/main.css`.

## Key Conventions
- `import ... from '@/'` maps to `./src/`.
- IDs via `nanoid(16)`.
- Categories can use `nameKey` for i18n (translated at runtime).
- `i18n` in `legacy: false` mode.
- No tests exist (no test framework installed).
- PWA with `autoUpdate` — service worker updates automatically.
- Docker: multi-stage build (`node:23-alpine` build → `nginx:alpine` serve).

## Configuration
- `VITE_API_URL` in `.env` (or `.env.local`) — REST API base URL. Leave empty to disable API sync.

## localStorage Keys
`billuyo:categories`, `billuyo:accounts`, `billuyo:transactions`, `billuyo:budgets`, `billuyo:obligations`, `billuyo:obligationActions`, `billuyo:settings`, `billuyo:syncQueue`, `billuyo:syncDeadLetter`.
