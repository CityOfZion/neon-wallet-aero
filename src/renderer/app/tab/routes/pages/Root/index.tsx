import { Provider as StoreProvider } from 'react-redux'
import { modalsRouter } from '@renderer/app/tab/routes/modalsRouter'
import { ModalRouterProvider } from '@renderer/contexts/ModalRouterContext'
import { queryClient } from '@renderer/libs/query'
import { ToastProvider } from '@renderer/libs/sonner'
import { RootStore } from '@renderer/store/RootStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'

import { Child } from './Child'

export const RootPage = () => {
  return (
    <StoreProvider store={RootStore.store}>
      <PersistGate persistor={RootStore.persistor}>
        <QueryClientProvider client={queryClient}>
          <ModalRouterProvider routes={modalsRouter}>
            <Child />
            <ToastProvider />
          </ModalRouterProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}
