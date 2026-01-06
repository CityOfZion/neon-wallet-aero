import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

export const SupportTicketSuccessContent = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'supportTicket.successContent' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <div className="flex h-full flex-col items-center justify-between pt-4 text-center">
      <p className="text-sm text-gray-100">{t('description')}</p>

      <Button variant="card" label={t('closeButtonLabel')} onClick={modalNavigateWrapper(-1)} className="w-full" />
    </div>
  )
}
