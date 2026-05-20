import { Separator } from '@radix-ui/react-context-menu'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

export const MigrateFromNeon2SuccessFooter = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step4.success' })
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const handleEraseModal = () => {
    modalErase('bottom')
    navigate('/settings', { replace: true })
  }

  return (
    <div className="flex w-full grow flex-col items-center justify-end gap-7">
      <Separator />
      <Button variant="card" label={t('returnToSettingsButtonLabel')} onClick={handleEraseModal} className="w-full" />
    </div>
  )
}
