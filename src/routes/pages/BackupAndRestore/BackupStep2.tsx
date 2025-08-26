import { useTranslation } from 'react-i18next'
import { Location, useLocation } from 'react-router-dom'

import { DownloadQRCodePasswordButton } from '@/components/DownloadQRCodePasswordButton'
import { Link } from '@/components/Link'
import { Separator } from '@/components/Separator'

import TbDownload from '@/assets/images/tb-download.svg?react'
import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

type TLocationState = {
  backupPassword: string
}

export const BackupStep2 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'backupAndRestore.backup.step2' })
  const {
    state: { backupPassword },
  } = useLocation() as Location<TLocationState>

  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-4 pb-5">
      <div className="mb-4 flex w-full flex-col items-center justify-center">
        <TbRosetteDiscountCheck className="text-blue mb-6 h-20 w-20" aria-hidden />
        <p className="text-lg">{t('subtitle')}</p>
      </div>

      <div className="flex w-full flex-col">
        <DownloadQRCodePasswordButton
          leftIcon={<TbDownload aria-hidden />}
          password={backupPassword}
          className="w-full"
        />
        <Separator className="my-5 w-full" />
        <Link variant="card" className="w-full" label={t('returnToSettingsButtonLabel')} to={'/app/settings'} />
      </div>
    </div>
  )
}
