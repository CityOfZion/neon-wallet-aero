import { useTranslation } from 'react-i18next'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import type { TModalState } from '@shared/types/modal'

import { ConfirmActionContent } from './ConfirmActionContent'

export const ConfirmActionSideModal = () => {
  const { onSuccess, onCancel } = useModalState<TModalState<'confirm-action-side'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'confirmAction' })

  return (
    <SideModalLayout
      heading={t('heading')}
      className="overflow-y-auto"
      contentClassName="h-full"
      closeOnEsc={false}
      closeOnClickOutside={false}
      onClose={onCancel}
    >
      <ConfirmActionContent onSuccess={onSuccess} onCancel={onCancel} />
    </SideModalLayout>
  )
}

export default ConfirmActionSideModal
