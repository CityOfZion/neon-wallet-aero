import { lazy, Suspense, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EnvHelper } from '@renderer/helpers/EnvHelper'
import { I18nextHelper } from '@renderer/helpers/I18nextHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'
import { ReduxHelper } from '@renderer/helpers/ReduxHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'

import { modalsRouter } from '@renderer/routes/modals-router'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { rendererApi } from '@shared/message-api/renderer'

const ToastProvider = lazy(() =>
  import('@renderer/helpers/ToastHelper').then(module => ({ default: module.ToastHelper.Provider }))
)

export const RootPage = () => {
  const [ready, setReady] = useState(false)

  useMountUnsafe(async () => {
    try {
      await Promise.allSettled([EnvHelper.setup(), I18nextHelper.setup(), BlockchainServiceHelper.setup()])

      ReduxHelper.setup()
      await ReduxHelper.waitForBootstrap()

      const loginSession = await rendererApi.send('login:get-session')

      ReduxHelper.store.dispatch(authReducerActions.setLoginSession(loginSession))
      setReady(true)
    } catch {
      ReduxHelper.store.dispatch(authReducerActions.resetTemporaryApplicationData())
      await rendererApi.send('tab:close-all')
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={ReduxHelper.store}>
      <QueryClientProvider client={ReactQueryHelper.client}>
        <ModalRouterProvider routes={modalsRouter}>
          <Outlet />

          <Suspense fallback={null}>
            <ToastProvider />
          </Suspense>
        </ModalRouterProvider>
      </QueryClientProvider>
    </StoreProvider>
  )
}
