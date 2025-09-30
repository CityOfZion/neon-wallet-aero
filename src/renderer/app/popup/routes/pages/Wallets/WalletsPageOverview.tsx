import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isClaimable } from '@cityofzion/blockchain-service'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { DappConnectionList } from '@renderer/components/DappConnectionList'
import { IconButton } from '@renderer/components/IconButton'
import { NftList } from '@renderer/components/NftList'
import { Skeleton } from '@renderer/components/Skeleton'
import { Tabs } from '@renderer/components/Tabs'
import { TokenList } from '@renderer/components/TokenList'
import { TransactionActivityList } from '@renderer/components/TransactionActivityList'
import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { useBalance } from '@renderer/hooks/useBalances'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useUnclaimed } from '@renderer/hooks/useUnclaimedQuery'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { IAccountState, IWalletState } from '@shared/types/store'

import { WalletPageClaimButton } from './WalletsPageClaimButton'

import TbCopy from '@renderer/assets/images/tb-copy.svg?react'
import TbRefresh from '@renderer/assets/images/tb-refresh.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'

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
    navigate('/app/send', { state: { account: selectedAccount } })
  }

  useLayoutEffect(() => {
    if (!isWatchAccount || tab !== 'dappConnections') return
    setTab('tokens')
  }, [isWatchAccount, tab])

  return (
    <Fragment key={`${selectedWallet.id}-${selectedAccount.id}`}>
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2.5">
          <BlockchainIcon blockchain={selectedAccount.blockchain} className="text-green" />
          <span className="text-sm text-white uppercase">{commonT(`blockchain.${selectedAccount.blockchain}`)}</span>
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

      <div>
        <p className="text-sm text-gray-300 uppercase">{t('addressLabel')}</p>
        <div className="gap- flex items-center gap-2">
          <p className="text-blue text-sm">{StringHelper.truncateMiddle(selectedAccount.address, 35)}</p>
          <IconButton
            aria-label={t('ariaLabels.copyIconButton')}
            icon={<TbCopy aria-hidden />}
            colorSchema="neon"
            size="sm"
            onClick={() => ClipboardHelper.write(selectedAccount.address)}
          />
        </div>
      </div>

      <div className="mt-3.5">
        <p className="text-sm text-gray-300 uppercase">{t('balanceLabel')}</p>
        <Skeleton.Root
          loading={balanceQuery.isLoading}
          className="relative top-1.5"
          items={<Skeleton.Item className="h-12 w-64" />}
        >
          <p className="text-5xl text-white">
            {NumberHelper.currency(balanceQuery.data?.exchangeTotal ?? 0, currency)}
          </p>
        </Skeleton.Root>
      </div>

      <div className="mt-7 flex flex-col gap-2.5">
        {blockchainService && isClaimable(blockchainService) && !isWatchAccount && (
          <WalletPageClaimButton selectAccount={selectedAccount} blockchainService={blockchainService} />
        )}

        <Button
          label={t('sendButtonLabel')}
          leftIcon={<TbStepOut aria-hidden />}
          iconsOnEdge={false}
          onClick={handleSendNavigation}
          disabled={isWatchAccount}
        />
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
    </Fragment>
  )
}
