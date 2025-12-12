import { useCallback } from 'react'

import { useTranslation } from 'react-i18next'

import type { TRouteType } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

import { useModalNavigate } from './useModalRouter'

type TConfirmActionParams = {
  account: IAccountState
  modalType?: TRouteType
}

export const useConfirmAction = () => {
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('hooks', { keyPrefix: 'useConfirmAction' })

  const confirmAction = useCallback(
    async ({ account, modalType = 'bottom' }: TConfirmActionParams) => {
      return new Promise<void>((resolve, reject) => {
        const handleReject = () => {
          const message = t('unauthorizedAction')
          return reject(message)
        }

        if (account.type === 'watch') {
          return handleReject()
        }

        if (account.type === 'hardware') {
          resolve()
          return
        }

        modalNavigate(`confirm-action-${modalType}`, {
          state: {
            onSuccess: resolve,
            onCancel: handleReject,
          },
        })
      })
    },
    [t, modalNavigate]
  )

  return { confirmAction }
}
