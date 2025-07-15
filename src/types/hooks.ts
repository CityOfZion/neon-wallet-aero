import { TModalRouterContextNavigateOptions, TRouteType } from './modal'
import { TModalRouterRouteTypes } from './modalRouterTypes'

export type TUseActionsData = Record<string, any>

export type TUseActionsOptions = {
  clearErrorsOnChange?: boolean
}

export type TUseImportActionInputType = 'key' | 'mnemonic' | 'encrypted' | 'address'

export type TUseActionsErrors<T> = Record<keyof T, string | undefined>

export type TUseActionsChanged<T> = Record<keyof T, boolean>

export type TUseActionsActionState<T> = {
  hasChanged: boolean
  isValid: boolean
  isActing: boolean
  errors: TUseActionsErrors<T>
  changed: TUseActionsChanged<T>
  hasActed: boolean
}

type TUseModalNavigateFunction<R = void> = {
  (name: number): R
  <T extends keyof TModalRouterRouteTypes>(
    name: T,
    options?: TModalRouterContextNavigateOptions<TModalRouterRouteTypes[T]>
  ): R
}

export type TUseModalNavigateResponse = {
  modalNavigate: TUseModalNavigateFunction
  modalNavigateWrapper: TUseModalNavigateFunction<() => void>
  modalErase(type: TRouteType): void
  modalEraseWrapper(type: TRouteType): () => void
}
