import { lazy } from 'react'

import type { TRoute } from '@shared/types/modal'

const AccountSelectionModal = lazy(() => import('./modals/AccountSelection'))
const AccountDeletionModal = lazy(() => import('./modals/AccountDeletion'))
const AccountEditModal = lazy(() => import('./modals/AccountEdit'))
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
const DappPermissionModal = lazy(() => import('./modals/DappPermission'))
const DappPermissionContractDetailsModal = lazy(() => import('./modals/DappPermissionContractDetails'))
const DappPermissionSignatureScopeModal = lazy(() => import('./modals/DappPermissionSignatureScope'))

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
const SearchModal = lazy(() => import('./modals/Search'))
const SuccessModal = lazy(() => import('./modals/Success'))
const ErrorModal = lazy(() => import('./modals/Error'))
const SwapAboutExtraIdToReceiveModal = lazy(() => import('./modals/SwapAboutExtraIdToReceive'))
const SwapConfirmationModal = lazy(() => import('./modals/SwapConfirmation'))
const SwapDetailsModal = lazy(() => import('./modals/SwapDetails'))
const SwapInfoModal = lazy(() => import('./modals/SwapInfo'))
const WalletSelectionModal = lazy(() => import('./modals/WalletSelection'))
const WalletDeletionModal = lazy(() => import('./modals/WalletDeletion'))
const WalletEditModal = lazy(() => import('./modals/WalletEdit'))
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
const VoteNeo3CandidateDetailsModal = lazy(() => import('./modals/VoteNeo3CandidateDetails'))
const VoteNeo3ConfirmationModal = lazy(() => import('./modals/VoteNeo3Confirmation'))
const VoteNeo3SuccessModal = lazy(() => import('./modals/VoteNeo3Success'))
const VoteNeo3InfoModal = lazy(() => import('./modals/VoteNeo3Info'))
const AccountSelectionByBlockchainModal = lazy(() => import('./modals/AccountSelectionByBlockchain'))
const ConfirmActionBottomModal = lazy(() => import('./modals/ConfirmAction/ConfirmActionBottom'))
const ConfirmActionSideModal = lazy(() => import('./modals/ConfirmAction/ConfirmActionSide'))
const ConnectHardwareWalletModal = lazy(() => import('./modals/ConnectHardwareWallet'))

export const modalsRouter: TRoute[] = [
  { name: 'wallet-selection', type: 'bottom', element: WalletSelectionModal },
  { name: 'wallet-deletion', type: 'bottom', element: WalletDeletionModal },
  { name: 'wallet-edit', type: 'bottom', element: WalletEditModal },
  { name: 'account-selection', type: 'bottom', element: AccountSelectionModal },
  { name: 'account-deletion', type: 'bottom', element: AccountDeletionModal },
  { name: 'account-edit', type: 'bottom', element: AccountEditModal },
  { name: 'account-selection-by-blockchain', type: 'bottom', element: AccountSelectionByBlockchainModal },
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
  { name: 'confirm-action-bottom', type: 'bottom', element: ConfirmActionBottomModal },
  { name: 'confirm-action-side', type: 'side', element: ConfirmActionSideModal },
  { name: 'export-mnemonic', type: 'bottom', element: ExportMnemonicModal },
  { name: 'export-key', type: 'bottom', element: ExportKeyModal },
  { name: 'migrate-from-neon2-3', type: 'bottom', element: MigrateFromNeon2Step3Modal },
  { name: 'migrate-from-neon2-4', type: 'bottom', element: MigrateFromNeon2Step4Modal },
  { name: 'success', type: 'bottom', element: SuccessModal },
  { name: 'error', type: 'bottom', element: ErrorModal },
  { name: 'contact-details', type: 'bottom', element: ContactDetailsModal },
  { name: 'dapp-connection', type: 'bottom', element: DappConnectionModal },
  { name: 'dapp-connection-request', type: 'bottom', element: DappConnectionRequestModal },
  { name: 'dapp-disconnection', type: 'bottom', element: DappDisconnectionModal },
  { name: 'dapp-permission', type: 'bottom', element: DappPermissionModal },
  { name: 'dapp-permission-contract-details', type: 'bottom', element: DappPermissionContractDetailsModal },
  { name: 'dapp-permission-signature-scope', type: 'bottom', element: DappPermissionSignatureScopeModal },
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
  { name: 'vote-neo3-candidate-details', type: 'bottom', element: VoteNeo3CandidateDetailsModal },
  { name: 'vote-neo3-info', type: 'bottom', element: VoteNeo3InfoModal },
  { name: 'vote-neo3-confirmation', type: 'bottom', element: VoteNeo3ConfirmationModal },
  { name: 'vote-neo3-success', type: 'bottom', element: VoteNeo3SuccessModal },
  { name: 'search', type: 'bottom', element: SearchModal },
  { name: 'connect-hardware-wallet', type: 'bottom', element: ConnectHardwareWalletModal },
]
