import { cloneElement, useEffect, useMemo, useRef } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Tooltip } from '@renderer/components/Tooltip'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useVoteNeo3GetVoteDetailsByAddress } from '@renderer/hooks/useVoteNeo3'

import MdCircle from '@renderer/assets/images/md-circle.svg?react'
import TbPackages from '@renderer/assets/images/tb-packages.svg?react'

import { VOTE_NEO3_COZ_PUB_KEY } from '@shared/constants/public-keys'
import type { IAccountState } from '@shared/types/store'

type TProps = {
  index: number
  neo3Account?: IAccountState
  candidate: TVoteServiceCandidate
  votesTotalBn: BigNumber
  voteErrorMessage?: string
  canVote: boolean
  candidatesLength: number
}

export const VoteNeo3ListItem = ({
  index,
  neo3Account,
  candidate,
  votesTotalBn,
  voteErrorMessage,
  canVote,
  candidatesLength,
}: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'voteNeo3.listItem' })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address ?? '')
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const ref = useRef<HTMLLIElement>(null)

  const { position, pubKey, votes } = candidate

  const currentCandidatePubKey = voteDetailsByAddressQuery.data?.candidatePubKey
  const isCozCandidate = VOTE_NEO3_COZ_PUB_KEY === currentCandidatePubKey
  const isCurrentVote = pubKey === currentCandidatePubKey
  const isVoteDisabled = isCurrentVote || !canVote || voteDetailsByAddressQuery.isLoading

  const icon = candidate.type === 'consensus' ? <TbPackages className="size-5" /> : <MdCircle className="size-3" />

  const votePercentage = useMemo(() => {
    const percentage = Math.min(
      100,
      BSBigNumberHelper.fromNumber(votes).multipliedBy('100').div(votesTotalBn).decimalPlaces(2).toNumber()
    )

    return `${percentage >= 0 ? percentage : 0}%`
  }, [votes, votesTotalBn])

  const handleGoToVoteNeo3ConfirmationModal = () => {
    if (isVoteDisabled || !neo3Account) return

    modalNavigate('vote-neo3-confirmation', { state: { neo3Account, candidate } })
  }

  useEffect(() => {
    const element = ref.current

    if (!element || !isCurrentVote || !neo3Account) return

    if (isCozCandidate) element.parentElement?.parentElement?.scroll({ top: 0, behavior: 'smooth' })
    else element.scrollIntoView({ behavior: 'smooth' })
  }, [isCurrentVote, isCozCandidate, neo3Account])

  return (
    <li ref={ref} className="flex w-full flex-col text-sm text-white" role="row">
      <div className="relative flex h-12 max-h-12 min-h-12 w-full items-center">
        <Button
          className="h-full w-full"
          clickableProps={{ className: 'h-full' }}
          role="cell"
          aria-labelledby="column-name"
          variant="text-slim"
          colorSchema="white"
          disabled={!neo3Account}
          onClick={modalNavigateWrapper('vote-neo3-candidate-details', {
            state: { candidate, neo3Account: neo3Account!, candidateVotePercentage: votePercentage },
          })}
        >
          <div className="flex h-full w-full">
            <div
              className="pointer-events-none absolute top-0 bottom-0 left-0 h-full select-none"
              style={{
                width: votePercentage,
              }}
            >
              <div
                className={StyleHelper.mergeStyles('bg-lemon h-full w-full opacity-5', {
                  'bg-neon': position === 1,
                  'bg-green-100': position === 2,
                  'bg-green': position === 3,
                  'bg-blue': position === 4,
                  'bg-magenta-700': position === 5,
                  'bg-purple': position === 6,
                  'bg-magenta': position === 7,
                  'bg-pink': position === 8,
                  'bg-orange': position === 9,
                  'bg-yellow': position === 10,
                })}
              />

              <div
                className={StyleHelper.mergeStyles('border-lemon absolute bottom-0 left-0 h-auto w-full border-b-2', {
                  'border-neon': position === 1,
                  'border-green-100': position === 2,
                  'border-green': position === 3,
                  'border-blue': position === 4,
                  'border-magenta-700': position === 5,
                  'border-purple': position === 6,
                  'border-magenta': position === 7,
                  'border-pink': position === 8,
                  'border-orange': position === 9,
                  'border-yellow': position === 10,
                })}
              />
            </div>
            <p
              className="flex h-full w-20 max-w-20 min-w-20 items-center gap-x-2 truncate border-b-2 border-gray-300/15 pr-2 pl-1 whitespace-nowrap"
              role="cell"
              aria-labelledby="column-position"
            >
              <span className="text-lemon flex w-5 max-w-5 min-w-5 items-center justify-center">
                {cloneElement(icon, {
                  'aria-hidden': true,
                  className: StyleHelper.mergeStyles(icon.props.className, {
                    'text-neon': position === 1,
                    'text-green-100': position === 2,
                    'text-green': position === 3,
                    'text-blue': position === 4,
                    'text-magenta-700': position === 5,
                    'text-purple': position === 6,
                    'text-magenta': position === 7,
                    'text-pink': position === 8,
                    'text-orange': position === 9,
                    'text-yellow': position === 10,
                    'text-lemon': position > 10,
                  }),
                })}
              </span>
              {position}.
            </p>
            <span className="flex h-full w-48 max-w-48 min-w-48 items-center border-b-2 border-gray-300/15 pr-2">
              {candidate.name}
            </span>
          </div>
        </Button>

        <div
          className="flex h-full w-20 max-w-20 min-w-20 items-center justify-end pl-2"
          role="cell"
          aria-labelledby="column-cast-vote"
        >
          <Tooltip
            title={isCurrentVote || !voteErrorMessage ? '' : voteErrorMessage}
            delayDuration={0}
            contentProps={{ className: 'max-w-32' }}
          >
            <Button
              label={isCurrentVote ? t('yourVoteButtonLabel') : t('castVoteButtonLabel')}
              variant="text-slim"
              colorSchema={isCurrentVote || canVote ? 'neon' : 'error'}
              textClassName="text-sm text-right"
              className="w-full"
              flat
              disabled={isVoteDisabled}
              clickableProps={{ className: 'w-full' }}
              onClick={handleGoToVoteNeo3ConfirmationModal}
            />
          </Tooltip>
        </div>
      </div>

      {index === 0 && candidatesLength > 1 && <DashedSeparator className="my-4" />}
    </li>
  )
}
