import { Fragment, useLayoutEffect, useMemo, useState } from 'react'

import { isClaimable } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { DappConnectionList } from '@renderer/components/DappConnectionList'
import { IconButton } from '@renderer/components/IconButton'
import { NftList } from '@renderer/components/NftList'
import { Skeleton } from '@renderer/components/Skeleton'
import { Tabs } from '@renderer/components/Tabs'
import { TokenList } from '@renderer/components/TokenList'
import { Tooltip } from '@renderer/components/Tooltip'
import { TransactionActivityList } from '@renderer/components/TransactionActivityList'

import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useBalance } from '@renderer/hooks/useBalances'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useUnclaimed } from '@renderer/hooks/useUnclaimedQuery'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbChartBar from '@renderer/assets/images/tb-chart-bar.svg?react'
import TbRefresh from '@renderer/assets/images/tb-refresh.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'
import TbShoppingBag from '@renderer/assets/images/tb-shopping-bag.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'
import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { rendererApi } from '@shared/message-api/renderer'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { WalletPageClaimButton } from './WalletsPageClaimButton'

type TProps = {
  selectedAccount: IAccountState
  selectedWallet: IWalletState
}

type TTab = 'tokens' | 'nfts' | 'transactions' | 'dappConnections'

export const WalletsPageOverview = ({ selectedAccount, selectedWallet }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const { t: commonT } = useTranslation('common')
  const { currency } = useCurrencySelector()
  const balanceQuery = useBalance(selectedAccount)
  const unclaimedQuery = useUnclaimed(selectedAccount)
  const navigate = useNavigate()

  const [tab, setTab] = useState<TTab>('tokens')

  const blockchainService = useMemo(() => {
    if (!selectedAccount) return undefined
    return bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
  }, [selectedAccount])

  const isWatchAccount = selectedAccount.type === 'watch'

  const handleRefetch = () => {
    balanceQuery.refetch()
    unclaimedQuery.refetch()
  }

  const handleSendNavigation = () => {
    navigate('/send', { state: { account: selectedAccount } })
  }

  const handleSwapNavigation = () => {
    navigate('/swap', { state: { account: selectedAccount } })
  }

  const handleBuyAndSellTokensNavigation = async () => {
    await rendererApi.send('tab:open', {
      path: '/buy-and-sell-tokens',
      query: {
        'account-address': selectedAccount.address,
        'account-blockchain': selectedAccount.blockchain,
      },
    })
  }

  useLayoutEffect(() => {
    if (!isWatchAccount || tab !== 'dappConnections') return
    setTab('tokens')
  }, [isWatchAccount, tab])

  return (
    <Fragment key={`${selectedWallet.id}-${selectedAccount.id}`}>
      <div className="mt-4 flex items-center justify-between gap-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <BlockchainIcon blockchain={selectedAccount.blockchain} className="text-green" />
            <span className="text-sm text-white uppercase">{commonT(`blockchain.${selectedAccount.blockchain}`)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title={selectedAccount.address}>
              <p className="text-blue text-sm whitespace-nowrap">
                {StringHelper.truncateMiddle(selectedAccount.address, 30)}
              </p>
            </Tooltip>
            <IconButton
              aria-label={t('ariaLabels.copyIconButton')}
              icon={<MdContentCopy aria-hidden />}
              colorSchema="neon"
              size="sm"
              onClick={() => UtilsHelper.copyToClipboard(selectedAccount.address)}
            />
          </div>
        </div>

        <IconButton
          aria-label={t('ariaLabels.refreshIconButton')}
          icon={<TbRefresh aria-hidden />}
          variant="contained"
          colorSchema="neon"
          size="md"
          onClick={handleRefetch}
          loading={balanceQuery.isRefetching || unclaimedQuery.isRefetching}
        />
      </div>

      <div className="mt-3.5 flex flex-col gap-3">
        <Skeleton.Root
          loading={balanceQuery.isLoading}
          className="relative top-1.5"
          items={<Skeleton.Item className="h-12 w-64" />}
        >
          <p className="text-5xl text-white">
            {NumberHelper.currency(balanceQuery.data?.exchangeTotal ?? 0, { currency })}
          </p>
        </Skeleton.Root>

        {blockchainService && isClaimable(blockchainService) && !isWatchAccount && (
          <WalletPageClaimButton selectAccount={selectedAccount} blockchainService={blockchainService} />
        )}
      </div>

      <div className="mt-5 flex w-full items-center gap-2.5">
        <IconButton
          text={t('sendButtonLabel')}
          variant="boxed"
          colorSchema="neon"
          className="w-full"
          disabled={isWatchAccount}
          icon={<TbStepOut aria-hidden />}
          onClick={handleSendNavigation}
        />

        <IconButton
          text={t('swapButtonLabel')}
          variant="boxed"
          colorSchema="neon"
          className="w-full"
          disabled={isWatchAccount}
          icon={<TbTransform aria-hidden />}
          onClick={handleSwapNavigation}
        />

        {match(selectedAccount.blockchain)
          .with('neo3', () => (
            <Fragment>
              <IconButton
                text={t('bridgeButtonLabel')}
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbReplace2 aria-hidden />}
                onClick={() => navigate('/neo3-neox-bridge')}
              />
              <IconButton
                text={t('votingButtonLabel')}
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                icon={<TbChartBar aria-hidden />}
                onClick={() => navigate('/vote-neo3')}
              />
            </Fragment>
          ))
          .with('neox', () => (
            <Fragment>
              <IconButton
                text={t('buyAndSellTokensButtonLabel')}
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbShoppingBag aria-hidden />}
                onClick={handleBuyAndSellTokensNavigation}
              />
              <IconButton
                text={t('bridgeButtonLabel')}
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbReplace2 aria-hidden />}
                onClick={() => navigate('/neo3-neox-bridge')}
              />
            </Fragment>
          ))
          .otherwise(() => (
            <IconButton
              text={t('buyAndSellTokensButtonLabel')}
              variant="boxed"
              colorSchema="neon"
              className="w-full"
              disabled={isWatchAccount}
              icon={<TbShoppingBag aria-hidden />}
              onClick={handleBuyAndSellTokensNavigation}
            />
          ))}
      </div>

      <Tabs.Root className="mt-7.5" value={tab} onValueChange={newTab => setTab(newTab as TTab)}>
        <Tabs.List>
          <Tabs.Trigger value="tokens">{t('tokenTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="nfts">{t('nftsTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="transactions">{t('transactionsTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="dappConnections" disabled={isWatchAccount}>
            {t('connectionsTab.label')}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tokens">
          <TokenList selectedAccount={selectedAccount} />
        </Tabs.Content>

        <Tabs.Content value="nfts">
          <NftList selectedAccount={selectedAccount} />
        </Tabs.Content>

        <Tabs.Content value="transactions">
          <TransactionActivityList selectedAccount={selectedAccount} />
        </Tabs.Content>

        <Tabs.Content value="dappConnections">
          <DappConnectionList selectedAccount={selectedAccount} />
        </Tabs.Content>
      </Tabs.Root>

      <div className="relative -bottom-0 left-0 -z-1 w-full pb-10" />
      <div className="absolute -bottom-10 left-0 -z-1 w-full pb-20" />
    </Fragment>
  )
}
