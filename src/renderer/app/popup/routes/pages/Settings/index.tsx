import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/IconButton'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import { SettingsLinkNavigation } from './SettingsLinkNavigation'

import Tb3dCubeSphere from '@renderer/assets/images/tb-3d-cube-sphere.svg?react'
import TbDeviceFloppy from '@renderer/assets/images/tb-device-floppy.svg?react'
import TbLock from '@renderer/assets/images/tb-lock.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'
import TbNotes from '@renderer/assets/images/tb-notes.svg?react'
import TbPackageImport from '@renderer/assets/images/tb-package-import.svg?react'

export const SettingsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { loginSession } = useLoginSessionSelector()

  const isLoginSessionPassword = loginSession?.type === 'password'

  return (
    <ScreenLayout className="bg-asphalt text-white">
      <div className="flex w-full gap-9">
        <header className="relative mt-2 mb-5 flex w-full flex-row items-center justify-end text-white">
          <h1 className="w-full max-w-[82%] truncate text-center text-sm font-bold">{t('title')}</h1>

          <IconButton
            aria-label={t('menuIconButtonAriaLabel')}
            className="mb-0.5"
            icon={<TbMenu2 aria-hidden />}
            onClick={modalNavigateWrapper('menu')}
          />
        </header>
      </div>
      <div className="flex flex-col">
        <SettingsLinkNavigation
          icon={<TbLock aria-hidden className="text-neon w-6" />}
          label={t('changePasswordButtonLabel')}
          to="/settings/change-password"
          isDisabled={!isLoginSessionPassword}
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
          icon={<TbDeviceFloppy aria-hidden className="text-neon w-6" />}
          label={t('backupAndRestoreButtonLabel')}
          to="/settings/backup-and-restore"
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
    </ScreenLayout>
  )
}

export default SettingsPage
