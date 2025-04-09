import { useCallback, useContext } from 'react'

import { ModalRouterContext } from '@/contexts/ModalRouterContext'
import { ModalRouterCurrentHistoryContext } from '@/contexts/ModalRouterCurrentHistoryContext'
import { TUseModalNavigateResponse } from '@/types/hooks'
import { TModalRouterContextNavigateOptions, TRouteType } from '@/types/modal'

export const useModalNavigate = (): TUseModalNavigateResponse => {
  const { navigate: modalNavigate, erase: modalErase } = useContext(ModalRouterContext)

  const modalNavigateWrapper = useCallback(
    (name: any, options?: TModalRouterContextNavigateOptions) => {
      return () => {
        modalNavigate(name, options)
      }
    },
    [modalNavigate]
  )

  const modalEraseWrapper = useCallback(
    (type: TRouteType) => {
      return () => {
        modalErase(type)
      }
    },
    [modalErase]
  )

  return {
    modalNavigate,
    modalNavigateWrapper,
    modalErase,
    modalEraseWrapper,
  }
}

export const useModalState = <T>(): T => {
  const { value } = useContext(ModalRouterCurrentHistoryContext)
  return (value?.state ?? {}) as T
}

export const useModalHistories = () => {
  const { histories, historiesRef } = useContext(ModalRouterContext)
  return { histories, historiesRef }
}
