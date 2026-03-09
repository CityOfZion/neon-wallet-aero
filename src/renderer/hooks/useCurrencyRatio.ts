import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TUseCurrencyRatioResult } from '@shared/types/query'
import type { TCurrency } from '@shared/types/store'

import { useCurrencySelector } from './useSettingsSelector'

// There is no need to fetch currency ratio from multiple blockchains
const blockchain: TBlockchainServiceKey = 'neo3'

const fetchCurrencyRatio = async (currency: TCurrency): Promise<number> => {
  let currencyRatio = 1

  try {
    if (currency.label !== 'USD') {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

      currencyRatio = await service.exchangeDataService.getCurrencyRatio(currency.label)
    }
  } catch (error) {
    LoggerHelper.error(error, { where: 'useCurrencyRatio', operation: 'fetchCurrencyRatio' })
  }

  return currencyRatio
}

export function useCurrencyRatio(): TUseCurrencyRatioResult {
  const { currency } = useCurrencySelector()

  return useQuery({
    queryKey: ['currency-ratio', currency],
    queryFn: fetchCurrencyRatio.bind(null, currency),
  })
}
