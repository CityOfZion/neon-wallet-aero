import { useQuery } from '@tanstack/react-query'

import { bsAggregator } from '@/libs/blockchainService'
import { TBlockchainServiceKey } from '@/types/blockchain'
import { TUseCurrencyRatioResult } from '@/types/query'
import { TCurrency } from '@/types/store'

import { useCurrencySelector } from './useSettingsSelector'

// There is no need to fetch currency ratio from multiple blockchains
const blockchain: TBlockchainServiceKey = 'neo3'

const fetchCurrencyRatio = async (currency: TCurrency): Promise<number> => {
  let currencyRatio = 1

  try {
    if (currency.label !== 'USD') {
      const service = bsAggregator.blockchainServicesByName[blockchain]

      currencyRatio = await service.exchangeDataService.getCurrencyRatio(currency.label)
    }
  } catch (error) {
    console.error(error)
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
