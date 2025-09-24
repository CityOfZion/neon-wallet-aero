import { PageHelper } from '@/helpers/PageHelper'
import { QueryParamsHelper } from '@/helpers/QueryParamsHelper'
import { TLoginSession } from '@/types/store'
import { TWorkerGetLoginSessionResponse, TWorkerMessage } from '@/types/worker-events'

let loginSession: TLoginSession | undefined

chrome.runtime.onMessage.addListener(async (message: TWorkerMessage, _sender, sendResponse) => {
  switch (message.type) {
    case 'save-login-session':
      loginSession = message.payload.loginSession

      sendResponse()

      break
    case 'get-login-session': {
      const response: TWorkerGetLoginSessionResponse = { loginSession }

      sendResponse(response)

      break
    }
    case 'open-tab': {
      const url = message.payload.url
      const urlWithoutQueryParams = QueryParamsHelper.getUrlWithoutQueryParams(url).slice(1)

      chrome.tabs.query({}, tabs => {
        const tab = tabs.find(tab => {
          const tabUrl = tab.url

          if (!tabUrl) return false

          return QueryParamsHelper.getUrlWithoutQueryParams(tabUrl).endsWith(urlWithoutQueryParams)
        })

        if (tab?.id) {
          chrome.tabs.update(tab.id, { active: true })
          chrome.windows.update(tab.windowId, { focused: true })
        } else {
          chrome.tabs.create({ url, active: true })
        }

        sendResponse()
      })

      break
    }
    case 'close-all-tabs':
      chrome.tabs.query({}, tabs => {
        for (const tab of tabs) {
          const { id, url } = tab

          if (!!url && PageHelper.isAtInternalPage(url) && typeof id === 'number') {
            chrome.tabs.remove(id)
          }
        }

        sendResponse()
      })

      break
  }
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Worker initialized')
})
