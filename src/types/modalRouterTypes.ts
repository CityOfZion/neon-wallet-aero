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

export type TModalRouterRouteTypes = {
  'wallet-selection': TWalletSelectionModalState
  'account-selection': TAccountSelectionModalState
  menu: undefined
  'import-accounts-selection': TImportAccountsSelectionModalState
  'blockchain-selection': TBlockchainSelectionModalState
  'decrypt-key': TDecryptKeyModalState
}
