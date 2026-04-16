import { useTranslation } from 'react-i18next'

import { Skeleton } from '@renderer/components/Skeleton'
import { Tooltip } from '@renderer/components/Tooltip'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useVoteNeo3GetVoteDetailsByAddress } from '@renderer/hooks/useVoteNeo3'

import type { TAccount } from '@shared/types/store'

type TProps = {
  neoAmountBn: BigNumber
  voteErrorMessage?: string
  hasNeoAmount: boolean
  neo3Account?: TAccount
}

export const VoteNeo3AvailableVotes = ({ neoAmountBn, voteErrorMessage, hasNeoAmount, neo3Account }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'voteNeo3.availableVotes' })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address || '')

  return (
    <span className="flex w-full items-center justify-between gap-x-4 pt-6 pr-5 pb-6 text-lg">
      {t('availableVotesLabel')}{' '}
      {voteDetailsByAddressQuery.isLoading ? (
        <Skeleton.Root loading className="h-7 w-24" items={<Skeleton.Item className="h-18 rounded-xs" />} />
      ) : (
        <Tooltip title={voteErrorMessage || ''} delayDuration={0} contentProps={{ className: 'max-w-32 text-center' }}>
          <span
            className={StyleHelper.mergeStyles('text-gray-100', {
              'text-pink': !hasNeoAmount,
            })}
          >
            {hasNeoAmount ? neoAmountBn.toFixed() : t('noAvailableVotesLabel')}
          </span>
        </Tooltip>
      )}
    </span>
  )
}
