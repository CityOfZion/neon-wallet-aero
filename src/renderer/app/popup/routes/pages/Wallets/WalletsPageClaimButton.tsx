import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BlockchainService, BSClaimable } from '@cityofzion/blockchain-service'
import { Button } from '@renderer/components/Button'
import { useBalance } from '@renderer/hooks/useBalances'
import { useUnclaimed, useUnclaimedMutation } from '@renderer/hooks/useUnclaimedQuery'
import { IAccountState } from '@shared/types/store'
import { match, P } from 'ts-pattern'

type TProps = {
  selectAccount: IAccountState
  blockchainService: BlockchainService & BSClaimable
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
      label: t('gasAvailableLabel', {
        symbol: blockchainService.claimToken.symbol,
        amount: unclaimedQuery.data?.unclaimed,
      }),
      disabled: false,
    }))

  return (
    <Button
      variant="outlined"
      label={label}
      loading={unclaimedMutation.isPending}
      disabled={disabled}
      clickableProps={{ className: 'whitespace-nowrap gap-x-2' }}
      onClick={() => unclaimedMutation.mutate(selectAccount)}
    />
  )
}
