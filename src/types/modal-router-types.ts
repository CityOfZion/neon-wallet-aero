import { JSX } from 'react'
import { Account } from '@cityofzion/blockchain-service'

import {
  TUseNeonMigrateFromNeon2Schema,
  TUseNeonMigrateGeneratedData,
  TUseNeonMigrateSchema,
} from '@/hooks/useNeonMigrate'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { IAccountState, IWalletState, TContactState, TImportAccountsSelectionType } from './store'

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

type SuccessModalState = {
  heading: string
  subtitle?: string
  content?: JSX.Element
  footer?: JSX.Element
}

type TContactDetailsModalState = {
  contact: TContactState
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
  'confirm-password': TConfirmPasswordModalState
  'export-account': TExportKeyModalState
  'export-wallet': TExportMnemonicModalState
  'migrate-from-neon2-3': TMigrateFromNeon2Step3ModalState
  'migrate-from-neon2-4': TMigrateFromNeon2Step4ModalState
  success: SuccessModalState
  'contact-details': TContactDetailsModalState
}
