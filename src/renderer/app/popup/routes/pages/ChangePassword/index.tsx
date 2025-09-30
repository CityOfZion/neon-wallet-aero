import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { SettingsLayout } from '@renderer/layouts/Settings'

export const ChangePasswordPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword' })
  const location = useLocation()

  const hideBackButton = location.pathname.endsWith('/change-password/3')

  return (
    <SettingsLayout title={t('title')} hideBackButton={hideBackButton}>
      <Outlet />
    </SettingsLayout>
  )
}
