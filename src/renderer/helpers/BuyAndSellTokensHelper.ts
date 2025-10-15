import { BUY_AND_SELL_TOKENS_CONFIG } from '@shared/constants/buy-and-sell-tokens'
import type { IAccountState, TCurrency } from '@shared/types/store'

type TBuildUrlParams = {
  domainUrl: string
  currency: TCurrency
  account?: IAccountState
}

export class BuyAndSellTokensHelper {
  static getCurrency(currency: TCurrency) {
    return ['USD', 'EUR', 'BRL', 'GBP'].includes(currency.label) ? currency.label : 'USD'
  }

  static buildUrl({ domainUrl, currency, account }: TBuildUrlParams) {
    return `${domainUrl}?merchantId=${BUY_AND_SELL_TOKENS_CONFIG.merchantId}&fiatCurrency=${BuyAndSellTokensHelper.getCurrency(currency)}&lang=${BUY_AND_SELL_TOKENS_CONFIG.lang}&themeMode=${BUY_AND_SELL_TOKENS_CONFIG.theme}&hideBrand=${BUY_AND_SELL_TOKENS_CONFIG.hideBrand}&wallet=${account?.address ?? ''}`
  }
}
