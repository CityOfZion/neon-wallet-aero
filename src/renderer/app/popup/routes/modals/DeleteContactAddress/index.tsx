import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/Button'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

export const DeleteContactAddressModal = () => {
  const { name, address, onDelete } = useModalState<TModalState<'delete-contact-address'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'deleteContactAddress' })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-center gap-y-6 text-center">
          <div className="bg-asphalt flex h-24 w-24 items-center justify-center rounded-full">
            <TbAlertTriangle aria-hidden className="text-pink h-20 w-20 pb-1.5" />
          </div>

          <p className="px-4 text-lg font-medium text-gray-100">{t('warningText')}</p>

          <div className="w-full max-w-xs rounded-lg bg-gray-800/50 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{address}</p>
          </div>

          <p className="px-6 text-sm leading-relaxed text-gray-400">{t('warningDescription')}</p>

          <div className="flex max-w-sm items-center gap-3 rounded-lg border border-gray-600/30 bg-gray-800/40 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600/50">
              <span className="text-xs text-gray-300">{StringHelper.getInitials(name)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-wide text-gray-400 uppercase">{t('fromContact')}</p>
              <p className="truncate text-sm font-medium text-gray-100">{name}</p>
            </div>
          </div>
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

export default DeleteContactAddressModal
