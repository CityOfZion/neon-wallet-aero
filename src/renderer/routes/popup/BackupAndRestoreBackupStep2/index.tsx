import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { DownloadQRCodePasswordButton } from '@renderer/components/DownloadQRCodePasswordButton'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'

import TbDownload from '@renderer/assets/images/tb-download.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

type TLocationState = {
  backupPassword: string
}

export const BackupAndRestoreBackupStep2Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'backupAndRestore.backup.step2' })
  const {
    state: { backupPassword },
  } = useLocation() as Location<TLocationState>

  return (
    <div className="flex h-full w-full flex-col items-center justify-between pt-4">
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
        <Link variant="card" className="w-full" label={t('returnToSettingsButtonLabel')} to="/settings" />
      </div>
    </div>
  )
}

export default BackupAndRestoreBackupStep2Page
