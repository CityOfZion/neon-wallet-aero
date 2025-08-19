import { useTranslation } from 'react-i18next'

import { Link } from '@/components/Link'

import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

export const RestoreBackupStep3 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center">
      <div className="flex flex-grow flex-col items-center">
        <TbRosetteDiscountCheck className="text-blue h-25 w-25 stroke-1" aria-hidden />
        <h3 className="mt-3 text-center text-sm font-bold text-white">{t('importSuccess')}</h3>
      </div>

      <Link
        to="/app/settings"
        label={t('returnToSettings')}
        colorSchema="neon"
        variant="contained"
        className="mx-auto w-full"
      />
    </div>
  )
}
