import { defineManifest } from '@crxjs/vite-plugin'

import pkg from './package.json'

// Fixed public key so the unpacked dev build always gets the same id (chrome-extension://abocobpgkiiglkbognanlbjpepopbbim),
// which third parties like Mercuryo can allowlist. It's left out of production builds because the Chrome Web Store
// assigns its own key
const DEV_PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArQakPyU+msNK5RilsGPD5Ihu0TWWRH1oimvbbPzUVIqQZhwVcfpzZ6hakUUj0kgeLSuUGNb+wPF5+taBe3j+VEaA9Z2MgvK4zR3zRamoHKstSwEnoO+KXied4vnjvAd4DAzEiqwppSYoLxm/KICuKHSYJayAfIu/jJxa9M4P/81jbel5/TjvERE8nJmJ9PCNooQOPuobvGNbczcust8R0+rYKRPvRnq0lpeA0XnmlLeWWxB5eqWLJ874Xs8ouLGRiVwSfJybIyghZQLtNPJTkaVyXQCBdIKSEGV3xY3p7HAWM1MeC/nCWDE83zxBJIi5G/+eFV9VOsGHBXi0tZ78HQIDAQAB'

export default defineManifest(({ command }) => ({
  ...(command === 'serve' && { key: DEV_PUBLIC_KEY }),
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
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content-script/dapi-bridge.ts'],
      run_at: 'document_start',
    },
    {
      matches: ['<all_urls>'],
      js: ['src/content-script/neo3-injected-dapi-provider.iife.ts'],
      world: 'MAIN',
      run_at: 'document_start',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['src/renderer/dapi.html'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    'storage',
    'unlimitedStorage',
    'downloads',
    'clipboardRead',
    'clipboardWrite',
    'tabs',
    'activeTab',
    'notifications',
    'windows',
  ],
  host_permissions: ['https://www.google-analytics.com/*'],
}))
