import { useMemo, useRef } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Tooltip } from '@renderer/components/Tooltip'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useNeo3VoteGetCandidatesToVote } from '@renderer/hooks/useNeo3Vote'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

import type { TAccount } from '@shared/types/store'

import { Neo3VoteListItem } from './Neo3VoteListItem'
import { Neo3VoteNotFound } from './Neo3VoteNotFound'
import { Neo3VoteSkeleton } from './Neo3VoteSkeleton'

type TProps = {
  neo3Account?: TAccount<TBSNeo3Name>
  search: string
  voteErrorMessage?: string
  canVote: boolean
}

export const Neo3VoteList = ({ neo3Account, search, voteErrorMessage, canVote }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'neo3Vote.list' })
  const candidatesToVoteQuery = useNeo3VoteGetCandidatesToVote()
  const ref = useRef<HTMLDivElement>(null)

  const candidates = useMemo(
    () =>
      candidatesToVoteQuery.data?.toSorted(({ pubKey }) => (pubKey === ConstantsHelper.neo3VoteCozPubKey ? -1 : 1)) ||
      [],
    [candidatesToVoteQuery.data]
  )

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = StringHelper.normalizeText(search)

    if (normalizedSearch.length !== 0 && candidates.length !== 0)
      return candidates.filter(({ name, pubKey, hash, location }) => {
        if (pubKey === ConstantsHelper.neo3VoteCozPubKey) return true

        return (
          StringHelper.normalizeText(name).includes(normalizedSearch) ||
          StringHelper.normalizeText(pubKey).includes(normalizedSearch) ||
          StringHelper.normalizeText(hash).includes(normalizedSearch) ||
          StringHelper.normalizeText(location).includes(normalizedSearch)
        )
      })

    return candidates
  }, [candidates, search])

  const votesTotalBn = useMemo(
    () =>
      candidates.reduce(
        (accumulator, candidate) => accumulator.plus(candidate.votes),
        BSBigNumberHelper.fromNumber('0')
      ),
    [candidates]
  )

  return (
    <div ref={ref} className="flex h-full min-h-0 w-full grow overflow-y-auto">
      {match({ isLoading: candidatesToVoteQuery.isLoading, candidates: filteredCandidates })
        .with({ isLoading: true }, () => <Neo3VoteSkeleton />)
        .with({ candidates: P.when(value => value.length === 0) }, () => <Neo3VoteNotFound />)
        .otherwise(() => (
          <div className="flex min-h-0 w-full flex-col overflow-y-auto text-sm">
            <div className="mb-2 flex w-full items-center font-medium text-gray-100 uppercase" role="row" aria-hidden>
              <p className="w-20 max-w-20 min-w-20" id="column-position" role="columnheader">
                {t('positionColumnLabel')}
              </p>

              <p className="w-48 max-w-48 min-w-48" id="column-name" role="columnheader">
                {t('nameColumnLabel')}
              </p>

              <p
                className="flex w-20 max-w-20 min-w-20 items-center gap-x-2 pl-5 uppercase"
                id="column-cast-vote"
                role="columnheader"
              >
                {t('castVoteColumnLabel')}

                {!!voteErrorMessage && (
                  <Tooltip title={voteErrorMessage} delayDuration={0} contentProps={{ className: 'max-w-32' }}>
                    <span>
                      <TbAlertTriangle aria-hidden className="text-pink size-5" />
                    </span>
                  </Tooltip>
                )}
              </p>
            </div>

            <ul className="flex min-h-0 w-full flex-col" role="rowgroup">
              {filteredCandidates.map((candidate, index, array) => (
                <Neo3VoteListItem
                  key={candidate.pubKey}
                  index={index}
                  neo3Account={neo3Account}
                  candidate={candidate}
                  votesTotalBn={votesTotalBn}
                  voteErrorMessage={voteErrorMessage}
                  canVote={canVote}
                  candidatesLength={array.length}
                />
              ))}
            </ul>
          </div>
        ))}
    </div>
  )
}
