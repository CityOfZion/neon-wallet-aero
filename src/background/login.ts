import { backgroundApi } from '@shared/message-api/background'
import type { TLoginSession } from '@shared/types/store'

const LOGOUT_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour

let loginSession: TLoginSession | undefined
let logoutTimeout: NodeJS.Timeout | undefined

const connectionState = new Proxy(
  { isTabConnected: false, isPopupConnected: false },
  {
    set(target, prop, value) {
      const typedProp = prop as keyof typeof target
      const oldValue = target[typedProp]
      target[typedProp] = value

      if (oldValue !== value) {
        if (!connectionState.isTabConnected && !connectionState.isPopupConnected) {
          console.log('All connections closed, starting logout timer…')
          logoutTimeout = setTimeout(() => {
            console.log('Logout timer expired, clearing session.')
            loginSession = undefined
            logoutTimeout = undefined
          }, LOGOUT_TIMEOUT_MS)
        } else {
          console.log('A connection opened, clearing logout timer if it exists.')
          clearTimeout(logoutTimeout)
        }
      }

      return true
    },
  }
)

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'tab') {
    connectionState.isTabConnected = true
  }

  if (port.name === 'popup') {
    connectionState.isPopupConnected = true
  }

  port.onDisconnect.addListener(() => {
    if (port.name === 'tab') {
      connectionState.isTabConnected = false
    }

    if (port.name === 'popup') {
      connectionState.isPopupConnected = false
    }
  })
})

export function registerLoginHandlers() {
  backgroundApi.listen('login:save-session', ({ args }) => {
    loginSession = args
  })

  backgroundApi.listen('login:get-session', () => {
    return loginSession
  })
}
