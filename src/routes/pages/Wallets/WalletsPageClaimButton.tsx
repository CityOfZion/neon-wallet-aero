import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { BlockchainService, BSClaimable } from '@cityofzion/blockchain-service'
import { match, P } from 'ts-pattern'

import { Button } from '@/components/Button'
import { useBalance } from '@/hooks/useBalances'
import { useUnclaimed } from '@/hooks/useUnclaimedQuery'
import { IAccountState } from '@/types/store'

type TProps = {
  selectAccount: IAccountState
  blockchainService: BlockchainService & BSClaimable
}

export const WalletPageClaimButton = ({ selectAccount, blockchainService }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets.claimButton' })
  const balanceQuery = useBalance(selectAccount)
  const unclaimedQuery = useUnclaimed(selectAccount)

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
      label: (
        <Trans
          t={t}
          i18nKey="gasAvailableLabel"
          values={{
            symbol: blockchainService.claimToken.symbol,
            amount: unclaimedQuery.data?.unclaimed,
          }}
        >
          end
          <span className="text-neon">start</span>
        </Trans>
      ),
      disabled: false,
    }))

  return <Button variant="outlined" label={label} disabled={disabled} />
}
