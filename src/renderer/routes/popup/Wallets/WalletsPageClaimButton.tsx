import { useMemo } from 'react'

import type { IBlockchainService, IBSWithClaim } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Skeleton } from '@renderer/components/Skeleton'

import { useBalance } from '@renderer/hooks/useBalances'
import { useUnclaimed, useUnclaimedMutation } from '@renderer/hooks/useUnclaimedQuery'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { IAccountState } from '@shared/types/store'

type TProps = {
  selectAccount: IAccountState
  blockchainService: IBlockchainService<TBlockchainServiceKey> & IBSWithClaim<TBlockchainServiceKey>
}

export const WalletPageClaimButton = ({ selectAccount, blockchainService }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets' })
  const balanceQuery = useBalance(selectAccount)
  const unclaimedQuery = useUnclaimed(selectAccount)
  const unclaimedMutation = useUnclaimedMutation()

  const feeIsLessThanBalance = useMemo(() => {
    if (!balanceQuery.data || !unclaimedQuery.data || unclaimedQuery.data.unclaimedNumber <= 0) return undefined

    const tokenBalance = balanceQuery.data.tokensBalances.find(
      tokenBalance => tokenBalance.token.symbol === blockchainService.feeToken.symbol
    )
    if (!tokenBalance) return false

    return tokenBalance.amountNumber > unclaimedQuery.data.feeNumber
  }, [balanceQuery.data, blockchainService.feeToken.symbol, unclaimedQuery.data])

  const feeIsLessThanUnclaimed = unclaimedQuery.data
    ? unclaimedQuery.data.feeNumber < unclaimedQuery.data.unclaimedNumber
    : undefined

  const isAbleToClaim =
    feeIsLessThanUnclaimed && feeIsLessThanBalance && unclaimedQuery.data && unclaimedQuery.data.unclaimedNumber > 0

  return (
    <div className="mt-1 flex items-center gap-x-1 text-sm">
      <Skeleton.Root
        loading={unclaimedQuery.isLoading}
        items={[<Skeleton.Item key="skeleton-item-claim-token" className="h-5 w-20" />]}
      >
        {unclaimedQuery.data && unclaimedQuery.data.unclaimedNumber > 0 ? unclaimedQuery.data?.unclaimed : 0}{' '}
        {blockchainService.claimToken.symbol}
      </Skeleton.Root>

      <Button
        variant="text-slim"
        label={t('claimButtonButtonLabel')}
        loading={unclaimedMutation.isPending}
        disabled={!isAbleToClaim}
        onClick={() => unclaimedMutation.mutate(selectAccount)}
      />
    </div>
  )
}
