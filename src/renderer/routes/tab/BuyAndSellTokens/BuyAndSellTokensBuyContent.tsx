import { useRef, useState } from 'react'

import fingerprint from '@fingerprintjs/fingerprintjs'
import { GateFiDisplayModeEnum, GateFiEventTypes, GateFiSDK } from '@gatefi/js-sdk'
import type { ComponentProps } from 'react'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useTheme } from '@renderer/hooks/useTheme'

import { BUY_AND_SELL_TOKENS_CONFIG } from '@shared/constants/buy-and-sell-tokens'
import type { IAccountState } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

const IFRAME_ID = 'buy-tokens-iframe'

type TProps = ComponentProps<'div'> & {
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: IAccountState
}

export const BuyAndSellTokensBuyContent = ({ tab, onTabChange, account, ...props }: TProps) => {
  const { currency } = useCurrencySelector()
  const [colorNeon, colorAsphalt] = useTheme('color-neon', 'color-asphalt')

  const [isIframeLoading, setIsIframeLoading] = useState(true)

  const iframeInstanceRef = useRef<GateFiSDK>(undefined)

  const initIframe = async () => {
    setIsIframeLoading(true)

    if (iframeInstanceRef.current) iframeInstanceRef.current.destroy()

    const loadedFingerprint = await fingerprint.load()
    const result = await loadedFingerprint.get()

    const url = BuyAndSellTokensHelper.buildUrl({
      domainUrl: BUY_AND_SELL_TOKENS_CONFIG.buyTokensIframeUrl ?? '',
      currency,
      account,
    })

    iframeInstanceRef.current = new GateFiSDK({
      merchantId: BUY_AND_SELL_TOKENS_CONFIG.merchantId ?? '',
      displayMode: GateFiDisplayModeEnum.Embedded,
      nodeSelector: `#${IFRAME_ID}`,
      lang: BUY_AND_SELL_TOKENS_CONFIG.lang,
      defaultFiat: { currency: BuyAndSellTokensHelper.getCurrency(currency) },
      hideThemeSwitcher: true,
      hideBrand: BUY_AND_SELL_TOKENS_CONFIG.hideBrand,
      redirectUrl: url,
      confirmRedirectUrl: url,
      successUrl: url,
      cancelUrl: url,
      declineUrl: url,
      inprocessUrl: url,
      fingerprint: result.visitorId,
      walletAddress: account?.address,
      styles: {
        type: BUY_AND_SELL_TOKENS_CONFIG.theme,
        primaryColor: colorNeon,
        primaryBackground: colorAsphalt,
        primaryTextColor: colorAsphalt,
        secondaryColor: colorNeon,
        secondaryBackground: colorAsphalt,
      },
    })

    iframeInstanceRef.current.subscribe(GateFiEventTypes.onLoad, async () => {
      await UtilsHelper.sleep(4000)

      setIsIframeLoading(false)
    })
  }

  const handleRestart = () => {
    initIframe()
  }

  useMountUnsafe(() => {
    initIframe()
  })

  return (
    <BuyAndSellWrapperContent
      {...props}
      isLoading={isIframeLoading}
      account={account}
      tab={tab}
      onTabChange={onTabChange}
      onRestart={handleRestart}
    >
      <div id={IFRAME_ID} className="buy-and-sell-tokens-iframe-container mx-auto my-4" />
    </BuyAndSellWrapperContent>
  )
}
