import { createContext } from 'react'
import { TModalRouterCurrentHistoryContextValue, TModalRouterCurrentHistoryProviderProps } from '@shared/types/modal'

export const ModalRouterCurrentHistoryContext = createContext<TModalRouterCurrentHistoryContextValue>(
  {} as TModalRouterCurrentHistoryContextValue
)

export const ModalRouterCurrentHistoryProvider = ({
  value,
  isFocused,
  children,
}: TModalRouterCurrentHistoryProviderProps) => {
  return (
    <ModalRouterCurrentHistoryContext.Provider value={{ value, isFocused }}>
      {children}
    </ModalRouterCurrentHistoryContext.Provider>
  )
}
