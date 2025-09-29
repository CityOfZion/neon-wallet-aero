import { Provider as StoreProvider } from 'react-redux'
import { WalletConnectWalletProvider } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'

import { ModalRouterProvider } from '@/contexts/ModalRouterContext'
import { queryClient } from '@/libs/query'
import { ToastProvider } from '@/libs/sonner'
import { walletConnectOptions } from '@/libs/walletConnectSDK'
import { modalsRouter } from '@/routes/modalsRouter'
import { RootStore } from '@/store/RootStore'

import { Child } from './Child'

export const RootPage = () => {
  return (
    <StoreProvider store={RootStore.store}>
      <PersistGate persistor={RootStore.persistor}>
        <QueryClientProvider client={queryClient}>
          <WalletConnectWalletProvider options={walletConnectOptions}>
            <ModalRouterProvider routes={modalsRouter}>
              <Child />

              <ToastProvider />
            </ModalRouterProvider>
          </WalletConnectWalletProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}
