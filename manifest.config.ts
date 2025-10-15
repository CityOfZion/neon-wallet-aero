import { defineManifest } from '@crxjs/vite-plugin'

import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  icons: {
    16: 'public/icon-16x16.png',
    32: 'public/icon-32x32.png',
    48: 'public/icon-48x48.png',
    128: 'public/icon-128x128.png',
  },
  action: {
    default_icon: {
      16: 'public/icon-16x16.png',
      32: 'public/icon-32x32.png',
      48: 'public/icon-48x48.png',
      128: 'public/icon-128x128.png',
    },
    default_popup: 'src/renderer/popup.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  permissions: ['storage', 'unlimitedStorage', 'downloads', 'clipboardRead', 'clipboardWrite', 'tabs', 'activeTab'],
})
