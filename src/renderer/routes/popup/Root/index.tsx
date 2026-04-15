import { lazy, Suspense, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EnvHelper } from '@renderer/helpers/EnvHelper'
import { I18nextHelper } from '@renderer/helpers/I18nextHelper'
import { LazyHelper } from '@renderer/helpers/LazyHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'
import { ReduxHelper } from '@renderer/helpers/ReduxHelper'
import { SentryHelper } from '@renderer/helpers/SentryHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useNavigateReset } from '@renderer/hooks/useNavigateReset'

import { modalsRouter } from '@renderer/routes/modals-router'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { rendererApi } from '@shared/message-api/renderer'

const ToastProvider = lazy(() =>
  import('@renderer/helpers/ToastHelper').then(module => ({ default: module.ToastHelper.Provider }))
)
const NetworkManagerSetup = LazyHelper.delayedLazy(() => import('./NetworkManagerSetup'), 1000)

export const RootPage = () => {
  const [ready, setReady] = useState(false)
  const navigateReset = useNavigateReset()

  useMountUnsafe(async () => {
    try {
      await EnvHelper.setup()
      await Promise.all([SentryHelper.setup(), I18nextHelper.setup(), BlockchainServiceHelper.setup()])
      ReduxHelper.setup()
      await ReduxHelper.waitForBootstrap()

      const loginSession = await rendererApi.send('login:get-session')

      if (loginSession) {
        ReduxHelper.store.dispatch(authReducerActions.setLoginSession(loginSession))
        navigateReset('/wallets')
      } else {
        ReduxHelper.store.dispatch(settingsReducerActions.setSelectedWallet(undefined))
        ReduxHelper.store.dispatch(settingsReducerActions.setSelectedAccount(undefined))
        ReduxHelper.store.dispatch(authReducerActions.resetTemporaryApplicationData())
        navigateReset('/login')
      }

      setReady(true)
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'RootPage', operation: 'setup' })
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={ReduxHelper.store}>
      <QueryClientProvider client={ReactQueryHelper.client}>
        <ModalRouterProvider routes={modalsRouter}>
          <Outlet />

          <Suspense fallback={null}>
            <NetworkManagerSetup />
          </Suspense>

          <Suspense fallback={null}>
            <ToastProvider />
          </Suspense>
        </ModalRouterProvider>
      </QueryClientProvider>
    </StoreProvider>
  )
}

export default RootPage
