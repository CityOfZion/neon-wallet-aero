import { TRoute } from '@/types/modal'

import { AccountSelectionModal } from './modals/AccountSelection'
import { BlockchainSelectionModal } from './modals/BlockchainSelection'
import { DecryptKeyModal } from './modals/DecryptKey'
import { ImportAccountsSelectionModal } from './modals/ImportAccountsSelection'
import { MenuModal } from './modals/Menu'
import { WalletSelectionModal } from './modals/WalletSelection'

export const modalsRouter: TRoute[] = [
  { name: 'wallet-selection', type: 'bottom', element: <WalletSelectionModal /> },
  { name: 'account-selection', type: 'bottom', element: <AccountSelectionModal /> },
  { name: 'menu', type: 'side', element: <MenuModal /> },
  { name: 'import-accounts-selection', type: 'bottom', element: <ImportAccountsSelectionModal /> },
  { name: 'blockchain-selection', type: 'bottom', element: <BlockchainSelectionModal /> },
  { name: 'decrypt-key', type: 'bottom', element: <DecryptKeyModal /> },
]
