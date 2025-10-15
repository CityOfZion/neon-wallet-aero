import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/Button'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

export const DeleteContactModal = () => {
  const { name, onDelete } = useModalState<TModalState<'delete-contact'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'deleteContact' })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-center gap-y-6 text-center">
          <div className="bg-asphalt flex h-24 w-24 items-center justify-center rounded-full">
            <TbAlertTriangle aria-hidden className="text-pink h-20 w-20 pb-1.5" />
          </div>

          <p className="px-4 text-lg font-medium text-gray-100">{t('warningText')}</p>

          <div className="w-full max-w-xs rounded-lg bg-gray-800/50 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{name}</p>
          </div>

          <p className="px-6 text-sm leading-relaxed text-gray-400">{t('warningDescription')}</p>
        </div>

        <div className="pt-4">
          <Button
            label={t('buttonDeleteLabel')}
            variant="outlined"
            colorSchema="error"
            onClick={onDelete}
            className="w-full font-semibold"
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default DeleteContactModal
