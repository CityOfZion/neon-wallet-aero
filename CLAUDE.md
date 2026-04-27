# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Neon Wallet Aero is a self-custodial, open-source multi-chain blockchain wallet built as a **Chrome browser extension** (Manifest v3). It supports Neo3, NeoX, Bitcoin, Ethereum, Solana, and other blockchains via City of Zion's blockchain-service ecosystem.

## Commands

```bash
npm run dev         # Start Vite dev server (load dist/ as unpacked extension in Chrome)
npm run build       # Lint + typecheck + production build
npm run lint        # ESLint
npm run typecheck   # TypeScript type checking (tsc --noEmit)
npm run translate   # Translate changed English locale keys to other languages (Claude skill)
```

There is no test framework configured. Pre-commit hooks (Husky + lint-staged) run lint and typecheck on staged `.ts`/`.tsx` files.

## Architecture

### Extension Structure

The extension has three entry points:

- **Background service worker** (`src/background/index.ts`) — handles login session persistence, tab management, WalletConnect, and Ledger hardware wallet communication
- **Popup** (`src/renderer/popup.tsx` / `popup.html`) — the main UI opened from the browser toolbar
- **Tab** (`src/renderer/tab.tsx` / `tab.html`) — full-page views (buy/sell tokens, hardware wallet connection)

### State Management

- **Redux Toolkit** with **Redux Persist** (synced to webextension storage, survives extension reload)
- Store slices in `src/renderer/store/reducers/`: `auth`, `contact`, `settings`, `utility`
- `auth` slice has `memoryData.loginSession` (not persisted) and `data.applicationDataByLoginType` (wallets & notifications per login method)
- **React Query** for server state caching (balances, transactions)

### Routing

- **Page routes**: Hash-based via `createHashRouter` — defined in `src/renderer/routes/popup-router.tsx` and `tab-router.tsx`
- **Modal routes**: Custom dual-stack system (side modal + bottom modal simultaneously) — managed by `ModalRouterContext` in `src/renderer/contexts/`. Navigate modals via context: `navigate('modalName', { state })`, `navigate(-1)`
- Modal components are lazy-loaded in `src/renderer/routes/modals-router.tsx`

### Message API (Chrome Extension IPC)

Type-safe bidirectional messaging between background and renderers, defined in `src/shared/message-api/api.ts`. Messages use namespaced keys like `login:get-session`, `wallet-connect:pair`, `hardware-wallet:save-type`.

### Code Organization Patterns

- **Custom hooks** (`src/renderer/hooks/`) — all business logic lives here (e.g., `useBalances`, `useBlockchainActions`, `useExchange`)
- **Helper classes** (`src/renderer/helpers/`) — static utility methods for cross-cutting concerns (e.g., `BlockchainServiceHelper`, `EncryptionHelper`, `ToastHelper`)
- **Components** (`src/renderer/components/`) — reusable UI components
- **Layouts** (`src/renderer/layouts/`) — page layout wrappers (`ScreenLayout`, `SideModalLayout`, `BottomModalLayout`)
- **Shared types** (`src/shared/types/`) — TypeScript types used across background and renderer

### Path Aliases

```
@renderer/*  → src/renderer/*
@shared/*    → src/shared/*
@background/* → src/background/*
```

## Localization

- i18next with 5 languages: `en`, `de`, `pt-br`, `zh`, `zh-Hant` in `src/shared/locales/`
- Run `npm run translate` after modifying English locale files to translate to other languages
- See `.claude/skills/translate/glossary.md` for project-specific translation rules

## Code Style

- **Prettier**: single quotes, no semicolons, 120 char width, 2-space indent, trailing commas (es5)
- **Imports**: sorted by `eslint-plugin-simple-import-sort` with this group order: side-effects → react → third-party → `@shared/` → `@renderer/components/` → `@renderer/helpers/` → `@renderer/hooks/` → `@renderer/layouts/` → `@renderer/routes/` → `@renderer/assets/` → relative → CSS
- **Type imports**: must use `import type` (`@typescript-eslint/consistent-type-imports`)
- **Unused vars**: prefix with `_` (e.g., `_unused`)
- **JSX**: boolean props without `={true}`, no unnecessary curly braces around string props
- **Tailwind CSS v4**: class sorting via `prettier-plugin-tailwindcss`
- SVGs imported as React components via `vite-plugin-svgr`
