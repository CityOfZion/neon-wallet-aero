import { lazy } from 'react'

import type { TRoute } from '@shared/types/modal'

const AccountSelectionModal = lazy(() => import('./modals/AccountSelection'))
const BlockchainSelectionModal = lazy(() => import('./modals/BlockchainSelection'))
const ConfirmPasswordModal = lazy(() => import('./modals/ConfirmPassword'))
const ContactAddressFormModal = lazy(() => import('./modals/ContactAddressForm'))
const ContactDetailsModal = lazy(() => import('./modals/ContactDetails'))
const CreateAccountStep1Modal = lazy(() => import('./modals/CreateAccountStep1'))
const CreateAccountStep2Modal = lazy(() => import('./modals/CreateAccountStep2'))
const CreateWalletStep1Modal = lazy(() => import('./modals/CreateWalletStep1'))
const CreateWalletStep2Modal = lazy(() => import('./modals/CreateWalletStep2'))
const CreateWalletStep3Modal = lazy(() => import('./modals/CreateWalletStep3'))
const CreateWalletStep4Modal = lazy(() => import('./modals/CreateWalletStep4'))
const DappConnectionModal = lazy(() => import('./modals/DappConnection'))
const DappConnectionRequestModal = lazy(() => import('./modals/DappConnectionRequest'))
const DappDisconnectionModal = lazy(() => import('./modals/DappDisconnection'))
const DecryptKeyModal = lazy(() => import('./modals/DecryptKey'))
const DeleteContactModal = lazy(() => import('./modals/DeleteContact'))
const DeleteContactAddressModal = lazy(() => import('./modals/DeleteContactAddress'))
const ExportKeyModal = lazy(() => import('./modals/ExportKey'))
const ExportMnemonicModal = lazy(() => import('./modals/ExportMnemonic'))
const ImportAccountsSelectionModal = lazy(() => import('./modals/ImportAccountsSelection'))
const MenuModal = lazy(() => import('./modals/Menu'))
const MigrateFromNeon2Step3Modal = lazy(() => import('./modals/MigrateFromNeon2Step3'))
const MigrateFromNeon2Step4Modal = lazy(() => import('./modals/MigrateFromNeon2Step4'))
const NetworkNodeSelectionModal = lazy(() => import('./modals/NetworkNodeSelection'))
const NetworkSelectionModal = lazy(() => import('./modals/NetworkSelection'))
const SaveContactModal = lazy(() => import('./modals/SaveContact'))
const SuccessModal = lazy(() => import('./modals/Success'))
const SwapAboutExtraIdToReceiveModal = lazy(() => import('./modals/SwapAboutExtraIdToReceive'))
const SwapConfirmationModal = lazy(() => import('./modals/SwapConfirmation'))
const SwapDetailsModal = lazy(() => import('./modals/SwapDetails'))
const SwapInfoModal = lazy(() => import('./modals/SwapInfo'))
const WalletSelectionModal = lazy(() => import('./modals/WalletSelection'))
const AccountReceiveSelectionModal = lazy(() => import('./modals/AccountReceiveSelection'))
const Neo3NeoXBridgeInfoModal = lazy(() => import('./modals/Neo3NeoXBridgeInfo'))
const Neo3NeoXBridgeConfirmationModal = lazy(() => import('./modals/Neo3NeoXBridgeConfirmation'))
const Neo3NeoXBridgeDetailsModal = lazy(() => import('./modals/Neo3NeoXBridgeDetails'))
const BuyAndSellTokensAboutModal = lazy(() => import('./modals/BuyAndSellTokensAbout'))
const SellTokensDepositModal = lazy(() => import('./modals/SellTokensDeposit'))
const SellTokensDepositSuccessModal = lazy(() => import('./modals/SellTokensDepositSuccess'))
const SellTokensDepositErrorModal = lazy(() => import('./modals/SellTokensDepositError'))
const SwapDetailsLogModal = lazy(() => import('./modals/SwapDetailsLog'))
const ReorderWalletsModal = lazy(() => import('./modals/ReorderWallets'))

export const modalsRouter: TRoute[] = [
  { name: 'wallet-selection', type: 'bottom', element: WalletSelectionModal },
  { name: 'account-selection', type: 'bottom', element: AccountSelectionModal },
  { name: 'menu', type: 'side', element: MenuModal },
  { name: 'import-accounts-selection', type: 'bottom', element: ImportAccountsSelectionModal },
  { name: 'blockchain-selection', type: 'bottom', element: BlockchainSelectionModal },
  { name: 'decrypt-key', type: 'bottom', element: DecryptKeyModal },
  { name: 'create-wallet-1', type: 'bottom', element: CreateWalletStep1Modal },
  { name: 'create-wallet-2', type: 'bottom', element: CreateWalletStep2Modal },
  { name: 'create-wallet-3', type: 'bottom', element: CreateWalletStep3Modal },
  { name: 'create-wallet-4', type: 'bottom', element: CreateWalletStep4Modal },
  { name: 'create-account-1', type: 'bottom', element: CreateAccountStep1Modal },
  { name: 'create-account-2', type: 'bottom', element: CreateAccountStep2Modal },
  { name: 'confirm-password', type: 'bottom', element: ConfirmPasswordModal },
  { name: 'export-mnemonic', type: 'bottom', element: ExportMnemonicModal },
  { name: 'export-key', type: 'bottom', element: ExportKeyModal },
  { name: 'migrate-from-neon2-3', type: 'bottom', element: MigrateFromNeon2Step3Modal },
  { name: 'migrate-from-neon2-4', type: 'bottom', element: MigrateFromNeon2Step4Modal },
  { name: 'success', type: 'bottom', element: SuccessModal },
  { name: 'contact-details', type: 'bottom', element: ContactDetailsModal },
  { name: 'dapp-connection', type: 'bottom', element: DappConnectionModal },
  { name: 'dapp-connection-request', type: 'bottom', element: DappConnectionRequestModal },
  { name: 'dapp-disconnection', type: 'bottom', element: DappDisconnectionModal },
  { name: 'save-contact', type: 'bottom', element: SaveContactModal },
  { name: 'contact-address-form', type: 'bottom', element: ContactAddressFormModal },
  { name: 'delete-contact', type: 'bottom', element: DeleteContactModal },
  { name: 'delete-contact-address', type: 'bottom', element: DeleteContactAddressModal },
  { name: 'swap-about-extra-id-to-receive', type: 'bottom', element: SwapAboutExtraIdToReceiveModal },
  { name: 'swap-info', type: 'bottom', element: SwapInfoModal },
  { name: 'swap-details', type: 'bottom', element: SwapDetailsModal },
  { name: 'swap-confirmation', type: 'bottom', element: SwapConfirmationModal },
  { name: 'network-selection', type: 'bottom', element: NetworkSelectionModal },
  { name: 'network-node-selection', type: 'bottom', element: NetworkNodeSelectionModal },
  { name: 'account-receive-selection', type: 'bottom', element: AccountReceiveSelectionModal },
  { name: 'neo3-neox-bridge-info', type: 'bottom', element: Neo3NeoXBridgeInfoModal },
  { name: 'neo3-neox-bridge-confirmation', type: 'bottom', element: Neo3NeoXBridgeConfirmationModal },
  { name: 'neo3-neox-bridge-details', type: 'bottom', element: Neo3NeoXBridgeDetailsModal },
  { name: 'buy-and-sell-tokens-about', type: 'side', element: BuyAndSellTokensAboutModal },
  { name: 'sell-tokens-deposit', type: 'side', element: SellTokensDepositModal },
  { name: 'sell-tokens-deposit-success', type: 'side', element: SellTokensDepositSuccessModal },
  { name: 'sell-tokens-deposit-error', type: 'side', element: SellTokensDepositErrorModal },
  { name: 'swap-details-log', type: 'bottom', element: SwapDetailsLogModal },
  { name: 'reorder-wallets', type: 'bottom', element: ReorderWalletsModal },
]
