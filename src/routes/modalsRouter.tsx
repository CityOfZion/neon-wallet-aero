import { TRoute } from '@/types/modal'

import { AccountSelectionModal } from './modals/AccountSelection'
import { BlockchainSelectionModal } from './modals/BlockchainSelection'
import { CreateWalletStep1Modal } from './modals/CreateWalletStep1'
import { CreateWalletStep2Modal } from './modals/CreateWalletStep2'
import { CreateWalletStep3Modal } from './modals/CreateWalletStep3'
import { CreateWalletStep4Modal } from './modals/CreateWalletStep4'
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
  { name: 'create-wallet-1', type: 'bottom', element: <CreateWalletStep1Modal /> },
  { name: 'create-wallet-2', type: 'bottom', element: <CreateWalletStep2Modal /> },
  { name: 'create-wallet-3', type: 'bottom', element: <CreateWalletStep3Modal /> },
  { name: 'create-wallet-4', type: 'bottom', element: <CreateWalletStep4Modal /> },
]
