import { BalanceResponse, Token, TokenPricesResponse } from '@cityofzion/blockchain-service'
import { QueryKey, UseQueryOptions } from '@tanstack/react-query'

import { TBlockchainServiceKey } from './blockchain'

export type TBaseOptions<T = unknown> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, 'queryKey' | 'queryFn'>

export type TExchange = TokenPricesResponse & {
  convertedPrice: number
}

export type TMultiExchange = Record<TBlockchainServiceKey, Map<string, TExchange>>

export type TUseExchangeResult = {
  data?: TMultiExchange
  isLoading: boolean
}

export type TUseCurrencyRatioResult = {
  data?: number
  isLoading: boolean
}

export type TTokenBalance = BalanceResponse & {
  blockchain: TBlockchainServiceKey
  amountNumber: number
  exchangeConvertedPrice: number
  exchangeAmount: number
}

export type TBalance = {
  address: string
  blockchain: TBlockchainServiceKey
  tokensBalances: TTokenBalance[]
  exchangeTotal: number
}

export type TUseBalancesFetchResult = {
  address: string
  blockchain: TBlockchainServiceKey
  tokensBalancesMap: Map<string, TTokenBalance>
}

export type TUseBalancesResult = {
  data: TBalance[]
  isLoading: boolean
  exchangeTotal: number
  isRefetching: boolean
  refetch: () => void
}

export type TUseBalanceResult = {
  data: TBalance | undefined
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
}

export type TUseBalancesParams = {
  address: string
  blockchain: TBlockchainServiceKey
}

export type TUseBalanceOptionShowType = 'hidden' | 'active'

export type TUseBalancesOptions = {
  showType?: TUseBalanceOptionShowType
  queryOptions?: TBaseOptions<TUseBalancesFetchResult>
}

export type TUseExchangeParams = {
  tokens: Token[]
  blockchain: TBlockchainServiceKey
}

export type TUseUnclaimedResult = {
  unclaimed: string
  unclaimedNumber: number
  fee: string
  feeNumber: number
}
