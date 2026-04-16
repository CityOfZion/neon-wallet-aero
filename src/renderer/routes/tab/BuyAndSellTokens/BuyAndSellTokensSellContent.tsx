import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import MdChevronRight from '@renderer/assets/images/md-chevron-right.svg?react'

import type { TAccount } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensDepositActions, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

type TActionsData = {
  iframeId: string
  isIframeLoading: boolean
  hasIframeError: boolean
}

type TProps = ComponentProps<'div'> & {
  depositActions: TBuyAndSellTokensDepositActions
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: TAccount
}

export const BuyAndSellTokensSellContent = ({ depositActions, tab, onTabChange, account, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.sellContent' })
  const { currency } = useCurrencySelector()
  const { modalNavigateWrapper } = useModalNavigate()

  const {
    actionData: { iframeId, isIframeLoading, hasIframeError },
    setData,
  } = useActions<TActionsData>({
    iframeId: UtilsHelper.uuid(),
    isIframeLoading: true,
    hasIframeError: false,
  })

  const url = BuyAndSellTokensHelper.buildSellUrl({ currency, account })

  const handleRestart = () => {
    depositActions.reset()

    setData({ iframeId: UtilsHelper.uuid(), isIframeLoading: true, hasIframeError: false })
  }

  const handleLoad = async () => {
    await UtilsHelper.sleep(4000)

    setData({ isIframeLoading: false })
  }

  const handleError = () => {
    setData({ hasIframeError: true })
  }

  return (
    <BuyAndSellWrapperContent
      {...props}
      isLoading={isIframeLoading}
      account={account}
      tab={tab}
      onTabChange={onTabChange}
      leftElement={
        <Button
          label={t('depositButtonLabel')}
          variant="text-slim"
          colorSchema={isIframeLoading ? 'gray' : 'neon'}
          disabled={isIframeLoading}
          rightIcon={<MdChevronRight aria-hidden className="min-size-5 max-size-5 size-5" />}
          onClick={modalNavigateWrapper('sell-tokens-deposit', {
            state: { account, depositActions },
          })}
        />
      }
      onRestart={handleRestart}
    >
      <div className="buy-and-sell-tokens-iframe-container mx-auto my-4">
        {hasIframeError ? (
          <p className="mx-auto text-center text-xl">{t('iframeError')}</p>
        ) : (
          <iframe
            src={`${url}&redirectUrl=${url}&confirmRedirectUrl${url}&reloadId=${iframeId}`}
            allow="clipboard-read; clipboard-write; payment"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </BuyAndSellWrapperContent>
  )
}
