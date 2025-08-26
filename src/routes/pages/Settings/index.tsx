import { useTranslation } from 'react-i18next'

import { IconButton } from '@/components/IconButton'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { ScreenLayout } from '@/layouts/ScreenLayout'

import { SettingsLinkNavigation } from './SettingsLinkNavigation'

import Tb3dCubeSphere from '@/assets/images/tb-3d-cube-sphere.svg?react'
import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg?react'
import TbLock from '@/assets/images/tb-lock.svg?react'
import TbMenu2 from '@/assets/images/tb-menu-2.svg?react'
import TbMessage from '@/assets/images/tb-message.svg?react'
import TbNotes from '@/assets/images/tb-notes.svg?react'

export const SettingsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' })
  const { modalNavigateWrapper } = useModalNavigate()

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
          to="/app/settings/change-password"
        />

        <SettingsLinkNavigation
          icon={<Tb3dCubeSphere aria-hidden className="text-neon w-6" />}
          label={t('networkConfigurationButtonLabel')}
          to="/app/settings/network-configuration"
        />

        <SettingsLinkNavigation
          icon={<TbMessage aria-hidden className="text-neon w-6" />}
          label={t('languageButtonLabel')}
          to="/app/settings/language"
        />

        <SettingsLinkNavigation
          icon={<TbDeviceFloppy aria-hidden className="text-neon w-6" />}
          label={t('backupAndRestoreButtonLabel')}
          to="/app/settings/backup-and-restore"
        />

        <SettingsLinkNavigation
          icon={<TbNotes aria-hidden className="text-neon w-6" />}
          label={t('releaseNotesButtonLabel')}
          to="/app/settings/release-notes"
          hideSeparator
        />
      </div>
    </ScreenLayout>
  )
}
