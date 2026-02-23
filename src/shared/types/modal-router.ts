import type { IBlockchainService, TBridgeToken, TBSAccount } from '@cityofzion/blockchain-service'
import type { SimpleSwapOrchestrator, TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, ProposalTypes, SessionTypes } from '@walletconnect/types'
import type { JSX } from 'react'

import type { TBuyAndSellTokensDepositActions } from '@renderer/routes/tab/BuyAndSellTokens'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type {
  TTransactionsTransfer,
  TUseNeonMigrateAccountsSchema,
  TUseNeonMigrateGeneratedData,
  TUseNeonMigrateParsedContent,
} from '@shared/types/hooks'

import type {
  IAccountState,
  IWalletState,
  TAccountType,
  TContactAddress,
  TContactState,
  TImportAccountsSelectionType,
  TSwapRecord,
} from './store'

type TWalletSelectionModalState = {
  selectedWallet?: IWalletState
  hideActions?: boolean
  shouldPersistSelection?: boolean
  onSelect?(wallet: IWalletState): void
}

type TWalletDeletionModalState = {
  wallet: IWalletState
}

type TWalletEditModalState = {
  walletId: IWalletState['id']
}

type TAccountSelectionModalState = {
  walletId: IWalletState['id']
  selectedAccount?: IAccountState
  accountTypes?: TAccountType[]
  hideActions?: boolean
  shouldPersistSelection?: boolean
  onSelect?(account: IAccountState): void
}

type TAccountDeletionModalState = {
  account: IAccountState
  wallet: IWalletState
}

type TAccountEditModalState = {
  account: IAccountState
}

type TAccountSelectionByBlockchainModalState = {
  description?: string
  submitButtonLabel?: string
  blockchain: TBlockchainServiceKey
  selectedWallet: IWalletState
  selectedAccount?: IAccountState
  onSelect(account: IAccountState, wallet: IWalletState): void
}

type TImportAccountsSelectionModalState = {
  value: string
  type: TImportAccountsSelectionType
  onSubmit: (selectedAccounts: TBSAccount<TBlockchainServiceKey>[]) => Promise<void>
}

type TBlockchainSelectionModalState = {
  heading: string
  description: string
  isMulti?: boolean
  onSelect: (blockchains: TBlockchainServiceKey[]) => void
}

type TDecryptKeyModalState = {
  heading: string
  description: string
  encryptedKey: string
  blockchain: TBlockchainServiceKey
  onSubmit: (key: string) => Promise<void>
}

type TCreateWalletStep2ModalState = {
  mnemonic: string[]
}

type TCreateWalletStep3ModalState = {
  mnemonic: string[]
}

type TCreateWalletStep4ModalState = {
  selectedWallet: IWalletState
}

type TCreateAccountStep2ModalState = {
  accountName: string
}

type TConfirmPasswordModalState = {
  heading: string
  description?: string
  inputLabel?: string
  buttonLabel?: string
  inputPlaceholder?: string
  onSubmit: (password: string) => Promise<void>
}

export type TConfirmActionModalState = {
  onSuccess: () => void
  onCancel: () => void
}

type TExportKeyModalState = {
  account: IAccountState
}

type TExportMnemonicModalState = {
  wallet: IWalletState
}

type TMigrateFromNeon2Step3ModalState = {
  content: TUseNeonMigrateParsedContent
  onDecrypt?: (generatedData: TUseNeonMigrateGeneratedData) => void
}

type TMigrateFromNeon2Step4ModalState = {
  selectedAccountsToMigrate: TUseNeonMigrateAccountsSchema[]
  content: TUseNeonMigrateParsedContent
  onDecrypt?: (generatedData: TUseNeonMigrateGeneratedData) => void
}

type TSuccessModalState = {
  heading: string
  subtitle?: string
  content?: JSX.Element
  footer?: JSX.Element
}

type TErrorModalState = {
  heading: string
  subtitle?: string
  content?: JSX.Element
}

type TContactDetailsModalState = {
  contactId: TContactState['id']
}

type TSaveContactModalState = {
  contact?: TContactState
  addresses?: TContactAddress[]
}

type TContactAddressFormModalState = {
  name: string
  initialAddress?: TContactAddress
  onSaveAddress: (address: TContactAddress) => void
}

type TDeleteContactModalState = {
  name: string
  onDelete: () => void
}

type TDeleteContactAddressModalState = {
  name: string
  address: string
  onDelete: () => void
}

type TSwapDetailsModalState = {
  swapRecord: TSwapRecord
}

type TSwapConfirmationModalState = {
  swapRecord: TSwapRecord
  swapOrchestrator: SimpleSwapOrchestrator<TBlockchainServiceKey>
}

type TNetworkSelectionModalState = {
  blockchain: TBlockchainServiceKey
}

type TNetworkNodeSelectionModalState = {
  blockchain: TBlockchainServiceKey
}

type TAccountReceiveSelectionModalState = {
  accountTypes?: 'standard' | 'hardware'
  blockchain?: TBlockchainServiceKey
  selectedAccount?: IAccountState
  selectedAddress?: string
  handleChangeAccount: (account: IAccountState) => void
  handleChangeAddress: (address: string) => void
}

type TNeo3NeoXBridgeConfirmationModalState = {
  tokenToUse?: TBridgeToken<TBlockchainServiceKey>
  tokenToReceive?: TBridgeToken<TBlockchainServiceKey>
  accountToUse?: IAccountState
  amountToUse?: string
  amountToReceive?: string
  addressToReceive?: string
  fromService: IBlockchainService<TBlockchainServiceKey>
  onConfirm(): Promise<void>
}

type TNeo3NeoXBridgeDetailsModalState = {
  tokenToUse: TBridgeToken<TBlockchainServiceKey>
  tokenToReceive: TBridgeToken<TBlockchainServiceKey>
  accountToUse: IAccountState
  amountToUse: string
  amountToReceive: string
  addressToReceive: string
  transactionHash?: string
  confirmed?: boolean
}

type TSellTokensDepositModalState = {
  account?: IAccountState
  depositActions: TBuyAndSellTokensDepositActions
}

type TSellTokensDepositSuccessModalState = {
  transaction: TTransactionsTransfer
}

type TSellTokensDepositErrorModalState = {
  errorMessage?: string
}

type TSwapDetailsLogModalState = {
  swapRecord: TSwapRecord
}

type TVoteNeo3CandidateDetailsModalState = {
  neo3Account: IAccountState
  candidate: TVoteServiceCandidate
  candidateVotePercentage: string
}

type TVoteNeo3ConfirmationModalState = {
  neo3Account: IAccountState
  candidate: TVoteServiceCandidate
}

type TVoteNeo3SuccessModalState = {
  candidate: TVoteServiceCandidate
  neo3Account: IAccountState
}

type TDappConnectionModalState = {
  account: IAccountState
}

type TDappDisconnectionModalState = {
  sessions: SessionTypes.Struct[]
}

type TDappConnectionRequestModalState = {
  proposal: ProposalTypes.Struct
  account: IAccountState
}

type TDappPermissionModalState = {
  session: SessionTypes.Struct
  request: PendingRequestTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails<TBlockchainServiceKey>
  sessionAccount: IAccountState
  onReject: (reason?: ErrorResponse) => Promise<void>
  onAccept: () => Promise<any>
}

type TDappPermissionSignatureScopeModalState = {
  session: SessionTypes.Struct
  scope: string
  allowedList?: string[]
  onReject: () => void
}

type TDappPermissionContractDetailsModalState = {
  session: SessionTypes.Struct
  hash: string
  operation: string
  blockchain: TBlockchainServiceKey
  values: any[]
  onReject: () => void
}

type THideFraudulentTokenModalState = {
  tokenHash: string
  account: IAccountState
}

type TExportTransactionsModalState = {
  selectedAccount: IAccountState
  dateFrom: Date
  dateTo: Date
  readOnly?: boolean
}

export type TModalRouterRouteTypes = {
  menu: undefined
  'wallet-selection': TWalletSelectionModalState
  'wallet-deletion': TWalletDeletionModalState
  'wallet-edit': TWalletEditModalState
  'account-selection': TAccountSelectionModalState
  'account-selection-by-blockchain': TAccountSelectionByBlockchainModalState
  'account-deletion': TAccountDeletionModalState
  'account-edit': TAccountEditModalState
  'import-accounts-selection': TImportAccountsSelectionModalState
  'blockchain-selection': TBlockchainSelectionModalState
  'decrypt-key': TDecryptKeyModalState
  'create-wallet-1': undefined
  'create-wallet-2': TCreateWalletStep2ModalState
  'create-wallet-3': TCreateWalletStep3ModalState
  'create-wallet-4': TCreateWalletStep4ModalState
  'create-account-1': undefined
  'create-account-2': TCreateAccountStep2ModalState
  'confirm-password': TConfirmPasswordModalState
  'confirm-action-side': TConfirmActionModalState
  'confirm-action-bottom': TConfirmActionModalState
  'export-key': TExportKeyModalState
  'export-mnemonic': TExportMnemonicModalState
  'migrate-from-neon2-3': TMigrateFromNeon2Step3ModalState
  'migrate-from-neon2-4': TMigrateFromNeon2Step4ModalState
  success: TSuccessModalState
  error: TErrorModalState
  'contact-details': TContactDetailsModalState
  'save-contact': TSaveContactModalState
  'contact-address-form': TContactAddressFormModalState
  'delete-contact': TDeleteContactModalState
  'delete-contact-address': TDeleteContactAddressModalState
  'swap-about-extra-id-to-receive': undefined
  'swap-info': undefined
  'swap-details': TSwapDetailsModalState
  'swap-confirmation': TSwapConfirmationModalState
  'network-selection': TNetworkSelectionModalState
  'network-node-selection': TNetworkNodeSelectionModalState
  'account-receive-selection': TAccountReceiveSelectionModalState
  'neo3-neox-bridge-info': undefined
  'neo3-neox-bridge-confirmation': TNeo3NeoXBridgeConfirmationModalState
  'neo3-neox-bridge-details': TNeo3NeoXBridgeDetailsModalState
  'swap-details-log': TSwapDetailsLogModalState
  'buy-and-sell-tokens-about': undefined
  'sell-tokens-deposit': TSellTokensDepositModalState
  'sell-tokens-deposit-success': TSellTokensDepositSuccessModalState
  'sell-tokens-deposit-error': TSellTokensDepositErrorModalState
  'reorder-wallets': undefined
  'vote-neo3-candidate-details': TVoteNeo3CandidateDetailsModalState
  'vote-neo3-info': undefined
  'vote-neo3-confirmation': TVoteNeo3ConfirmationModalState
  'vote-neo3-success': TVoteNeo3SuccessModalState
  'dapp-connection': TDappConnectionModalState
  'dapp-connection-request': TDappConnectionRequestModalState
  'dapp-disconnection': TDappDisconnectionModalState
  'dapp-permission': TDappPermissionModalState
  'dapp-permission-signature-scope': TDappPermissionSignatureScopeModalState
  'dapp-permission-contract-details': TDappPermissionContractDetailsModalState
  search: undefined
  'hide-fraudulent-token': THideFraudulentTokenModalState
  'support-ticket': undefined
  'export-transactions': TExportTransactionsModalState
  survey: undefined
}
