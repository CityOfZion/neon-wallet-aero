import type {
  IBlockchainService,
  TBridgeToken,
  TBSAccount,
  TBSBridgeName,
  TBSToken,
} from '@cityofzion/blockchain-service'
import type { SimpleSwapOrchestrator, TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import type { TBSNeo3Name, TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import type { TBSStellarName } from '@cityofzion/bs-stellar'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, ProposalTypes, SessionTypes } from '@walletconnect/types'
import type { JSX } from 'react'

import type { TBuyAndSellTokensDepositActions } from '@renderer/routes/tab/BuyAndSellTokens'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type {
  TUseNeonMigrateAccountsSchema,
  TUseNeonMigrateGeneratedData,
  TUseNeonMigrateParsedContent,
  TUseTransactionsTransaction,
} from '@shared/types/hooks'

import type {
  TAccount,
  TAccountType,
  TContact,
  TContactAddress,
  TImportAccountsSelectionType,
  TSwapRecord,
  TWallet,
} from './store'

type TWalletSelectionModalState = {
  selectedWallet?: TWallet
  hideActions?: boolean
  shouldPersistSelection?: boolean
  onSelect?(wallet: TWallet): void
}

type TWalletDeletionModalState = {
  wallet: TWallet
}

type TWalletEditModalState = {
  walletId: TWallet['id']
}

type TAccountSelectionModalState = {
  walletId: TWallet['id']
  selectedAccount?: TAccount
  accountTypes?: TAccountType[]
  hideActions?: boolean
  shouldPersistSelection?: boolean
  onSelect?(account: TAccount): void
}

type TAccountDeletionModalState = {
  account: TAccount
  wallet: TWallet
}

type TAccountEditModalState = {
  account: TAccount
}

type TAccountSelectionByBlockchainModalState = {
  description?: string
  submitButtonLabel?: string
  blockchain: TBlockchainServiceKey
  selectedWallet: TWallet
  selectedAccount?: TAccount
  onSelect(account: TAccount, wallet: TWallet): void
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
  selectedWallet: TWallet
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
  account: TAccount
}

type TExportMnemonicModalState = {
  wallet: TWallet
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
  onErase?: () => void
}

type TErrorModalState = {
  heading: string
  subtitle?: string
  content?: JSX.Element
}

type TContactDetailsModalState = {
  contactId: TContact['id']
}

type TSaveContactModalState = {
  contact?: TContact
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
  swapOrchestrator: SimpleSwapOrchestrator
}

type TNetworkSelectionModalState = {
  blockchain: TBlockchainServiceKey
}

type TNetworkUrlSelectionModalState = {
  blockchain: TBlockchainServiceKey
}

type TAccountReceiveSelectionModalState<N extends TBlockchainServiceKey = TBlockchainServiceKey> = {
  accountTypes?: 'standard' | 'hardware'
  blockchain?: N
  selectedAccount?: TAccount<N>
  selectedAddress?: string
  handleChangeAccount: (account: TAccount<N>) => void
  handleChangeAddress: (address: string) => void
}

type TNeo3NeoXBridgeConfirmationModalState = {
  tokenToUse?: TBridgeToken<TBSBridgeName>
  tokenToReceive?: TBridgeToken<TBSBridgeName>
  accountToUse?: TAccount<TBSBridgeName>
  amountToUse?: string
  amountToReceive?: string
  addressToReceive?: string
  fromService: IBlockchainService<TBSBridgeName>
  onConfirm(): Promise<void>
}

type TNeo3NeoXBridgeDetailsModalState = {
  tokenToUse: TBridgeToken<TBSBridgeName>
  tokenToReceive: TBridgeToken<TBSBridgeName>
  accountToUse: TAccount<TBSBridgeName>
  amountToUse: string
  amountToReceive: string
  addressToReceive: string
  transactionHash?: string
  confirmed?: boolean
}

type TSellTokensDepositModalState = {
  account?: TAccount
  depositActions: TBuyAndSellTokensDepositActions
}

type TSellTokensDepositSuccessModalState = {
  transaction: TUseTransactionsTransaction
}

type TSellTokensDepositErrorModalState = {
  errorMessage?: string
}

type TSwapDetailsLogModalState = {
  swapRecord: TSwapRecord
}

type TNeo3VoteCandidateDetailsModalState = {
  neo3Account: TAccount<TBSNeo3Name>
  candidate: TVoteServiceCandidate
  candidateVotePercentage: string
}

type TNeo3VoteConfirmationModalState = {
  neo3Account: TAccount<TBSNeo3Name>
  candidate: TVoteServiceCandidate
}

type TNeo3VoteSuccessModalState = {
  candidate: TVoteServiceCandidate
  neo3Account: TAccount<TBSNeo3Name>
}

type TDappConnectionModalState = {
  account: TAccount
}

type TDappDisconnectionModalState = {
  sessions: SessionTypes.Struct[]
}

type TDappConnectionRequestModalState = {
  proposal: ProposalTypes.Struct
  account: TAccount
}

type TDappPermissionModalState = {
  session: SessionTypes.Struct
  request: PendingRequestTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails
  sessionAccount: TAccount
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
  account: TAccount
}

type TExportTransactionsModalState = {
  selectedAccount: TAccount
  dateFrom: Date
  dateTo: Date
  readOnly?: boolean
}

type TStellarPersistTrustlinesModalState = {
  stellarAccount: TAccount<TBSStellarName>
  token?: TBSToken
  limit?: string
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
  'network-url-selection': TNetworkUrlSelectionModalState
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
  'neo3-vote-candidate-details': TNeo3VoteCandidateDetailsModalState
  'neo3-vote-info': undefined
  'neo3-vote-confirmation': TNeo3VoteConfirmationModalState
  'neo3-vote-success': TNeo3VoteSuccessModalState
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
  'stellar-persist-trustline': TStellarPersistTrustlinesModalState
}
