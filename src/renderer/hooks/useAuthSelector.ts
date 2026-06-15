import type { TLoginSessionType } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectShouldConfirmAction = (loginType?: TLoginSessionType) => {
  return createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      const currentLoginType = loginType || loginSession?.type

      if (!currentLoginType) return false

      return applicationDataByLoginType[currentLoginType].shouldConfirmAction
    }
  )
}

export const useShouldConfirmActionSelector = (loginType?: TLoginSessionType) => {
  const { value, ref } = useAppSelector(selectShouldConfirmAction(loginType))

  return { shouldConfirmAction: value, shouldConfirmActionRef: ref }
}

export const useLoginSessionSelector = () => {
  const { value, ref } = useAppSelector(state => state.auth.memoryData.loginSession)

  return {
    loginSession: value,
    loginSessionRef: ref,
  }
}
