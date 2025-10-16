import { lazy, Suspense, useState } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { SplashScreen } from '@renderer/components/SplashScreen'
import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { setupBsAggregator } from '@renderer/libs/blockchainService'
import { setupI18next } from '@renderer/libs/i18next'
import { queryClient } from '@renderer/libs/query'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { RootStore } from '@renderer/store/RootStore'
import {
  TBackgroundCloseAllTabsMessage,
  TBackgroundGetLoginSessionMessage,
  TBackgroundGetLoginSessionResponse,
} from '@shared/types/background-events'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'

import { modalsRouter } from '../../modalsRouter'

const NetworkBanner = lazy(() => import('@renderer/components/NetworkBanner'))
const ToastProvider = lazy(() => import('@renderer/libs/sonner'))

export const RootPage = () => {
  const [ready, setReady] = useState(false)

  useMountUnsafe(async () => {
    try {
      setupI18next()
      await setupBsAggregator()
      RootStore.setupStore()

      const response = await BackgroundHelper.send<
        TBackgroundGetLoginSessionMessage,
        TBackgroundGetLoginSessionResponse
      >({
        type: 'get-login-session',
      })

      if (!response?.loginSession) {
        throw new Error('No login session found')
      }

      RootStore.store.dispatch(authReducerActions.setLoginSession(response.loginSession))
      setReady(true)
    } catch {
      await BackgroundHelper.send<TBackgroundCloseAllTabsMessage>({
        type: 'close-all-tabs',
      })
    }
  })

  if (!ready) return <SplashScreen />

  return (
    <StoreProvider store={RootStore.store}>
      <PersistGate persistor={RootStore.persistor}>
        <QueryClientProvider client={queryClient}>
          <ModalRouterProvider routes={modalsRouter}>
            <Outlet />

            <Suspense fallback={null}>
              <NetworkBanner />
              <ToastProvider />
            </Suspense>
          </ModalRouterProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}
