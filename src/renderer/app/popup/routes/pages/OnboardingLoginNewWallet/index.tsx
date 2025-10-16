import { useTranslation } from 'react-i18next'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import { IconButton } from '@renderer/components/IconButton'
import { Stepper } from '@renderer/components/Stepper'
import { LoginLayout } from '@renderer/layouts/LoginLayout'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

export const OnboardingLoginNewWalletPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingLoginNewWallet' })
  const navigate = useNavigate()

  const match = useMatch('/:path/:currentStep')
  const currentStep = match ? Number(match.params.currentStep) : 1

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <LoginLayout>
      <Stepper steps={t('steps', { returnObjects: true })} className="mt-8" currentStep={currentStep} />

      <div className="relative mt-17 mb-7 flex w-full items-center justify-center">
        {currentStep < 3 && (
          <IconButton
            aria-label={t('goBackIconButtonLabel')}
            icon={<TbArrowLeft aria-hidden />}
            variant="contained"
            className="absolute left-0"
            onClick={handleGoBack}
          />
        )}

        <h2 className="text-lg text-white">{t('description')}</h2>
      </div>

      <Outlet />
    </LoginLayout>
  )
}

export default OnboardingLoginNewWalletPage
