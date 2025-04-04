import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    nodePolyfills({
      include: ['crypto', 'stream', 'buffer'],
    }),
    react(),
    tsconfigPaths(),
    svgr(),
    crx({ manifest }),
  ],
})
