import { useRef, useState } from 'react'

import type { ComponentProps } from 'react'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import type { TAccount } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

const IFRAME_CONTAINER_ID = 'buy-tokens-iframe'

type TProps = ComponentProps<'div'> & {
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: TAccount
}

export const BuyAndSellTokensBuyContent = ({ tab, onTabChange, account, ...props }: TProps) => {
  const { currency } = useCurrencySelector()

  const [isIframeLoading, setIsIframeLoading] = useState(true)

  const destroySdkCallbackRef = useRef<() => void>(undefined)

  const initIframe = async () => {
    setIsIframeLoading(true)

    if (destroySdkCallbackRef.current) {
      destroySdkCallbackRef.current()
    }

    destroySdkCallbackRef.current = await BuyAndSellTokensHelper.initBuy({ account, currency, id: IFRAME_CONTAINER_ID })

    setIsIframeLoading(false)
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
      <div id={IFRAME_CONTAINER_ID} className="buy-and-sell-tokens-iframe-container mx-auto my-4" />
    </BuyAndSellWrapperContent>
  )
}
