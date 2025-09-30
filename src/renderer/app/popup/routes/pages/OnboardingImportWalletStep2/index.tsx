import { useLocation, useNavigate } from 'react-router-dom'

import { OnboardingLoginNewWalletStep2 } from '../OnboardingLoginNewWalletStep2'

export const OnboardingImportWalletStep2 = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleSubmit = async (password: string) => {
    navigate('/onboarding-import-wallet/3', { state: { password, ...state } })
  }

  return <OnboardingLoginNewWalletStep2 onSubmit={handleSubmit} />
}
