import { useLocation, useNavigate } from 'react-router-dom'

import { OnboardingLoginNewWalletStep1Page } from '../OnboardingLoginNewWalletStep1'

export const OnboardingImportWalletStep1Page = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleSubmit = async (password: string) => {
    navigate('/onboarding-import-wallet/2', { state: { password, ...state } })
  }

  return <OnboardingLoginNewWalletStep1Page onSubmit={handleSubmit} />
}

export default OnboardingImportWalletStep1Page
