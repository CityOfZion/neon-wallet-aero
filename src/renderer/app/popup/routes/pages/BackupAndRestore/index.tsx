import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs } from '@renderer/components/Tabs'
import { SettingsLayout } from '@renderer/layouts/Settings'

type TTab = 'backup' | 'restore'

export const BackupAndRestorePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' })
  const navigate = useNavigate()
  const location = useLocation()

  const handleTabChange = (tab: TTab) => {
    navigate(`${tab}/1`, { replace: true })
  }

  const hideBackButton = location.pathname.endsWith('/backup/2')

  return (
    <SettingsLayout title={t('backupAndRestoreButtonLabel')} hideBackButton={hideBackButton}>
      <Tabs.Root
        className="flex h-full flex-col"
        defaultValue="backup"
        onValueChange={tab => handleTabChange(tab as TTab)}
      >
        <Tabs.List>
          <Tabs.Trigger value="backup">{t('settingsBackupWallet.title')}</Tabs.Trigger>
          <Tabs.Trigger value="restore">{t('settingsRestoreWallet.title')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="backup" className="min-h-0 flex-1">
          <Outlet />
        </Tabs.Content>

        <Tabs.Content value="restore" className="min-h-0 flex-1">
          <Outlet />
        </Tabs.Content>
      </Tabs.Root>
    </SettingsLayout>
  )
}

export default BackupAndRestorePage
