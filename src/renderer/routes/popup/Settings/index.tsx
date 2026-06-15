import { useTranslation } from 'react-i18next'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

import BsCash from '@renderer/assets/images/bs-cash.svg?react'
import MdOutlineLanguage from '@renderer/assets/images/md-outline-language.svg?react'
import Tb3dCubeSphere from '@renderer/assets/images/tb-cube-3d-sphere.svg?react'
import TbDeviceFloppy from '@renderer/assets/images/tb-device-floppy.svg?react'
import TbLock from '@renderer/assets/images/tb-lock.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'
import TbNotes from '@renderer/assets/images/tb-notes.svg?react'
import TbPackageImport from '@renderer/assets/images/tb-package-import.svg?react'

import { SettingsLinkNavigation } from './SettingsLinkNavigation'

export const SettingsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' })
  const { loginSession } = useLoginSessionSelector()

  const isLoginSessionPassword = loginSession?.type === 'password'
  const isLoginSessionHardware = loginSession?.type === 'hardware'

  return (
    <SettingsLayout title={t('title')} backUrl="/wallets">
      <div className="flex flex-col">
        <SettingsLinkNavigation
          icon={<TbLock aria-hidden className="text-neon w-6" />}
          label={t('changePasswordButtonLabel')}
          to="/settings/change-password"
          isDisabled={!isLoginSessionPassword}
        />

        <SettingsLinkNavigation
          icon={<MdOutlineLanguage aria-hidden className="text-neon w-6" />}
          label={t('generalButtonLabel')}
          to="/settings/general"
          isDisabled={isLoginSessionHardware}
        />

        <SettingsLinkNavigation
          icon={<Tb3dCubeSphere aria-hidden className="text-neon w-6" />}
          label={t('networkConfigurationButtonLabel')}
          to="/settings/network-configuration"
        />

        <SettingsLinkNavigation
          icon={<TbMessage aria-hidden className="text-neon w-6" />}
          label={t('languageButtonLabel')}
          to="/settings/language"
        />

        <SettingsLinkNavigation
          icon={<BsCash aria-hidden className="text-neon w-6" />}
          label={t('currencyButtonLabel')}
          to="/settings/currency"
        />

        <SettingsLinkNavigation
          icon={<TbDeviceFloppy aria-hidden className="text-neon w-6" />}
          label={t('backupAndRestoreButtonLabel')}
          to="/settings/backup-and-restore/backup/1"
          isDisabled={!isLoginSessionPassword}
        />

        <SettingsLinkNavigation
          icon={<TbNotes aria-hidden className="text-neon w-6" />}
          label={t('releaseNotesButtonLabel')}
          to="/settings/release-notes"
        />

        <SettingsLinkNavigation
          icon={<TbPackageImport aria-hidden className="text-neon w-6" />}
          label={t('migrateFromNeon2ButtonLabel')}
          to="/settings/migrate-from-neon2"
          hideSeparator
          isDisabled={!isLoginSessionPassword}
        />
      </div>
    </SettingsLayout>
  )
}

export default SettingsPage
