import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import MdChevronRight from '@renderer/assets/images/md-chevron-right.svg?react'

import type { TAccount } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensDepositActions, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellTokensIframe } from './BuyAndSellTokensIframe'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

type TActionsData = {
  id: string
  isLoading: boolean
  hasError: boolean
}

type TProps = ComponentProps<'div'> & {
  depositActions: TBuyAndSellTokensDepositActions
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: TAccount
}

export const BuyAndSellTokensSellContent = ({ depositActions, tab, onTabChange, account, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.sellContent' })
  const { modalNavigateWrapper } = useModalNavigate()

  const {
    actionData: { id, isLoading, hasError },
    setData,
  } = useActions<TActionsData>({
    id: UtilsHelper.uuid(),
    isLoading: true,
    hasError: false,
  })

  const handleRestart = () => {
    depositActions.reset()

    setData({ id: UtilsHelper.uuid(), isLoading: true, hasError: false })
  }

  const handleLoad = () => {
    setData({ isLoading: false })
  }

  const handleError = () => {
    setData({ hasError: true, isLoading: false })
  }

  return (
    <BuyAndSellWrapperContent
      {...props}
      isLoading={isLoading}
      account={account}
      tab={tab}
      onTabChange={onTabChange}
      leftElement={
        <Button
          label={t('depositButtonLabel')}
          variant="text-slim"
          colorSchema={isLoading ? 'gray' : 'neon'}
          disabled={isLoading}
          rightIcon={<MdChevronRight aria-hidden className="min-size-5 max-size-5 size-5" />}
          onClick={modalNavigateWrapper('sell-tokens-deposit', {
            state: { account, depositActions },
          })}
        />
      }
      onRestart={handleRestart}
    >
      <BuyAndSellTokensIframe
        type="sell"
        id={id}
        hasError={hasError}
        account={account}
        onLoad={handleLoad}
        onError={handleError}
      />
    </BuyAndSellWrapperContent>
  )
}
