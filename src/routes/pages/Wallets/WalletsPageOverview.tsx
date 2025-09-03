import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isClaimable } from '@cityofzion/blockchain-service'

import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Button } from '@/components/Button'
import { DappConnectionsEmptyState } from '@/components/DappConnections/DappConnectionsEmptyState'
import { IconButton } from '@/components/IconButton'
import { NftList } from '@/components/NftsList'
import { Skeleton } from '@/components/Skeleton'
import { Tabs } from '@/components/Tabs'
import { TransactionActivityList } from '@/components/TransactionActivityList'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { useBalance } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { useUnclaimed } from '@/hooks/useUnclaimedQuery'
import { bsAggregator } from '@/libs/blockchainService'
import { IAccountState, IWalletState } from '@/types/store'

import { WalletPageClaimButton } from './WalletsPageClaimButton'
import { WalletsPageTokensTabContent } from './WalletsPageTokensTabContent'

import TbCopy from '@/assets/images/tb-copy.svg?react'
import TbRefresh from '@/assets/images/tb-refresh.svg?react'
import TbStepOut from '@/assets/images/tb-step-out.svg?react'

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

  const handleRefetch = () => {
    balanceQuery.refetch()
    unclaimedQuery.refetch()
  }

  const handleSendNavigation = () => {
    navigate('/app/send', { state: { account: selectedAccount } })
  }

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
        {blockchainService && isClaimable(blockchainService) && selectedAccount.type !== 'watch' && (
          <WalletPageClaimButton selectAccount={selectedAccount} blockchainService={blockchainService} />
        )}
        <Button
          label={t('sendButtonLabel')}
          leftIcon={<TbStepOut aria-hidden />}
          iconsOnEdge={false}
          onClick={handleSendNavigation}
        />
      </div>

      <Tabs.Root className="mt-10" value={tab} onValueChange={newTab => setTab(newTab as TTab)}>
        <Tabs.List>
          <Tabs.Trigger value="tokens">{t('tokenTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="nfts">{t('nftsTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="transactions">{t('transactionsTab.label')}</Tabs.Trigger>
          <Tabs.Trigger value="dappConnections">{t('connectionsTab.label')}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tokens">
          <WalletsPageTokensTabContent selectedAccount={selectedAccount} />
        </Tabs.Content>

        <Tabs.Content value="nfts">
          <NftList selectedAccount={selectedAccount} />
        </Tabs.Content>

        <Tabs.Content value="dappConnections">
          <DappConnectionsEmptyState />
        </Tabs.Content>

        <Tabs.Content value="transactions">
          <TransactionActivityList selectedAccount={selectedAccount} />
        </Tabs.Content>
      </Tabs.Root>
    </Fragment>
  )
}
