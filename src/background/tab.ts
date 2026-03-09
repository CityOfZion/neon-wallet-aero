import isEmpty from 'lodash/isEmpty'

import { backgroundApi } from '@shared/message-api/background'

const INTERNAL_BASE_URL = chrome.runtime.getURL('/src/renderer/tab.html')

export function registerTabHandlers() {
  backgroundApi.listen('tab:open', async ({ args }) => {
    const isExternal = /^(https?:\/\/)/i.test(args.href)

    const baseUrl = isExternal ? args.href : INTERNAL_BASE_URL
    const queryParams = !isEmpty(args.query) ? `?${new URLSearchParams(args.query).toString()}` : ''
    const url = isExternal ? `${baseUrl}${queryParams}` : `${baseUrl}#${args.href}${queryParams}`

    chrome.tabs.query({ url: baseUrl }, tabs => {
      const existentTab = tabs.find(tab => tab.url && tab.url === url)
      if (existentTab && existentTab.id) {
        chrome.tabs.update(existentTab.id, { active: true })
        chrome.windows.update(existentTab.windowId, { focused: true })
        return
      }

      chrome.tabs.create({ url, active: true })
    })
  })

  backgroundApi.listen('tab:close-all', async () => {
    chrome.tabs.query({ url: INTERNAL_BASE_URL }, tabs => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.remove(tab.id)
        }
      }
    })
  })
}
