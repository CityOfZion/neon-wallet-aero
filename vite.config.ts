import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import zip from 'vite-plugin-zip-pack'
import tsconfigPaths from 'vite-tsconfig-paths'

import manifest from './manifest.config'
import { name, version } from './package.json'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        tab: 'src/renderer/app/tab/index.html',
      },
    },
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
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
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
})
