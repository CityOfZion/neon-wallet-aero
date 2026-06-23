import { useTranslation } from 'react-i18next'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'

import { ConfirmActionContent } from './ConfirmActionContent'

export const ConfirmActionBottomModal = () => {
  const { onSuccess, onCancel } = useModalState<TModalState<'confirm-action-bottom'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'confirmAction' })

  return (
    <BottomModalLayout
      heading={t('heading')}
      className="overflow-y-auto"
      eraseOnEsc={false}
      eraseOnClickOutside={false}
      onClose={onCancel}
    >
      <ConfirmActionContent onSuccess={onSuccess} onCancel={onCancel} />
    </BottomModalLayout>
  )
}

export default ConfirmActionBottomModal
