import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { SettingsLayout } from '@renderer/layouts/SettingsLayout'

export const ChangePasswordPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword' })
  const { pathname } = useLocation()

  const withBack = !pathname.endsWith('/change-password/2') && !pathname.endsWith('/change-password/3')

  return (
    <SettingsLayout title={t('title')} withBack={withBack}>
      <Outlet />
    </SettingsLayout>
  )
}

export default ChangePasswordPage
