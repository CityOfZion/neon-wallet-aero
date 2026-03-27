import { Fragment, useLayoutEffect, useMemo } from 'react'

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

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useBalance } from '@renderer/hooks/useBalances'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useUnclaimed } from '@renderer/hooks/useUnclaimedQuery'

import type { TWalletsTab } from '@renderer/routes/popup/Wallets'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbChartBar from '@renderer/assets/images/tb-chart-bar.svg?react'
import TbRefresh from '@renderer/assets/images/tb-refresh.svg?react'
import TbReplace from '@renderer/assets/images/tb-replace.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'
import TbShoppingBag from '@renderer/assets/images/tb-shopping-bag.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'

import { rendererApi } from '@shared/message-api/renderer'
import type { IAccountState, IWalletState } from '@shared/types/store'

import { WalletPageClaimButton } from './WalletsPageClaimButton'

type TActionsData = {
  tab: TWalletsTab
  showHiddenTokens: boolean
}

type TProps = {
  selectedAccount: IAccountState
  selectedWallet: IWalletState
  defaultTab?: TWalletsTab
}

const DEFAULT_TAB: TWalletsTab = 'tokens'

export const WalletsPageOverview = ({ selectedAccount, selectedWallet, defaultTab }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const { t: tCommon } = useTranslation('common')
  const { currency } = useCurrencySelector()
  const unclaimedQuery = useUnclaimed(selectedAccount)
  const navigate = useNavigate()

  const {
    actionData: { tab, showHiddenTokens },
    setData,
    setDataFromEventWrapper,
  } = useActions<TActionsData>({
    tab: defaultTab || DEFAULT_TAB,
    showHiddenTokens: false,
  })

  const balanceQuery = useBalance(selectedAccount, { showType: showHiddenTokens ? 'all' : 'active' })

  const blockchainService = useMemo(() => {
    if (!selectedAccount) return undefined

    return BlockchainServiceHelper.bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
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
      href: '/buy-and-sell-tokens',
      query: {
        'account-address': selectedAccount.address,
        'account-blockchain': selectedAccount.blockchain,
      },
    })
  }

  useLayoutEffect(() => {
    if (isWatchAccount && tab === 'dappConnections') {
      setData({ tab: DEFAULT_TAB })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWatchAccount, tab])

  return (
    <Fragment key={`${selectedWallet.id}-${selectedAccount.id}`}>
      <div className="mt-4 flex items-center justify-between gap-x-2">
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <BlockchainIcon blockchain={selectedAccount.blockchain} className="text-green" />
            <span className="text-sm text-white uppercase">{tCommon(`blockchain.${selectedAccount.blockchain}`)}</span>
          </div>

          <div className="flex items-center gap-x-2">
            <Tooltip title={selectedAccount.address}>
              <p className="text-blue text-sm whitespace-nowrap">
                {StringHelper.truncateMiddle(selectedAccount.address, 30)}
              </p>
            </Tooltip>

            <IconButton
              aria-label={t('ariaLabels.copyIconButton')}
              colorSchema="neon"
              size="sm"
              icon={<MdContentCopy aria-hidden />}
              onClick={ClipboardHelper.write.bind(null, selectedAccount.address)}
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

      <div className="mt-3 flex flex-col gap-2">
        <Skeleton.Root
          loading={balanceQuery.isLoading}
          className="relative top-1.5"
          items={<Skeleton.Item className="h-12 w-64" />}
        >
          <p className="text-5xl text-white">
            {CurrencyHelper.format(balanceQuery.data?.exchangeTotal ?? 0, { currency })}
          </p>
        </Skeleton.Root>

        {blockchainService && isClaimable(blockchainService) && !isWatchAccount && (
          <WalletPageClaimButton selectAccount={selectedAccount} blockchainService={blockchainService} />
        )}
      </div>

      <div className="mt-5 flex w-full items-center gap-x-2.5">
        <IconButton
          variant="boxed"
          colorSchema="neon"
          className="w-full"
          disabled={isWatchAccount}
          icon={<TbStepOut aria-hidden />}
          onClick={handleSendNavigation}
        >
          {t('sendButtonLabel')}
        </IconButton>

        <IconButton
          variant="boxed"
          colorSchema="neon"
          className="w-full"
          disabled={isWatchAccount}
          icon={<TbReplace aria-hidden />}
          onClick={handleSwapNavigation}
        >
          {t('swapButtonLabel')}
        </IconButton>

        {match(selectedAccount.blockchain)
          .with('neo3', () => (
            <Fragment>
              <IconButton
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbReplace2 aria-hidden />}
                onClick={() => navigate('/neo3-neox-bridge')}
              >
                {t('bridgeButtonLabel')}
              </IconButton>

              <IconButton
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                icon={<TbChartBar aria-hidden />}
                onClick={() =>
                  navigate('/vote-neo3', {
                    state: { initialWallet: selectedWallet, initialNeo3Account: selectedAccount },
                  })
                }
              >
                {t('votingButtonLabel')}
              </IconButton>
            </Fragment>
          ))
          .with('neox', () => (
            <Fragment>
              <IconButton
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbShoppingBag aria-hidden />}
                onClick={handleBuyAndSellTokensNavigation}
              >
                {t('buyAndSellTokensButtonLabel')}
              </IconButton>

              <IconButton
                variant="boxed"
                colorSchema="neon"
                className="w-full"
                disabled={isWatchAccount}
                icon={<TbReplace2 aria-hidden />}
                onClick={() => navigate('/neo3-neox-bridge')}
              >
                {t('bridgeButtonLabel')}
              </IconButton>
            </Fragment>
          ))
          .otherwise(() => (
            <IconButton
              variant="boxed"
              colorSchema="neon"
              className="w-full"
              disabled={isWatchAccount}
              icon={<TbShoppingBag aria-hidden />}
              onClick={handleBuyAndSellTokensNavigation}
            >
              {t('buyAndSellTokensButtonLabel')}
            </IconButton>
          ))}
      </div>

      <Tabs.Root className="mt-6" value={tab} onValueChange={newTab => setData({ tab: newTab as TWalletsTab })}>
        <Tabs.List className="mx-auto w-full max-w-[94%] gap-x-2">
          <Tabs.Trigger value="tokens" className="w-full px-3">
            {t('tokenTab.label')}
          </Tabs.Trigger>
          <Tabs.Trigger value="nfts" className="w-full px-3">
            {t('nftsTab.label')}
          </Tabs.Trigger>
          <Tabs.Trigger value="transactions" className="w-full px-3">
            {t('transactionsTab.label')}
          </Tabs.Trigger>
          <Tabs.Trigger value="dappConnections" disabled={isWatchAccount} className="w-full px-3">
            {t('connectionsTab.label')}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tokens">
          <TokenList
            selectedAccount={selectedAccount}
            showHiddenTokens={showHiddenTokens}
            onToggleShowHiddenTokens={setDataFromEventWrapper('showHiddenTokens')}
          />
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
