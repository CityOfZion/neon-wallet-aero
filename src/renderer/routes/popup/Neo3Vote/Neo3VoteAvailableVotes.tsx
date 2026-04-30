import type { BSBigNumber } from '@cityofzion/blockchain-service'
import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@renderer/components/Skeleton'
import { Tooltip } from '@renderer/components/Tooltip'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useNeo3VoteGetVoteDetailsByAddress } from '@renderer/hooks/useNeo3Vote'

import type { TAccount } from '@shared/types/store'

type TProps = {
  neoAmountBn: BSBigNumber
  voteErrorMessage?: string
  hasNeoAmount: boolean
  neo3Account?: TAccount<TBSNeo3Name>
}

export const Neo3VoteAvailableVotes = ({ neoAmountBn, voteErrorMessage, hasNeoAmount, neo3Account }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'neo3Vote.availableVotes' })
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address || '')

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
