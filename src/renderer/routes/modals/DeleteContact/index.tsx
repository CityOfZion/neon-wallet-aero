import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { StringHelper } from '@renderer/helpers/StringHelper'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import type { TModalState } from '@shared/types/modal'

export const DeleteContactModal = () => {
  const { name, onDelete } = useModalState<TModalState<'delete-contact'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'deleteContact' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-center gap-y-4 text-center">
          <TbAlertTriangle aria-hidden className="text-pink size-21 stroke-1" />

          <p className="px-4 text-lg font-medium">{t('warningText')}</p>

          <div className="mt-2 flex w-full gap-4 rounded-lg bg-gray-300/15 px-4 py-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700">
              <p>{StringHelper.getInitials(name)}</p>
            </div>
            <p className="truncate text-sm font-medium text-white">{name}</p>
          </div>

          <p className="text-sm leading-relaxed text-gray-100">{t('warningDescription')}</p>
        </div>

        <div className="flex gap-x-3 pt-4">
          <Button
            className="w-30"
            onClick={modalNavigateWrapper(-1)}
            label={tCommon('cancel')}
            variant="card"
            colorSchema="gray"
          />

          <Button
            label={t('buttonDeleteLabel')}
            variant="outlined"
            colorSchema="error"
            onClick={onDelete}
            className="w-full"
            leftIcon={<TbTrash aria-hidden />}
            iconsOnEdge={false}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default DeleteContactModal
