import { backgroundApi } from '@shared/message-api/background'
import type { TLoginSession } from '@shared/types/store'

const LOGOUT_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour
const SESSION_STORAGE_KEY = 'loginSession'

let loginSession: TLoginSession | undefined
let logoutTimeout: NodeJS.Timeout | undefined

async function persistSession(session: TLoginSession | undefined) {
  if (session) {
    await chrome.storage.session.set({ [SESSION_STORAGE_KEY]: session })
    return
  }

  await chrome.storage.session.remove(SESSION_STORAGE_KEY)
}

export async function getSession() {
  const result = await chrome.storage.session.get(SESSION_STORAGE_KEY)
  return result[SESSION_STORAGE_KEY] as TLoginSession | undefined
}

export async function restoreSession() {
  loginSession = await getSession()
}

const connectionState = new Proxy(
  { isTabConnected: false, isPopupConnected: false, isDapiConnected: false },
  {
    set(target, prop, value) {
      const typedProp = prop as keyof typeof target
      const oldValue = target[typedProp]
      target[typedProp] = value

      if (oldValue !== value) {
        if (!connectionState.isTabConnected && !connectionState.isPopupConnected && !connectionState.isDapiConnected) {
          console.log('All connections closed, starting logout timer…')
          logoutTimeout = setTimeout(() => {
            console.log('Logout timer expired, clearing session.')
            loginSession = undefined
            logoutTimeout = undefined
            persistSession(undefined)
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

  if (port.name === 'dapi') {
    connectionState.isDapiConnected = true
  }

  port.onDisconnect.addListener(() => {
    if (port.name === 'tab') {
      connectionState.isTabConnected = false
    }

    if (port.name === 'popup') {
      connectionState.isPopupConnected = false
    }

    if (port.name === 'dapi') {
      connectionState.isDapiConnected = false
    }
  })
})

export function registerLoginHandlers() {
  backgroundApi.listen('login:save-session', ({ args }) => {
    loginSession = args
    persistSession(args)
  })

  backgroundApi.listen('login:get-session', () => {
    return loginSession
  })
}
