import { useCallback, useMemo } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'
import { match } from 'ts-pattern'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'

import type { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
import type {
  TBalance,
  TTokenBalance,
  TUseBalanceOptionShowType,
  TUseBalanceResult,
  TUseBalancesFetchResult,
  TUseBalancesOptions,
  TUseBalancesParams,
  TUseBalancesResult,
} from '@shared/types/query'
import type { TCurrency, THiddenTokenByBlockchain } from '@shared/types/store'

import { useCurrencyRatio } from './useCurrencyRatio'
import { fetchExchange } from './useExchange'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHiddenTokensByBlockchainSelector } from './useUtilitySelector'

export function buildQueryKeyBalance(
  address: string,
  blockchain: TBlockchainServiceKey,
  network?: TNetwork,
  currency?: TCurrency
) {
  const key: any[] = ['balance', address, blockchain]

  if (network) {
    key.push(network)
  }

  if (currency) {
    key.push(currency)
  }

  return key
}

const fetchBalance = async (
  param: TUseBalancesParams,
  network: TNetwork,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
): Promise<TUseBalancesFetchResult> => {
  try {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[param.blockchain]
    const balance = await service.blockchainDataService.getBalance(param.address)
    const tokens = balance.map(balance => balance.token)
    const exchange = await fetchExchange(param.blockchain, tokens, network, queryClient, currency, currencyRatio)

    const tokensBalancesMap: Map<string, TTokenBalance> = new Map()

    await Promise.allSettled(
      balance.map(async balance => {
        const exchangeConvertedPrice = ExchangeHelper.getExchangeConvertedPrice(
          balance.token.hash,
          param.blockchain,
          exchange
        )

        const amountNumber = NumberHelper.number(balance.amount)
        const exchangeAmount = amountNumber * exchangeConvertedPrice

        tokensBalancesMap.set(service.tokenService.normalizeHash(balance.token.hash), {
          ...balance,
          blockchain: param.blockchain,
          amount: balance.amount,
          amountNumber,
          exchangeAmount,
          exchangeConvertedPrice,
        })
      })
    )

    return {
      address: param.address,
      blockchain: param.blockchain,
      tokensBalancesMap,
    }
  } catch {
    return {
      address: param.address,
      blockchain: param.blockchain,
      tokensBalancesMap: new Map(),
    }
  }
}

const fixBalanceResult = (
  result: TUseBalancesFetchResult,
  showType: TUseBalanceOptionShowType,
  hiddenTokensByBlockchain: THiddenTokenByBlockchain
): TBalance => {
  const tokenBalancesMapClone = cloneDeep(result.tokensBalancesMap)
  const hiddenTokens = hiddenTokensByBlockchain[result.blockchain]
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[result.blockchain]
  let tokensBalances: TTokenBalance[] = []

  match(showType)
    .with('active', () => {
      hiddenTokens?.forEach(tokenHash => {
        tokenBalancesMapClone.delete(service.tokenService.normalizeHash(tokenHash))
      })

      tokensBalances = Array.from(tokenBalancesMapClone.values())
    })
    .with('hidden', () => {
      hiddenTokens?.forEach(tokenHash => {
        const tokenBalance = tokenBalancesMapClone.get(service.tokenService.normalizeHash(tokenHash))

        if (!tokenBalance) return

        tokensBalances.push(tokenBalance)
      })
    })
    .otherwise(() => {
      tokensBalances = Array.from(tokenBalancesMapClone.values())
    })

  return {
    address: result.address,
    blockchain: result.blockchain,
    tokensBalances,
    tokensBalancesMap: tokenBalancesMapClone,
    exchangeTotal: tokensBalances.reduce((acc, tokenBalance) => acc + tokenBalance.exchangeAmount, 0),
  }
}

export function useBalances(params: TUseBalancesParams[], options?: TUseBalancesOptions): TUseBalancesResult {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()
  const { currency } = useCurrencySelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const { showType = 'active', queryOptions } = options ?? {}

  return useQueries({
    queries: params.map(param => ({
      queryKey: buildQueryKeyBalance(
        param.address,
        param.blockchain,
        selectedNetworkByBlockchain[param.blockchain],
        currency
      ),
      queryFn: fetchBalance.bind(
        null,
        param,
        selectedNetworkByBlockchain[param.blockchain],
        queryClient,
        currency,
        currencyRatio ?? 0
      ),
      enabled: !isCurrencyRatioLoading && typeof currencyRatio === 'number',
      ...queryOptions,
    })),
    combine: results => {
      const isLoading = isCurrencyRatioLoading || results.some(result => result.isLoading)

      const isRefetching = results.some(result => result.isRefetching)
      const refetch = () => {
        results.forEach(result => {
          if (result.refetch) {
            result.refetch()
          }
        })
      }

      const data: TBalance[] = []
      let exchangeTotal = 0

      if (!isLoading) {
        results.forEach(result => {
          if (!result.data) return
          data.push(fixBalanceResult(result.data, showType, hiddenTokensByBlockchain))
        })

        exchangeTotal = data.reduce((acc, result) => acc + (result.exchangeTotal ?? 0), 0)
      }

      return {
        data,
        isLoading,
        exchangeTotal,
        isRefetching,
        refetch,
      }
    },
  })
}

export function useBalance(
  balanceParams: TUseBalancesParams | undefined,
  options?: TUseBalancesOptions
): TUseBalanceResult {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const params = balanceParams ?? { address: '', blockchain: 'neo3' }
  const { showType = 'active', queryOptions } = options ?? {}

  const query = useQuery({
    queryKey: buildQueryKeyBalance(
      params.address,
      params.blockchain,
      selectedNetworkByBlockchain[params.blockchain],
      currency
    ),
    queryFn: fetchBalance.bind(
      null,
      params,
      selectedNetworkByBlockchain[params.blockchain],
      queryClient,
      currency,
      currencyRatio ?? 0
    ),
    enabled: !!balanceParams && !isCurrencyRatioLoading && typeof currencyRatio === 'number',
    ...queryOptions,
  })

  const data = useMemo(() => {
    if (!query.data) return undefined
    return fixBalanceResult(query.data, showType, hiddenTokensByBlockchain)
  }, [hiddenTokensByBlockchain, query.data, showType])

  return {
    ...query,
    data,
  }
}

export function useLazyBalance() {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { currency } = useCurrencySelector()
  const currentRatioQuery = useCurrencyRatio()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const getBalance = useCallback(
    async (params: TUseBalancesParams, options?: TUseBalancesOptions) => {
      const { showType = 'active', queryOptions } = options ?? {}

      const network = selectedNetworkByBlockchain[params.blockchain]

      const data = await queryClient.ensureQueryData({
        queryKey: buildQueryKeyBalance(params.address, params.blockchain, network, currency),
        queryFn: fetchBalance.bind(null, params, network, queryClient, currency, currentRatioQuery.data ?? 0),
        ...queryOptions,
      })

      return fixBalanceResult(data, showType, hiddenTokensByBlockchain)
    },
    [currency, currentRatioQuery.data, hiddenTokensByBlockchain, selectedNetworkByBlockchain, queryClient]
  )

  return {
    getBalance,
  }
}
