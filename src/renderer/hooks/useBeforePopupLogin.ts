import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { TabsHelper } from '@renderer/helpers/TabsHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLanguageChange } from '@renderer/hooks/useLanguageChange'
import { useNetworkChange } from '@renderer/hooks/useNetworkChange'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { authReducerActions } from '@renderer/store/reducers/AuthReducer'
import { TBackgroundGetLoginSessionMessage, TBackgroundGetLoginSessionResponse } from '@shared/types/background-events'

const useGetLoginSessionFromBackground = () => {
  const dispatch = useAppDispatch()
  const { loginSessionRef } = useLoginSessionSelector()

  useLayoutEffect(() => {
    if (loginSessionRef.current) return

    const get = async () => {
      const response = await BackgroundHelper.send<
        TBackgroundGetLoginSessionMessage,
        TBackgroundGetLoginSessionResponse
      >({
        type: 'get-login-session',
      })

      dispatch(authReducerActions.setLoginSession(response.loginSession))
    }

    get()
  }, [dispatch, loginSessionRef])
}

const useRemoveTemporaryApplicationData = () => {
  const dispatch = useAppDispatch()
  const { loginSession } = useLoginSessionSelector()
  const { pathname } = useLocation()

  useEffect(() => {
    // If the user is logging in or logged in, we don't want to reset the temporary application data
    if (loginSession || pathname === '/splash' || pathname === '/' || TabsHelper.isInTab(window.location.href)) return

    dispatch(authReducerActions.resetTemporaryApplicationData())
  }, [loginSession, dispatch, pathname])
}

const useValidateNavigationByLoginSession = () => {
  const navigate = useNavigate()
  const { loginSessionRef } = useLoginSessionSelector()

  useEffect(() => {
    const validate = async () => {
      navigate('/splash', { replace: true })

      await UtilsHelper.sleep(2000)

      if (loginSessionRef.current) {
        navigate('/app/wallets', { replace: true })

        return
      }

      navigate('/login', { replace: true })
    }

    validate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useBeforePopupLogin = () => {
  useGetLoginSessionFromBackground()
  useNetworkChange()
  useLanguageChange()
  useRemoveTemporaryApplicationData()
  useValidateNavigationByLoginSession()
}
