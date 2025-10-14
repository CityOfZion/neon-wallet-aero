import { JSX } from 'react'
import { Account, BlockchainService, TBridgeToken } from '@cityofzion/blockchain-service'
import { SimpleSwapOrchestrator } from '@cityofzion/bs-multichain'
import { TSession, TSessionProposal } from '@cityofzion/wallet-connect-sdk-wallet-core'
import { TBuyAndSellTokensDepositActions } from '@renderer/app/tab/routes/pages/BuyAndSellTokens'
import {
  TUseNeonMigrateFromNeon2Schema,
  TUseNeonMigrateGeneratedData,
  TUseNeonMigrateSchema,
} from '@renderer/hooks/useNeonMigrate'
import { TBlockchainServiceKey } from '@shared/types/blockchain'
import { TTransactionsTransfer } from '@shared/types/hooks'

import {
  IAccountState,
  IWalletState,
  TContactAddress,
  TContactState,
  TImportAccountsSelectionType,
  TSwapRecord,
} from './store'

type TWalletSelectionModalState = {
  selectedWallet?: IWalletState
  onSelect?(wallet: IWalletState): void
}

type TAccountSelectionModalState = {
  wallet: IWalletState
  selectedAccount?: IAccountState
  onSelect?(account: IAccountState): void
}

type TImportAccountsSelectionModalState = {
  value: string
  type: TImportAccountsSelectionType
  onSubmit: (selectedAccounts: Account<TBlockchainServiceKey>[]) => Promise<void>
}

type TBlockchainSelectionModalState = {
  heading: string
  description: string
  onSubmit: (blockchain: TBlockchainServiceKey) => void
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

type TExportKeyModalState = {
  account: IAccountState
}

type TExportMnemonicModalState = {
  wallet: IWalletState
}

type TMigrateFromNeon2Step3ModalState = {
  content: TUseNeonMigrateSchema
  onDecrypt?: (generatedData: TUseNeonMigrateGeneratedData) => void
}

type TMigrateFromNeon2Step4ModalState = {
  selectedAccountsToMigrate: TUseNeonMigrateFromNeon2Schema[]
  content: TUseNeonMigrateSchema
  onDecrypt?: (generatedData: TUseNeonMigrateGeneratedData) => void
}

type TSuccessModalState = {
  heading: string
  subtitle?: string
  content?: JSX.Element
  footer?: JSX.Element
}

type TDappConnectionModalState = {
  account: IAccountState
}

type TDappDisconnectionModalState = {
  sessions: TSession[]
}

type TDappConnectionRequestModalState = {
  proposal: TSessionProposal
  account: IAccountState
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
  swapRecord?: TSwapRecord
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
  fromService: BlockchainService<TBlockchainServiceKey>
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

type TModalRouterPopupRouteTypes = {
  'wallet-selection': TWalletSelectionModalState
  'account-selection': TAccountSelectionModalState
  menu: undefined
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
  'export-key': TExportKeyModalState
  'export-mnemonic': TExportMnemonicModalState
  'migrate-from-neon2-3': TMigrateFromNeon2Step3ModalState
  'migrate-from-neon2-4': TMigrateFromNeon2Step4ModalState
  success: TSuccessModalState
  'dapp-connection': TDappConnectionModalState
  'dapp-connection-request': TDappConnectionRequestModalState
  'dapp-disconnection': TDappDisconnectionModalState
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
}

type TModalRouterTabRouteTypes = {
  'buy-and-sell-tokens-about': undefined
  'sell-tokens-deposit': TSellTokensDepositModalState
  'sell-tokens-deposit-success': TSellTokensDepositSuccessModalState
  'sell-tokens-deposit-error': TSellTokensDepositErrorModalState
}

export type TModalRouterRouteTypes = TModalRouterPopupRouteTypes & TModalRouterTabRouteTypes
