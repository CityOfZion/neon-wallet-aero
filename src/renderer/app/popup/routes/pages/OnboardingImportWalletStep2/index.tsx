import { useLocation, useNavigate } from 'react-router-dom'

import { OnboardingLoginNewWalletStep2Page } from '../OnboardingLoginNewWalletStep2'

export const OnboardingImportWalletStep2Page = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleSubmit = async (password: string) => {
    navigate('/onboarding-import-wallet/3', { state: { password, ...state } })
  }

  return <OnboardingLoginNewWalletStep2Page onSubmit={handleSubmit} />
}

export default OnboardingImportWalletStep2Page
