import { useCallback } from 'react'

import { useTranslation } from 'react-i18next'

import type { TRouteType } from '@shared/types/modal'
import type { TAccount } from '@shared/types/store'

import { useShouldConfirmActionSelector } from './useAuthSelector'
import { useModalNavigate } from './useModalRouter'

type TConfirmActionParams = {
  account: TAccount
  modalType?: TRouteType
}

export const useConfirmAction = () => {
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('hooks', { keyPrefix: 'useConfirmAction' })
  const { shouldConfirmAction } = useShouldConfirmActionSelector()

  const confirmAction = useCallback(
    async ({ account, modalType = 'bottom' }: TConfirmActionParams) => {
      return new Promise<void>((resolve, reject) => {
        const handleReject = () => {
          return reject(t('unauthorizedAction'))
        }

        if (account.type === 'watch') {
          return handleReject()
        }

        if (account.type === 'hardware' || !shouldConfirmAction) {
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
    [t, modalNavigate, shouldConfirmAction]
  )

  return { confirmAction }
}
