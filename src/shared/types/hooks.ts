import {
  TBSToken,
  TFullTransactionAssetEvent as TBSFullTransactionAssetEvent,
  TFullTransactionNftEvent as TBSFullTransactionNftEvent,
  TFullTransactionsByAddressResponse as TBSFullTransactionsByAddressResponse,
  TFullTransactionsItem as TBSFullTransactionsItem,
} from '@cityofzion/blockchain-service'

import { TBlockchainServiceKey } from './blockchain'
import { TModalRouterContextNavigateOptions, TRouteType } from './modal'
import { TModalRouterRouteTypes } from './modal-router-types'
import { IAccountState } from './store'

export type TUseActionsData = Record<string, any>

export type TUseActionsOptions = {
  clearErrorsOnChange?: boolean
}

export type TUseImportActionInputType = 'key' | 'mnemonic' | 'encrypted' | 'address'

export type TUseActionsErrors<T> = Record<keyof T, string | undefined>

export type TUseActionsChanged<T> = Record<keyof T, boolean>

export type TUseActionsActionState<T> = {
  hasChanged: boolean
  isValid: boolean
  isActing: boolean
  errors: TUseActionsErrors<T>
  changed: TUseActionsChanged<T>
  hasActed: boolean
}

type TUseModalNavigateFunction<R = void> = {
  (name: number): R
  <T extends keyof TModalRouterRouteTypes>(
    name: T,
    options?: TModalRouterContextNavigateOptions<TModalRouterRouteTypes[T]>
  ): R
}

export type TUseModalNavigateResponse = {
  modalNavigate: TUseModalNavigateFunction
  modalNavigateWrapper: TUseModalNavigateFunction<() => void>
  modalErase(type: TRouteType): void
  modalEraseWrapper(type: TRouteType): () => void
}

type TFullTransactionCommonEvent = {
  fromAccount?: IAccountState
  toAccount?: IAccountState
}

export type TFullTransactionNftEvent = TFullTransactionCommonEvent & TBSFullTransactionNftEvent

export type TFullTransactionAssetEvent = TFullTransactionCommonEvent & TBSFullTransactionAssetEvent

export type TFullTransactionEvent = TFullTransactionAssetEvent | TFullTransactionNftEvent

export type TFullTransactionsItem = Omit<TBSFullTransactionsItem, 'events'> & {
  account: IAccountState
  blockchain: TBlockchainServiceKey
  isPending: boolean
  events: TFullTransactionEvent[]
}

export type TFullTransactionsByAddressResponse = Omit<TBSFullTransactionsByAddressResponse, 'data'> & {
  data: Map<string, TFullTransactionsItem>
}

export type TFullTransactionsGroupedDataByDate = {
  date: string
  items: TFullTransactionsItem[]
}

export type TTransactionsTransfer = {
  time: number
  hash: string
  account: IAccountState
  fromAccount?: IAccountState
  toAccount?: IAccountState
  methodName?: string
  isPending?: boolean
  isClaim?: boolean
  isMigrate?: boolean
  amount: string
  from?: string
  to?: string
  asset: string
  assetHash: string
  token?: TBSToken
  explorerUrl?: string
}
