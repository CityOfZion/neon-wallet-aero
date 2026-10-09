import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import type { TAccount } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

type TActionsData = {
  iframeId: string
  isIframeLoading: boolean
  hasIframeError: boolean
}

type TProps = ComponentProps<'div'> & {
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: TAccount
}

export const BuyAndSellTokensBuyContent = ({ tab, onTabChange, account, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.buyContent' })
  const { currency } = useCurrencySelector()

  const {
    actionData: { iframeId, isIframeLoading, hasIframeError },
    setData,
  } = useActions<TActionsData>({
    iframeId: UtilsHelper.uuid(),
    isIframeLoading: true,
    hasIframeError: false,
  })

  const url = BuyAndSellTokensHelper.buildUrl({
    type: 'buy',
    currency,
    refundAddress: account?.address,
    merchantTransactionId: iframeId,
  })

  const handleRestart = () => {
    setData({ iframeId: UtilsHelper.uuid(), isIframeLoading: true, hasIframeError: false })
  }

  const handleLoad = async () => {
    await UtilsHelper.sleep(500)

    setData({ isIframeLoading: false })
  }

  const handleError = () => {
    setData({ hasIframeError: true, isIframeLoading: false })
  }

  return (
    <BuyAndSellWrapperContent
      {...props}
      isLoading={isIframeLoading}
      account={account}
      tab={tab}
      onTabChange={onTabChange}
      onRestart={handleRestart}
    >
      <div className="buy-and-sell-tokens-iframe-container mx-auto my-4">
        {hasIframeError ? (
          <p className="mx-auto text-center text-xl">{t('iframeError')}</p>
        ) : (
          <iframe
            key={iframeId}
            src={url}
            allow="clipboard-read; clipboard-write; payment; camera"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </BuyAndSellWrapperContent>
  )
}
