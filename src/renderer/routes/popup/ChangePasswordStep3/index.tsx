import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'

import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

export const ChangePasswordStep3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword.step3' })
  const navigate = useNavigate()

  const handleReturnToSettings = () => {
    navigate('/settings')
  }

  return (
    <div className="flex size-full flex-col items-center justify-between pb-10">
      <div className="flex flex-col items-center gap-5">
        <div className="bg-asphalt flex size-36 items-center justify-center rounded-full">
          <TbRosetteDiscountCheck aria-hidden className="text-blue size-28" />
        </div>

        <span className="w-80 text-center text-lg">{t('subtitle')}</span>
      </div>

      <Button
        label={t('buttonLabel')}
        type="button"
        variant="card"
        className="w-full"
        clickableProps={{ className: 'h-12' }}
        onClick={handleReturnToSettings}
        iconsOnEdge={false}
      />
    </div>
  )
}

export default ChangePasswordStep3Page
