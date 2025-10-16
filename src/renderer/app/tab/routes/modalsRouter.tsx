import { lazy } from 'react'
import { TRoute } from '@shared/types/modal'

const BuyAndSellTokensAboutModal = lazy(() =>
  import('./modals/BuyAndSellTokensAbout').then(m => ({ default: m.BuyAndSellTokensAboutModal }))
)
const SellTokensDepositModal = lazy(() =>
  import('./modals/SellTokensDeposit').then(m => ({ default: m.SellTokensDepositModal }))
)
const SellTokensDepositSuccessModal = lazy(() =>
  import('./modals/SellTokensDepositSuccess').then(m => ({ default: m.SellTokensDepositSuccessModal }))
)
const SellTokensDepositErrorModal = lazy(() =>
  import('./modals/SellTokensDepositError').then(m => ({ default: m.SellTokensDepositErrorModal }))
)

export const modalsRouter: TRoute[] = [
  { name: 'buy-and-sell-tokens-about', type: 'side', element: BuyAndSellTokensAboutModal },
  { name: 'sell-tokens-deposit', type: 'side', element: SellTokensDepositModal },
  { name: 'sell-tokens-deposit-success', type: 'side', element: SellTokensDepositSuccessModal },
  { name: 'sell-tokens-deposit-error', type: 'side', element: SellTokensDepositErrorModal },
]
