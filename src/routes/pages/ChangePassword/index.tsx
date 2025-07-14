import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { SettingsLayout } from '@/layouts/Settings'

export const ChangePasswordPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword' })

  return (
    <SettingsLayout title={t('title')}>
      <Outlet />
    </SettingsLayout>
  )
}
