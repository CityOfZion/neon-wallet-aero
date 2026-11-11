import type { ComponentProps } from 'react'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'

import type { TAccount } from '@shared/types/store'

import type { EBuyAndSellTokensTab, TBuyAndSellTokensOnTabChange } from '.'
import { BuyAndSellTokensIframe } from './BuyAndSellTokensIframe'
import { BuyAndSellWrapperContent } from './BuyAndSellWrapperContent'

type TActionsData = {
  id: string
  isLoading: boolean
  hasError: boolean
}

type TProps = ComponentProps<'div'> & {
  tab: EBuyAndSellTokensTab
  onTabChange: TBuyAndSellTokensOnTabChange
  account?: TAccount
}

export const BuyAndSellTokensBuyContent = ({ tab, onTabChange, account, ...props }: TProps) => {
  const {
    actionData: { id, isLoading, hasError },
    setData,
  } = useActions<TActionsData>({
    id: UtilsHelper.uuid(),
    isLoading: true,
    hasError: false,
  })

  const handleRestart = () => {
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
      onRestart={handleRestart}
    >
      <BuyAndSellTokensIframe
        type="buy"
        id={id}
        hasError={hasError}
        account={account}
        onLoad={handleLoad}
        onError={handleError}
      />
    </BuyAndSellWrapperContent>
  )
}
