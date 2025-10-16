import type { GateFiThemeType } from '@gatefi/js-sdk'
import { GateFiLangEnum } from '@gatefi/js-sdk'

import { EnvHelper } from '@renderer/helpers/EnvHelper'

const merchantId = EnvHelper.VITE_UNLIMIT_MERCHANT_ID
const buyTokensIframeUrl = EnvHelper.VITE_UNLIMIT_BUY_TOKENS_IFRAME_URL
const sellTokensIframeUrl = EnvHelper.VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL

export const BUY_AND_SELL_TOKENS_CONFIG = {
  merchantId,
  buyTokensIframeUrl,
  sellTokensIframeUrl,
  isConfigured: !!merchantId && !!buyTokensIframeUrl && !!sellTokensIframeUrl,
  hideBrand: true,
  lang: GateFiLangEnum.en_US,
  theme: 'dark' as GateFiThemeType,
}
