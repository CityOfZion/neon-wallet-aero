import { TRoute } from '@/types/modal'

import { AccountSelectionModal } from './modals/AccountSelection'
import { BlockchainSelectionModal } from './modals/BlockchainSelection'
import { ConfirmPasswordModal } from './modals/ConfirmPassword'
import { CreateAccountStep1Modal } from './modals/CreateAccountStep1'
import { CreateAccountStep2Modal } from './modals/CreateAccountStep2'
import { CreateWalletStep1Modal } from './modals/CreateWalletStep1'
import { CreateWalletStep2Modal } from './modals/CreateWalletStep2'
import { CreateWalletStep3Modal } from './modals/CreateWalletStep3'
import { CreateWalletStep4Modal } from './modals/CreateWalletStep4'
import { DecryptKeyModal } from './modals/DecryptKey'
import { ExportKeyModal } from './modals/ExportKey'
import { ExportMnemonicModal } from './modals/ExportMnemonic'
import { ImportAccountsSelectionModal } from './modals/ImportAccountsSelection'
import { MenuModal } from './modals/Menu'
import { MigrateAccountsStep3Modal } from './modals/MigrateAccountsStep3'
import { MigrateAccountsStep4Modal } from './modals/MigrateAccountsStep4'
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
  { name: 'create-account-1', type: 'bottom', element: <CreateAccountStep1Modal /> },
  { name: 'create-account-2', type: 'bottom', element: <CreateAccountStep2Modal /> },
  { name: 'confirm-password', type: 'bottom', element: <ConfirmPasswordModal /> },
  { name: 'export-wallet', type: 'bottom', element: <ExportMnemonicModal /> },
  { name: 'export-account', type: 'bottom', element: <ExportKeyModal /> },
  { name: 'migrate-accounts-3', type: 'bottom', element: <MigrateAccountsStep3Modal /> },
  { name: 'migrate-accounts-4', type: 'bottom', element: <MigrateAccountsStep4Modal /> },
]
