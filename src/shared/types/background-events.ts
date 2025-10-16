import type { TLoginSession } from '@shared/types/store'

export type TBackgroundSaveLoginSessionMessage = {
  type: 'save-login-session'
  payload: {
    loginSession: TLoginSession | undefined
  }
}

export type TBackgroundGetLoginSessionMessage = {
  type: 'get-login-session'
}

export type TBackgroundOpenTabMessage = {
  type: 'open-tab'
  payload: {
    url: string
  }
}

export type TBackgroundCloseAllTabsMessage = {
  type: 'close-all-tabs'
}

export type TBackgroundMessage =
  | TBackgroundSaveLoginSessionMessage
  | TBackgroundGetLoginSessionMessage
  | TBackgroundOpenTabMessage
  | TBackgroundCloseAllTabsMessage

export type TBackgroundGetLoginSessionResponse = {
  loginSession: TLoginSession | undefined
}
