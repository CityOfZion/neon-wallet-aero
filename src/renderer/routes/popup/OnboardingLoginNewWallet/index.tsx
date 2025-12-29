import { useTranslation } from 'react-i18next'
import { Outlet, useMatch } from 'react-router-dom'

import { Stepper } from '@renderer/components/Stepper'

import { LoginLayout } from '@renderer/layouts/LoginLayout'

export const OnboardingLoginNewWalletPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWallet' })

  const match = useMatch('/:path/:currentStep')
  const currentStep = match ? Number(match.params.currentStep) : 1

  return (
    <LoginLayout withBackButton={currentStep < 3}>
      <Stepper steps={t('steps', { returnObjects: true })} className="mt-8" currentStep={currentStep} />

      <h2 className="mt-17 mb-7 text-lg text-white">{t('description')}</h2>

      <Outlet />
    </LoginLayout>
  )
}

export default OnboardingLoginNewWalletPage
