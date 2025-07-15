import { JSX } from 'react'

import { TModalRouterRouteTypes } from './modal-router-types'

export type TRouteType = 'side' | 'bottom'

export type TRoute = {
  element: JSX.Element
  name: string
  type: TRouteType
}

export type THistory<T = any> = {
  state: T
  replace: boolean
  id: string
  route: TRoute
}

export type TModalRouterContextNavigateOptions<T = any> = Partial<Pick<THistory<T>, 'state' | 'replace'>>

export type TModalRouterContextValue<T = any> = {
  navigate: (name: string | number, options?: TModalRouterContextNavigateOptions<T>) => void
  erase: (type: TRouteType) => void
  histories: THistory[]
  historiesRef: React.RefObject<THistory[]>
}

export type TModalRouterProviderProps = {
  routes: TRoute[]
  children: React.ReactNode
}

export type TModalRouterCurrentHistoryContextValue<T = any> = {
  value: THistory<T>
}

export type TModalRouterCurrentHistoryProviderProps<T = any> = {
  value: THistory<T>
  children: React.ReactNode
}

export type TModalState<K extends keyof TModalRouterRouteTypes> = TModalRouterRouteTypes[K]
