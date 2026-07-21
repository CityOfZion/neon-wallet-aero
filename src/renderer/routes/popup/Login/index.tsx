import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Tabs } from '@renderer/components/Tabs'

import { LoginLayout } from '@renderer/layouts/LoginLayout'

export const LoginPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' })
  const navigate = useNavigate()
  const location = useLocation()

  const value = location.pathname.split('/')[2] ?? 'neon-account'

  return (
    <LoginLayout withBack={false}>
      <Tabs.Root className="my-10" value={value}>
        <Tabs.List>
          <Tabs.Trigger value="neon-account" onClick={() => navigate('/login/neon-account')}>
            {t('neonAccountTabLabel')}
          </Tabs.Trigger>

          <Tabs.Trigger value="hardware-wallet" onClick={() => navigate('/login/hardware-wallet')}>
            {t('hardwareWalletTabLabel')}
          </Tabs.Trigger>

          <Tabs.Trigger value="address-or-key" onClick={() => navigate('/login/address-or-key')}>
            {t('addressOrKeyTabLabel')}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <Outlet />
    </LoginLayout>
  )
}

export default LoginPage
