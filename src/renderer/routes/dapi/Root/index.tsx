import { lazy, Suspense, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EnvHelper } from '@renderer/helpers/EnvHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'
import { ReduxHelper } from '@renderer/helpers/ReduxHelper'
import { SentryHelper } from '@renderer/helpers/SentryHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'

import { modalsRouter } from '@renderer/routes/modals-router'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { DapiHelper } from '@shared/helpers/DapiHelper'
import { I18nextHelper } from '@shared/helpers/I18nextHelper'
import { rendererApi } from '@shared/message-api/renderer'

const ToastProvider = lazy(() =>
  import('@renderer/helpers/ToastHelper').then(module => ({ default: module.ToastHelper.Provider }))
)

export const RootPage = () => {
  const [ready, setReady] = useState(false)

  useMountUnsafe(async () => {
    try {
      await EnvHelper.setup()
      await Promise.all([SentryHelper.setup(), I18nextHelper.setup(), BlockchainServiceHelper.setup()])

      ReduxHelper.setup()
      await ReduxHelper.waitForBootstrap()

      const loginSession = await rendererApi.send('login:get-session')

      ReduxHelper.store.dispatch(authReducerActions.setLoginSession(loginSession))
      setReady(true)
    } catch (error: any) {
      ReduxHelper.store.dispatch(authReducerActions.resetTemporaryApplicationData())

      const request = DapiHelper.getRequestFromQuery()

      if (request) {
        await rendererApi.send('dapi:neo3:approval-result', { request, error })
      }

      window.close()
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={ReduxHelper.store}>
      <QueryClientProvider client={ReactQueryHelper.client}>
        <ModalRouterProvider routes={modalsRouter}>
          <Suspense fallback={null}>
            <ToastProvider />
          </Suspense>

          <Outlet />
        </ModalRouterProvider>
      </QueryClientProvider>
    </StoreProvider>
  )
}

export default RootPage
