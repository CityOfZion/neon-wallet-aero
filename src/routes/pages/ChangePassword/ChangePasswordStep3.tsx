import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'

import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

export const ChangePasswordStep3 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword.step3' })
  const navigate = useNavigate()

  const handleReturnToSettings = () => {
    navigate('/app/settings')
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-5 pb-10">
      <div className="flex flex-col items-center gap-5">
        <div className="bg-asphalt flex h-36 w-36 items-center justify-center rounded-full">
          <TbRosetteDiscountCheck aria-hidden={true} className="text-blue h-[7rem] w-[7rem]" />
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
