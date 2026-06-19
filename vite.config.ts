import { crx } from '@crxjs/vite-plugin'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import zip from 'vite-plugin-zip-pack'

import manifest from './manifest.config'
import { name, version } from './package.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      sourcemap: 'hidden',
      rollupOptions: {
        input: {
          tab: 'src/renderer/tab.html',
        },
      },
    },
    server: {
      cors: {
        origin: [/chrome-extension:\/\//],
      },
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      nodePolyfills({
        include: ['crypto', 'stream', 'buffer', 'querystring'],
      }),
      react(),
      svgr(),
      crx({ manifest }),
      zip({ outDir: 'release', outFileName: `${name}-${version}.zip` }),
      sentryVitePlugin({
        org: env.SENTRY_ORG_NAME,
        project: env.SENTRY_PROJECT_NAME,
        authToken: env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        sourcemaps: {
          filesToDeleteAfterUpload: ['./**/*.map', '.*/**/public/**/*.map', './dist/**/client/**/*.map'],
        },
      }),
    ],
  }
})
