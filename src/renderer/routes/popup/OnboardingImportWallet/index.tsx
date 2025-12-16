import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useMatch } from 'react-router-dom'

import { Stepper } from '@renderer/components/Stepper'

import { LoginLayout } from '@renderer/layouts/LoginLayout'

export const OnboardingImportWalletPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet' })
  const { state } = useLocation()

  const match = useMatch('/:path/:currentStep')
  const currentStep = match ? Number(match.params.currentStep) : 1

  const steps = t('steps', { returnObjects: true }) as string[]
  if (state?.isMigration) {
    steps[2] = t('migrationLabel')
  }

  return (
    <LoginLayout showBackButton={currentStep < 4}>
      <Stepper steps={t('steps', { returnObjects: true })} className="mt-8" currentStep={currentStep} />

      <h2 className="mt-17 mb-7 text-lg text-white">{t('title')}</h2>

      <Outlet />
    </LoginLayout>
  )
}

export default OnboardingImportWalletPage
