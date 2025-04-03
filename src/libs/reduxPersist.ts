import { Storage } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { EnvHelper } from '@/helpers/EnvHelper'

class ChromeExtensionStorage implements Storage {
  async getItem(key: string) {
    const response = await chrome.storage.local.get(key)
    return response[key] ?? null
  }

  async setItem(key: string, value: any) {
    await chrome.storage.local.set({ [key]: value })
  }

  async removeItem(key: string) {
    await chrome.storage.local.remove(key)
  }
}

export const reduxPersistStorage = EnvHelper.DEV ? storage : new ChromeExtensionStorage()
