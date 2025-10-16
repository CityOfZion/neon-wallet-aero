import { useTranslation } from 'react-i18next'

import { Link } from '@renderer/components/Link'

import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

export const BackupAndRestoreRestoreStep3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.confirmPasswordRecover' })

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center">
      <div className="flex flex-grow flex-col items-center">
        <TbRosetteDiscountCheck className="text-blue h-25 w-25 stroke-1" aria-hidden />
        <h3 className="mt-3 text-center text-sm font-bold text-white">{t('importSuccess')}</h3>
      </div>

      <Link to="/settings" label={t('returnToSettings')} colorSchema="neon" variant="card" className="mx-auto w-full" />
    </div>
  )
}

export default BackupAndRestoreRestoreStep3Page
