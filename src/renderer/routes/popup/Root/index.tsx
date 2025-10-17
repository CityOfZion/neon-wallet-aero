import { lazy, Suspense, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { LazyHelper } from '@renderer/helpers/LazyHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'

import { modalsRouter } from '@renderer/routes/modalsRouter'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { setupBsAggregator } from '@renderer/libs/blockchain-service'
import { setupI18next } from '@renderer/libs/i18next'
import { queryClient } from '@renderer/libs/query'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { RootStore } from '@renderer/store/RootStore'
import { rendererApi } from '@shared/message-api/renderer'

const ToastProvider = lazy(() => import('@renderer/libs/sonner'))
const NetworkManagerSetup = LazyHelper.delayedLazy(() => import('./NetworkManagerSetup'), 1000)

export const RootPage = () => {
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useMountUnsafe(async () => {
    try {
      setupI18next()
      await setupBsAggregator()
      RootStore.setupStore()
      await RootStore.waitForBootstrap()

      const loginSession = await rendererApi.send('login:get-session')

      if (loginSession) {
        RootStore.store.dispatch(authReducerActions.setLoginSession(loginSession))
        navigate('/wallets', { replace: true })
      } else {
        RootStore.store.dispatch(authReducerActions.resetTemporaryApplicationData())
        navigate('/login', { replace: true })
      }

      setReady(true)
    } catch (error) {
      console.error('Setup failed:', error)
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={RootStore.store}>
      <QueryClientProvider client={queryClient}>
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
