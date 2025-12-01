import { useMemo } from 'react'

import type { IBlockchainService, IBSWithClaim } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Button } from '@renderer/components/Button'

import { useBalance } from '@renderer/hooks/useBalances'
import { useUnclaimed, useUnclaimedMutation } from '@renderer/hooks/useUnclaimedQuery'

import type { IAccountState } from '@shared/types/store'

type TProps = {
  selectAccount: IAccountState
  blockchainService: IBlockchainService & IBSWithClaim
}

export const WalletPageClaimButton = ({ selectAccount, blockchainService }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets.claimButton' })
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

  const { label, disabled } = match({
    feeIsLessThanBalance,
    feeIsLessThanUnclaimed,
    unclaimedNumber: unclaimedQuery.data?.unclaimedNumber,
  })
    .with({ unclaimedNumber: P.nullish }, { feeIsLessThanUnclaimed: false }, { feeIsLessThanBalance: false }, () => ({
      label: t('gasUnavailableLabel'),
      disabled: true,
    }))
    .otherwise(() => ({
      label: t('gasAvailableLabel'),
      disabled: false,
    }))

  return (
    <div className="flex items-center gap-x-2 text-sm">
      {unclaimedQuery.data?.unclaimed || 0} {blockchainService.claimToken.symbol}
      <Button
        variant="text"
        label={label}
        loading={unclaimedMutation.isPending}
        disabled={disabled}
        clickableProps={{ className: 'h-6 px-1' }}
        onClick={() => unclaimedMutation.mutate(selectAccount)}
      />
    </div>
  )
}
