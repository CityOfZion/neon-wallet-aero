import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import manifest from './manifest.json'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        internal: 'internal.html',
      },
    },
  },
  plugins: [
    tailwindcss(),
    nodePolyfills({
      include: ['crypto', 'stream', 'buffer', 'querystring'],
    }),
    react(),
    tsconfigPaths(),
    svgr(),
    crx({ manifest }),
  ],
})
