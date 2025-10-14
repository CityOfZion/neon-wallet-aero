import { TRoute } from '@shared/types/modal'

import { BuyAndSellTokensAboutModal } from './modals/BuyAndSellTokensAbout'
import { SellTokensDepositModal } from './modals/SellTokensDeposit'
import { SellTokensDepositErrorModal } from './modals/SellTokensDepositError'
import { SellTokensDepositSuccessModal } from './modals/SellTokensDepositSuccess'

export const modalsRouter: TRoute[] = [
  { name: 'buy-and-sell-tokens-about', type: 'side', element: <BuyAndSellTokensAboutModal /> },
  { name: 'sell-tokens-deposit', type: 'side', element: <SellTokensDepositModal /> },
  { name: 'sell-tokens-deposit-success', type: 'side', element: <SellTokensDepositSuccessModal /> },
  { name: 'sell-tokens-deposit-error', type: 'side', element: <SellTokensDepositErrorModal /> },
]
