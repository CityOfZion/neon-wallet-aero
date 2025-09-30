import { Provider as StoreProvider } from 'react-redux'
import { WalletConnectWalletProvider } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { modalsRouter } from '@renderer/app/popup/routes/modalsRouter'
import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { queryClient } from '@renderer/libs/query'
import { ToastProvider } from '@renderer/libs/sonner'
import { walletConnectOptions } from '@renderer/libs/walletConnectSDK'
import { RootStore } from '@renderer/store/RootStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'

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
