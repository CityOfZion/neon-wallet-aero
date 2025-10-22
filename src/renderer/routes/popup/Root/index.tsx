import { lazy, Suspense, useState } from 'react'

import { WalletConnectWalletProvider } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as StoreProvider } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import { SplashScreen } from '@renderer/components/SplashScreen'

import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { LazyHelper } from '@renderer/helpers/LazyHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'

import { modalsRouter } from '@renderer/routes/modalsRouter'

import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { setupBsAggregator } from '@renderer/libs/blockchain-service'
import { setupI18next } from '@renderer/libs/i18next'
import { queryClient } from '@renderer/libs/query'
import { walletConnectOptions } from '@renderer/libs/walletConnectSDK'
import { authReducerActions } from '@renderer/store/reducers/auth'
import { RootStore } from '@renderer/store/RootStore'
import type {
  TBackgroundGetLoginSessionMessage,
  TBackgroundGetLoginSessionResponse,
} from '@shared/types/background-events'

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

      await UtilsHelper.sleep(500)

      const response = await BackgroundHelper.send<
        TBackgroundGetLoginSessionMessage,
        TBackgroundGetLoginSessionResponse
      >({
        type: 'get-login-session',
      })

      if (response?.loginSession) {
        RootStore.store.dispatch(authReducerActions.setLoginSession(response.loginSession))
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
      <PersistGate persistor={RootStore.persistor}>
        <QueryClientProvider client={queryClient}>
          <WalletConnectWalletProvider options={walletConnectOptions}>
            <ModalRouterProvider routes={modalsRouter}>
              <Outlet />

              <Suspense fallback={null}>
                <NetworkManagerSetup />
              </Suspense>

              <Suspense fallback={null}>
                <ToastProvider />
              </Suspense>
            </ModalRouterProvider>
          </WalletConnectWalletProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}

export default RootPage
