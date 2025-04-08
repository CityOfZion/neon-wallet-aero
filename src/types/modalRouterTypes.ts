import { IAccountState, IWalletState } from './store'

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

export type TModalRouterRouteTypes = {
  'wallet-selection': TWalletSelectionModalState
  'account-selection': TAccountSelectionModalState
}
