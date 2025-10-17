import { backgroundApi } from '@shared/message-api/background'
import type { TLoginSession } from '@shared/types/store'

const LOGOUT_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour

let loginSession: TLoginSession | undefined
let logoutTimeout: NodeJS.Timeout | undefined

function setLogoutTimeout() {
  if (logoutTimeout) {
    clearTimeout(logoutTimeout)
  }

  if (loginSession) {
    logoutTimeout = setTimeout(() => {
      loginSession = undefined
    }, LOGOUT_TIMEOUT_MS)
  }
}

export function registerLoginHandlers() {
  backgroundApi.listen('login:save-session', ({ args }) => {
    loginSession = args
    setLogoutTimeout()
  })

  backgroundApi.listen('login:get-session', () => {
    setLogoutTimeout()
    return loginSession
  })
}
