import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Tabs } from '@renderer/components/Tabs'

import { SettingsLayout } from '@renderer/layouts/Settings'

type TTab = 'backup' | 'restore'

type TLocationState = {
  tab?: TTab
}

export const BackupAndRestorePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' })
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location as Location<TLocationState>

  const [tab, setTab] = useState<TTab>('backup')

  useEffect(() => {
    if (state?.tab) {
      setTab(state.tab)
    }
  }, [state?.tab])

  const handleTabChange = (tab: TTab) => {
    setTab(tab)
    navigate(`${tab}/1`, { replace: true })
  }

  const hideBackButton = location.pathname.endsWith('/backup/2')

  return (
    <SettingsLayout title={t('backupAndRestoreButtonLabel')} hideBackButton={hideBackButton}>
      <Tabs.Root className="flex h-full flex-col" value={tab} onValueChange={tab => handleTabChange(tab as TTab)}>
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
