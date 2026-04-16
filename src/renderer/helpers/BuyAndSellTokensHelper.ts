import fingerprint from '@fingerprintjs/fingerprintjs'
import { GateFiDisplayModeEnum, GateFiEventTypes, type GateFiLangEnum, GateFiSDK } from '@gatefi/js-sdk'

import type {
  TBuyAndSellTokensHelperGetSellUrlParams,
  TBuyAndSellTokensHelperInitBuyParams,
} from '@shared/types/helpers'
import type { TAvailableCurrency } from '@shared/types/store'

import { EnvHelper } from './EnvHelper'
import { StyleHelper } from './StyleHelper'
import { UtilsHelper } from './UtilsHelper'

export class BuyAndSellTokensHelper {
  static readonly sumsubTermsAndConditionsUrl = 'https://sumsub.com/terms-and-conditions'
  static readonly unlimitUseTermsUrl =
    'https://cdn.unlimit.com/site-crypto/wp-content/uploads/2023/11/24062357/Unl-Crypto_User-TC_.pdf'

  static readonly #supportedCurrencyLabels: TAvailableCurrency[] = ['USD', 'EUR', 'BRL', 'GBP']
  static readonly #defaultCurrencyLabel: TAvailableCurrency = this.#supportedCurrencyLabels[0]
  static readonly #hideBrand: true
  static readonly #lang: GateFiLangEnum.en_US
  static readonly #theme: 'dark'

  static #getValidCurrencyLabel(currencyLabel: TAvailableCurrency): TAvailableCurrency {
    return this.#supportedCurrencyLabels.includes(currencyLabel) ? currencyLabel : this.#defaultCurrencyLabel
  }

  static buildSellUrl({ currency, account }: TBuyAndSellTokensHelperGetSellUrlParams) {
    const params = new URLSearchParams({
      merchantId: EnvHelper.VITE_UNLIMIT_MERCHANT_ID,
      fiatCurrency: this.#getValidCurrencyLabel(currency.label),
      lang: this.#lang,
      themeMode: this.#theme,
      hideBrand: String(this.#hideBrand),
      wallet: account?.address || '',
    })

    return `${EnvHelper.VITE_UNLIMIT_SELL_TOKENS_IFRAME_URL}?${params.toString()}`
  }

  static async initBuy({ currency, account, id }: TBuyAndSellTokensHelperInitBuyParams) {
    const loadedFingerprint = await fingerprint.load()
    const result = await loadedFingerprint.get()

    const [colorNeon, colorAsphalt] = StyleHelper.getTheme('color-neon', 'color-asphalt')

    return await new Promise<() => void>(resolve => {
      const sdk = new GateFiSDK({
        merchantId: EnvHelper.VITE_UNLIMIT_MERCHANT_ID,
        displayMode: GateFiDisplayModeEnum.Embedded,
        nodeSelector: `#${id}`,
        lang: this.#lang,
        defaultFiat: { currency: this.#getValidCurrencyLabel(currency.label) },
        hideThemeSwitcher: true,
        hideBrand: this.#hideBrand,
        fingerprint: result.visitorId,
        walletAddress: account?.address,
        styles: {
          type: this.#theme,
          primaryColor: colorNeon,
          primaryBackground: colorAsphalt,
          primaryTextColor: colorAsphalt,
          secondaryColor: colorNeon,
          secondaryBackground: colorAsphalt,
        },
      })

      sdk.subscribe(GateFiEventTypes.onLoad, async () => {
        await UtilsHelper.sleep(500)

        resolve(() => {
          sdk.destroy()
        })
      })
    })
  }
}
