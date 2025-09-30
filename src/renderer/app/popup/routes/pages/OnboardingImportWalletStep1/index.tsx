import { useLocation, useNavigate } from 'react-router-dom'

import { OnboardingLoginNewWalletStep1 } from '../OnboardingLoginNewWalletStep1'

export const OnboardingImportWalletStep1 = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleSubmit = async (password: string) => {
    navigate('/onboarding-import-wallet/2', { state: { password, ...state } })
  }

  return <OnboardingLoginNewWalletStep1 onSubmit={handleSubmit} />
}
