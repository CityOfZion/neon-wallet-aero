import { lazy, Suspense, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { useMountUnsafe } from '@renderer/hooks/useMount'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { setupBsAggregator } from '@renderer/libs/blockchain-service'
import { setupI18next } from '@renderer/libs/i18next'
import { queryClient } from '@renderer/libs/query'
import { setupStore, store, waitForBootstrap } from '@renderer/libs/redux'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { rendererApi } from '@shared/message-api/renderer'

import { modalsRouter } from '../../modalsRouter'

const NetworkBanner = lazy(() => import('@renderer/components/NetworkBanner'))
const ToastProvider = lazy(() => import('@renderer/libs/sonner'))

export const RootPage = () => {
  const [ready, setReady] = useState(false)

  useMountUnsafe(async () => {
    try {
      await Promise.allSettled([setupI18next(), setupBsAggregator()])

      setupStore()
      await waitForBootstrap()

      const loginSession = await rendererApi.send('login:get-session')
      if (!loginSession) {
        throw new Error()
      }

      store.dispatch(authReducerActions.setLoginSession(loginSession))
      setReady(true)
    } catch {
      store.dispatch(authReducerActions.resetTemporaryApplicationData())
      await rendererApi.send('tab:close-all')
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ModalRouterProvider routes={modalsRouter}>
          <Outlet />

          <Suspense fallback={null}>
            <NetworkBanner />
            <ToastProvider />
          </Suspense>
        </ModalRouterProvider>
      </QueryClientProvider>
    </StoreProvider>
  )
}
