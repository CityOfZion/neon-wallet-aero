import { Account } from '@cityofzion/blockchain-service'

import { TBlockchainServiceKey } from '@/types/blockchain'

import { IAccountState, IWalletState, TImportAccountsSelectionType } from './store'

type TWalletSelectionModalState = {
  selectedWallet?: IWalletState
  onSelect?(wallet: IWalletState): void
  shouldGoBackOnSelect?: boolean
}

type TAccountSelectionModalState = {
  wallet: IWalletState
  selectedAccount?: IAccountState
  onSelect?(account: IAccountState): void
  shouldGoBackOnSelect?: boolean
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

type TExportPasswordModalState = {
  title: string
  onSubmitPassword: (password: string) => void
}

type TExportMnemonicModalState = {
  wallet: IWalletState
}

type TExportKeyModalState = {
  account: IAccountState
}

export type TModalRouterRouteTypes = {
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
  'confirm-password-export': TExportPasswordModalState
  'export-wallet': TExportMnemonicModalState
  'export-account': TExportKeyModalState
}
