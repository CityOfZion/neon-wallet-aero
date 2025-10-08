import { TRoute } from '@shared/types/modal'

import { AccountReceiveSelectionModal } from './modals/AccountReceiveSelectionModal'
import { AccountSelectionModal } from './modals/AccountSelection'
import { BlockchainSelectionModal } from './modals/BlockchainSelection'
import { ConfirmPasswordModal } from './modals/ConfirmPassword'
import { ContactAddressFormModal } from './modals/ContactAddressForm'
import { ContactDetailsModal } from './modals/ContactDetails'
import { CreateAccountStep1Modal } from './modals/CreateAccountStep1'
import { CreateAccountStep2Modal } from './modals/CreateAccountStep2'
import { CreateWalletStep1Modal } from './modals/CreateWalletStep1'
import { CreateWalletStep2Modal } from './modals/CreateWalletStep2'
import { CreateWalletStep3Modal } from './modals/CreateWalletStep3'
import { CreateWalletStep4Modal } from './modals/CreateWalletStep4'
import { DappConnectionModal } from './modals/DappConnection'
import { DappConnectionRequestModal } from './modals/DappConnectionRequest'
import { DappDisconnectionModal } from './modals/DappDisconnection'
import { DecryptKeyModal } from './modals/DecryptKey'
import { DeleteContactModal } from './modals/DeleteContact'
import { DeleteContactAddressModal } from './modals/DeleteContactAddress'
import { ExportKeyModal } from './modals/ExportKey'
import { ExportMnemonicModal } from './modals/ExportMnemonic'
import { ImportAccountsSelectionModal } from './modals/ImportAccountsSelection'
import { MenuModal } from './modals/Menu'
import { MigrateFromNeon2Step3Modal } from './modals/MigrateFromNeon2Step3'
import { MigrateFromNeon2Step4Modal } from './modals/MigrateFromNeon2Step4'
import { Neo3NeoXBridgeConfirmationModal } from './modals/Neo3NeoXBridgeConfirmationModal'
import { Neo3NeoXBridgeDetailsModal } from './modals/Neo3NeoXBridgeDetailsModal'
import { Neo3NeoXBridgeInfoModal } from './modals/Neo3NeoXBridgeInfo'
import { NetworkNodeSelectionModal } from './modals/NetworkNodeSelection'
import { NetworkSelectionModal } from './modals/NetworkSelection'
import { SaveContactModal } from './modals/SaveContact'
import { SuccessModal } from './modals/Success'
import { SwapAboutExtraIdToReceiveModal } from './modals/SwapAboutExtraIdToReceive'
import { SwapConfirmationModal } from './modals/SwapConfirmation'
import { SwapDetailsModal } from './modals/SwapDetails'
import { SwapInfoModal } from './modals/SwapInfo'
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
  { name: 'export-mnemonic', type: 'bottom', element: <ExportMnemonicModal /> },
  { name: 'export-key', type: 'bottom', element: <ExportKeyModal /> },
  { name: 'migrate-from-neon2-3', type: 'bottom', element: <MigrateFromNeon2Step3Modal /> },
  { name: 'migrate-from-neon2-4', type: 'bottom', element: <MigrateFromNeon2Step4Modal /> },
  { name: 'success', type: 'bottom', element: <SuccessModal /> },
  { name: 'contact-details', type: 'bottom', element: <ContactDetailsModal /> },
  { name: 'dapp-connection', type: 'bottom', element: <DappConnectionModal /> },
  { name: 'dapp-connection-request', type: 'bottom', element: <DappConnectionRequestModal /> },
  { name: 'dapp-disconnection', type: 'bottom', element: <DappDisconnectionModal /> },
  { name: 'save-contact', type: 'bottom', element: <SaveContactModal /> },
  { name: 'contact-address-form', type: 'bottom', element: <ContactAddressFormModal /> },
  { name: 'delete-contact', type: 'bottom', element: <DeleteContactModal /> },
  { name: 'delete-contact-address', type: 'bottom', element: <DeleteContactAddressModal /> },
  { name: 'swap-about-extra-id-to-receive', type: 'bottom', element: <SwapAboutExtraIdToReceiveModal /> },
  { name: 'swap-info', type: 'bottom', element: <SwapInfoModal /> },
  { name: 'swap-details', type: 'bottom', element: <SwapDetailsModal /> },
  { name: 'swap-confirmation', type: 'bottom', element: <SwapConfirmationModal /> },
  { name: 'network-selection', type: 'bottom', element: <NetworkSelectionModal /> },
  { name: 'network-node-selection', type: 'bottom', element: <NetworkNodeSelectionModal /> },
  { name: 'account-receive-selection', type: 'bottom', element: <AccountReceiveSelectionModal /> },
  { name: 'neo3-neox-bridge-info', type: 'bottom', element: <Neo3NeoXBridgeInfoModal /> },
  { name: 'neo3-neox-bridge-confirmation', type: 'bottom', element: <Neo3NeoXBridgeConfirmationModal /> },
  { name: 'neo3-neox-bridge-details', type: 'bottom', element: <Neo3NeoXBridgeDetailsModal /> },
]
