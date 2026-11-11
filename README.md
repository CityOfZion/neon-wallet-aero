# Neon Wallet Aero

Your self-custodial and open-source blockchain wallet as browser extension.

## Environment

Create `.env` file in root folder and setup it:

```env
VITE_MERCURYO_WIDGET_ID=00000000-0000-0000-0000-000000000000
VITE_GA_MEASUREMENT_ID=123456789
VITE_GA_API_SECRET=123456789
VITE_SENTRY_DSN=https://sentry.io
VITE_CRISP_WEBSITE_ID=00000000-0000-0000-0000-000000000000
VITE_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
```

## Husky

Run:

```
npm run prepare
```

## Development

Run:

```
npm run dev
```

_Load the `dist` folder on manage extensions._

## Build

Run:

```
npm run build
```

_The build validates the `.env` variables first (`scripts/check-env.ts`)._

## Lint and typecheck

Run:

```
npm run lint && npm run typecheck
```

## Translate

After changing English locale files (`src/shared/locales/en`), run (requires [Claude Code](https://claude.com/claude-code)):

```
npm run translate
```

## Technologies used

- React
- TypeScript
- Vite

## Community and support

Join our community to stay updated with the latest news, developments and supports: [Discord](https://discord.gg/M7jGtEpjH4).
