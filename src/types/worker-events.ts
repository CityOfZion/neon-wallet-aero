import { TLoginSession } from '@/types/store'

export type TWorkerSaveLoginSessionMessage = {
  type: 'save-login-session'
  payload: {
    loginSession: TLoginSession | undefined
  }
}

export type TWorkerGetLoginSessionMessage = {
  type: 'get-login-session'
}

export type TWorkerOpenTabMessage = {
  type: 'open-tab'
  payload: {
    url: string
  }
}

export type TWorkerCloseAllTabsMessage = {
  type: 'close-all-tabs'
}

export type TWorkerMessage =
  | TWorkerSaveLoginSessionMessage
  | TWorkerGetLoginSessionMessage
  | TWorkerOpenTabMessage
  | TWorkerCloseAllTabsMessage

export type TWorkerGetLoginSessionResponse = {
  loginSession: TLoginSession | undefined
}
