import { Provider as StoreProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'

import { queryClient } from '@/libs/query'
import { ToastProvider } from '@/libs/sonner'
import { RootStore } from '@/store/RootStore'

import { Child } from './Child'

export const RootPage = () => {
  return (
    <StoreProvider store={RootStore.store}>
      <PersistGate persistor={RootStore.persistor}>
        <QueryClientProvider client={queryClient}>
          <Child />
          <ToastProvider />
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}
