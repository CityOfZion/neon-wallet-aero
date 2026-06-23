# Neon Wallet Aero
Your self-custodial and open-source blockchain wallet as browser extension.

## Environment
Create `.env` file in root folder and setup it:
```env
VITE_UNLIMIT_MERCHANT_ID=00000000-0000-0000-0000-000000000000
VITE_UNLIMIT_BUY_TOKENS_IFRAME_URL=https://onramp.com
VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL=https://offramp.com
VITE_CLICK_UP_KEY=pk_123456789  
VITE_CLICK_UP_LIST_ID=123456789  
VITE_CLICK_UP_ASSIGNEE_ID=123456789 
VITE_GA_MEASUREMENT_ID=123456789
VITE_GA_API_SECRET=123456789
VITE_SENTRY_DSN=https://sentry.io
VITE_CRISP_WEBSITE_ID=00000000-0000-0000-0000-000000000000
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

## Lint and typecheck
Run:
```
npm run lint && npm run typecheck
```

## Download SVGs
Run:
```
npm run icon
```

## Technologies used
- React
- TypeScript
- Vite

## Community and support
Join our community to stay updated with the latest news, developments and supports: [Discord](https://discord.gg/M7jGtEpjH4).
