import { backgroundApi } from '@shared/message-api/background'

const BASE_URL = chrome.runtime.getURL('/src/renderer/tab.html')

export function registerTabHandlers() {
  backgroundApi.listen('tab:open', async ({ args: { path, query } }) => {
    const isFromOtherOrigin = path.startsWith('http')
    const queryParams = new URLSearchParams(query).toString()
    const fullPath = queryParams ? `${path}?${queryParams}` : path
    const url = isFromOtherOrigin ? fullPath : `${BASE_URL}#${fullPath}`

    chrome.tabs.query({ url: isFromOtherOrigin ? path : BASE_URL }, tabs => {
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
    chrome.tabs.query({ url: BASE_URL }, tabs => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.remove(tab.id)
        }
      }
    })
  })
}
