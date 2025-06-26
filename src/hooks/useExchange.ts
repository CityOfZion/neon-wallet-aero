import { useMemo } from 'react'
import { BSTokenHelper, Token, TokenPricesResponse } from '@cityofzion/blockchain-service'
import { Query, QueryClient, useQueries, useQueryClient } from '@tanstack/react-query'
import lodash from 'lodash'

import { bsAggregator } from '@/libs/blockchainService'
import { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import { TExchange, TMultiExchange, TUseExchangeParams, TUseExchangeResult } from '@/types/query'
import { TCurrency } from '@/types/store'

import { useCurrencyRatio } from './useCurrencyRatio'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

function buildQueryKey(
  blockchain: TBlockchainServiceKey,
  currency: TCurrency,
  network?: TNetwork<TBlockchainServiceKey>,
  token?: Token
) {
  const queryKey = ['exchange', blockchain, currency]

  if (network) {
    queryKey.push(network.id)
  }

  if (token) {
    queryKey.push(BSTokenHelper.normalizeHash(token.hash))
  }

  return queryKey
}

function buildExchangeByBlockchainQueryKey(
  blockchain: TBlockchainServiceKey,
  network: TNetwork<TBlockchainServiceKey>,
  currency: TCurrency
) {
  return ['exchange-by-blockchain', blockchain, network.id, currency]
}

export async function fetchExchange(
  blockchain: TBlockchainServiceKey,
  tokens: Token[],
  network: TNetwork<TBlockchainServiceKey>,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
) {
  const queryCache = queryClient.getQueryCache()

  const tokensToFetch = tokens.filter(token => {
    const queryKey = buildQueryKey(blockchain, currency, network, token)
    const query = queryCache.find({ queryKey, exact: true, stale: false }) as Query<TExchange> | undefined

    return !query
  })

  let tokenPrices: TokenPricesResponse[] = []

  if (tokensToFetch.length > 0) {
    try {
      const service = bsAggregator.blockchainServicesByName[blockchain]

      tokenPrices = await service.exchangeDataService.getTokenPrices({ tokens: tokensToFetch })
    } catch {
      /* empty */
    }
  }

  tokensToFetch.forEach(token => {
    const normalizedHash = BSTokenHelper.normalizeHash(token.hash)
    const tokenPrice = tokenPrices.find(price => BSTokenHelper.normalizeHash(price.token.hash) === normalizedHash)

    const queryData: TExchange = {
      usdPrice: tokenPrice?.usdPrice ?? 0,
      token: tokenPrice?.token ?? token,
      convertedPrice: (tokenPrice?.usdPrice ?? 0) * currencyRatio,
    }

    const queryKey = buildQueryKey(blockchain, currency, network, token)
    const defaultedOptions = queryClient.defaultQueryOptions({ queryKey })

    queryCache.build(queryClient, defaultedOptions).setData(queryData, { manual: true })
  })

  const allQueries = queryCache.findAll({
    queryKey: buildQueryKey(blockchain, currency, network),
  }) as Query<TExchange>[]

  return {
    [blockchain]: new Map(
      allQueries.map(({ state, queryKey: [_key, _blockchain, _networkId, _currency, token] }) => [
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
      {} as Record<TBlockchainServiceKey, Token[]>
    )
  }, [params])

  return useQueries({
    queries: Object.entries(tokensToFetchByBlockchain ?? {}).map(([key, tokens]) => {
      const blockchain = key as TBlockchainServiceKey

      return {
        queryKey: buildExchangeByBlockchainQueryKey(blockchain, selectedNetworkByBlockchain[blockchain], currency),
        queryFn: fetchExchange.bind(
          null,
          blockchain,
          tokens,
          selectedNetworkByBlockchain[blockchain],
          queryClient,
          currency,
          currencyRatio ?? 0
        ),
        enabled: !isCurrencyRatioLoading && typeof currencyRatio === 'number',
      }
    }),
    combine: result => ({
      isLoading: isCurrencyRatioLoading || result.some(query => query.isLoading),
      data: lodash.assign(emptyObject, ...result.map(query => query.data ?? {})) as TMultiExchange,
    }),
  })
}
