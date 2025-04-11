import { MenuModal } from '@/routes/modals/Menu'
import { TRoute } from '@/types/modal'

import { AccountSelectionModal } from './modals/AccountSelection'
import { WalletSelectionModal } from './modals/WalletSelection'

export const modalsRouter: TRoute[] = [
  { name: 'wallet-selection', type: 'bottom', element: <WalletSelectionModal /> },
  { name: 'account-selection', type: 'bottom', element: <AccountSelectionModal /> },
  { name: 'menu', type: 'side', element: <MenuModal /> },
]
