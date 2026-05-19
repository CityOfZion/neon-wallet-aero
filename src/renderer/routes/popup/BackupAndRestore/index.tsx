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
  const stateTab = state?.tab

  const [tab, setTab] = useState<TTab>(stateTab || 'backup')

  const withBack = location.pathname.includes('/1')

  const handleTabChange = (newTab: TTab) => {
    setTab(newTab)
    navigate(`${newTab}/1`, { replace: true })
  }

  useEffect(() => {
    if (stateTab) {
      setTab(stateTab)
    }
  }, [stateTab])

  return (
    <SettingsLayout title={t('backupAndRestoreButtonLabel')} withBack={withBack}>
      <Tabs.Root className="flex h-full flex-col" value={tab} onValueChange={newTab => handleTabChange(newTab as TTab)}>
        <Tabs.List>
          <Tabs.Trigger disabled={!withBack} value="backup">
            {t('settingsBackupWallet.title')}
          </Tabs.Trigger>

          <Tabs.Trigger disabled={!withBack} value="restore">
            {t('settingsRestoreWallet.title')}
          </Tabs.Trigger>
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
