import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbShoppingBag from '@renderer/assets/images/tb-shopping-bag.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TTokenBalance } from '@shared/types/query'
import type { IAccountState } from '@shared/types/store'

import { BuyAndSellTokensBuyContent } from './BuyAndSellTokensBuyContent'
import { BuyAndSellTokensHowItWorks } from './BuyAndSellTokensHowItWorks'
import { BuyAndSellTokensSellContent } from './BuyAndSellTokensSellContent'

export enum EBuyAndSellTokensTab {
  BUY_TOKENS = 'buy-tokens',
  SELL_TOKENS = 'sell-tokens',
}

export type TBuyAndSellTokensOnTabChange = (newTab: EBuyAndSellTokensTab) => void

type TActionsData = {
  tab: EBuyAndSellTokensTab
  account?: IAccountState
}

export type TBuyAndSellTokensDepositActionsData = {
  isAddressLoading: boolean
  address: string
  isAmountLoading: boolean
  amount: string
  isFeeLoading: boolean
  fee?: string
  token?: TTokenBalance
  account?: IAccountState
}

export type TBuyAndSellTokensDepositActions = ReturnType<typeof useActions<TBuyAndSellTokensDepositActionsData>>

export const BuyAndSellTokensPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens' })
  const [searchParams] = useSearchParams()
  const { accountsRef } = useAccountsSelector()

  const {
    actionData: { tab, account },
    ...actions
  } = useActions<TActionsData>({ tab: EBuyAndSellTokensTab.BUY_TOKENS })

  const depositActions = useActions<TBuyAndSellTokensDepositActionsData>({
    isAddressLoading: false,
    address: '',
    isAmountLoading: false,
    amount: '',
    isFeeLoading: false,
  })

  useMountUnsafe(() => {
    const address = searchParams.get('account-address')
    const blockchain = searchParams.get('account-blockchain') as TBlockchainServiceKey | null

    if (!address || !blockchain) return

    actions.setData({ account: accountsRef.current.find(AccountHelper.predicate({ address, blockchain })) })
  })

  return (
    <ScreenLayout
      heading={t('title')}
      contentClassName="flex-row"
      withBackButton={false}
      icon={<TbShoppingBag aria-hidden />}
    >
      <div className="flex h-auto min-h-fit w-full pb-8">
        <BuyAndSellTokensHowItWorks tab={tab} />

        <Separator className="h-full" containerClassName="w-px bg-gray-300/30" />

        <BuyAndSellTokensBuyContent
          hidden={tab !== EBuyAndSellTokensTab.BUY_TOKENS}
          account={account}
          tab={tab}
          onTabChange={actions.setDataFromEventWrapper('tab')}
        />

        <BuyAndSellTokensSellContent
          hidden={tab !== EBuyAndSellTokensTab.SELL_TOKENS}
          account={account}
          tab={tab}
          onTabChange={actions.setDataFromEventWrapper('tab')}
          depositActions={depositActions}
        />
      </div>
    </ScreenLayout>
  )
}

export default BuyAndSellTokensPage
