import { useMemo } from 'react'

import type { TBSToken, TTokenPricesResponse } from '@cityofzion/blockchain-service'
import type { Query, QueryClient } from '@tanstack/react-query'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import assign from 'lodash/assign'
import uniqBy from 'lodash/uniqBy'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'
import type { TExchange, TMultiExchange, TUseExchangeParams, TUseExchangeResult } from '@shared/types/query'
import type { TCurrency } from '@shared/types/store'

import { useCurrencyRatio } from './useCurrencyRatio'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

function buildQueryKey(blockchain: TBlockchainServiceKey, currency: TCurrency, network: TNetwork, token?: TBSToken) {
  const queryKey = ['exchange', blockchain, currency, network]

  if (token) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    queryKey.push(service.tokenService.normalizeHash(token.hash))
  }

  return queryKey
}

function buildExchangeByBlockchainQueryKey(blockchain: TBlockchainServiceKey, network: TNetwork, currency: TCurrency) {
  return ['exchange-by-blockchain', blockchain, network, currency]
}

export async function fetchExchange(
  blockchain: TBlockchainServiceKey,
  tokens: TBSToken[],
  network: TNetwork,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
) {
  const queryCache = queryClient.getQueryCache()
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const tokensToFetch = tokens.filter(token => {
    const queryKey = buildQueryKey(blockchain, currency, network, token)
    const query = queryCache.find({ queryKey, exact: true, stale: false }) as Query<TExchange> | undefined

    return !query
  })

  let tokenPrices: TTokenPricesResponse[] = []

  if (tokensToFetch.length > 0) {
    try {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
      const newTokenPrices = await service.exchangeDataService.getTokenPrices({ tokens: tokensToFetch })

      tokenPrices = uniqBy(newTokenPrices, 'token.hash')
    } catch {
      /* empty */
    }
  }

  tokensToFetch.forEach(token => {
    const queryKey = buildQueryKey(blockchain, currency, network, token)
    const tokenPrice = tokenPrices.find(price => service.tokenService.predicateByHash(price.token, token))
    const currentQuery = queryCache.find<TExchange>({ queryKey, exact: true })
    const currentUsdPrice = currentQuery?.state?.data?.usdPrice
    let nextUsdPrice = tokenPrice?.usdPrice

    if (typeof currentUsdPrice === 'number' && currentUsdPrice !== 0 && nextUsdPrice === undefined) {
      return
    }

    if (!nextUsdPrice) {
      nextUsdPrice = 0
    }

    const queryData: TExchange = {
      usdPrice: nextUsdPrice,
      token: tokenPrice?.token ?? token,
      convertedPrice: nextUsdPrice * currencyRatio,
    }

    const defaultedOptions = queryClient.defaultQueryOptions({ queryKey })

    queryCache.build(queryClient, defaultedOptions).setData(queryData, { manual: true })
  })

  const allQueries = queryCache.findAll({
    queryKey: buildQueryKey(blockchain, currency, network),
  }) as Query<TExchange>[]

  return {
    [blockchain]: new Map(
      allQueries.map(({ state, queryKey: [_key, _blockchain, _currency, _network, token] }) => [
        token as string,
        state.data,
      ])
    ),
  }
}

const emptyObject = {}

export function useExchange(params: TUseExchangeParams[]): TUseExchangeResult {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const queryClient = useQueryClient()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()

  const tokensToFetchByBlockchain = useMemo(() => {
    if (params.length === 0) return

    return params.reduce(
      (acc, param) => {
        if (acc[param.blockchain]) {
          const noDuplicates = param.tokens.filter(token => !acc[param.blockchain].some(t => t.hash === token.hash))
          acc[param.blockchain].push(...noDuplicates)
        } else {
          acc[param.blockchain] = param.tokens
        }

        return acc
      },
      {} as Record<TBlockchainServiceKey, TBSToken[]>
    )
  }, [params])

  return useQueries({
    queries: Object.entries(tokensToFetchByBlockchain ?? {}).map(([key, tokens]) => {
      const blockchain = key as TBlockchainServiceKey
      const network = selectedNetworkByBlockchain[blockchain]

      return {
        queryKey: buildExchangeByBlockchainQueryKey(blockchain, network, currency),
        queryFn: fetchExchange.bind(null, blockchain, tokens, network, queryClient, currency, currencyRatio ?? 0),
        enabled: !isCurrencyRatioLoading && typeof currencyRatio === 'number',
      }
    }),
    combine: result => ({
      isLoading: isCurrencyRatioLoading || result.some(query => query.isLoading),
      data: assign(emptyObject, ...result.map(query => query.data ?? {})) as TMultiExchange,
    }),
  })
}
