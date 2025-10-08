import { useLayoutEffect } from 'react'
import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLanguageChange } from '@renderer/hooks/useLanguageChange'
import { useNetworkChange } from '@renderer/hooks/useNetworkChange'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { authReducerActions } from '@renderer/store/reducers/AuthReducer'
import {
  TBackgroundCloseAllTabsMessage,
  TBackgroundGetLoginSessionMessage,
  TBackgroundGetLoginSessionResponse,
} from '@shared/types/background-events'

const useValidateLoginSessionFromBackground = () => {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()

  useLayoutEffect(() => {
    if (loginSessionRef.current) return

    const validate = async () => {
      const { loginSession } = await BackgroundHelper.send<
        TBackgroundGetLoginSessionMessage,
        TBackgroundGetLoginSessionResponse
      >({ type: 'get-login-session' })

      if (loginSession) {
        dispatch(authReducerActions.setLoginSession(loginSession))

        return
      }

      await BackgroundHelper.send<TBackgroundCloseAllTabsMessage>({ type: 'close-all-tabs' })
    }

    validate()
  }, [dispatch, loginSessionRef])
}

export const useBeforeTabLogin = () => {
  useValidateLoginSessionFromBackground()
  useNetworkChange()
  useLanguageChange()
}
