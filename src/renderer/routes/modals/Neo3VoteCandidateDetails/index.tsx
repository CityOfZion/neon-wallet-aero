import { cloneElement } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'

import { useBalance } from '@renderer/hooks/useBalances'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import {
  useNeo3VoteCalculateVoteFee,
  useNeo3VoteGetVoteDetailsByAddress,
  useNeo3VoteValidations,
} from '@renderer/hooks/useNeo3Vote'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import CozLogo from '@renderer/assets/images/coz-logo.svg?react'
import TbCheckbox from '@renderer/assets/images/tb-checkbox.svg?react'

import type { TModalState } from '@shared/types/modal'

export const Neo3VoteCandidateDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteCandidateDetails' })
  const { neo3Account, candidate, candidateVotePercentage } =
    useModalState<TModalState<'neo3-vote-candidate-details'>>()
  const { modalNavigate } = useModalNavigate()
  const { currency } = useCurrencySelector()

  const { position, logoUrl, hash, description, pubKey, name, votes } = candidate

  const calculateVoteFeeQuery = useNeo3VoteCalculateVoteFee({
    neo3Account,
    candidatePubKey: pubKey,
  })
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useNeo3VoteValidations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })
  const isCandidateCoz = ConstantsHelper.neo3VoteCozPubKey === pubKey

  const neoAmount = BSBigNumberHelper.fromNumber(voteDetailsByAddressQuery.data?.neoBalance || 0)
  const hasNeoAmount = neoAmount.isGreaterThan(0)
  const isLoading = voteDetailsByAddressQuery.isLoading || calculateVoteFeeQuery.isLoading || balanceQuery.isLoading
  const isCurrentVote = voteDetailsByAddressQuery.data?.candidatePubKey === pubKey
  const isWatchAccount = neo3Account?.type === 'watch'

  const isDisabled = isLoading || isCurrentVote || !hasEnoughGasToPayFee || isWatchAccount || !hasNeoAmount

  const errorMessage = match({ neo3Account, hasNeoAmount, isWatchAccount, hasEnoughGasToPayFee })
    .with({ neo3Account: P.when(value => !value) }, () => t('errors.selectNeo3Account'))
    .with({ hasNeoAmount: false }, () => t('errors.notEnoughNeo'))
    .with({ isWatchAccount: true }, () => t('errors.accountCanNotBeWatch'))
    .with({ hasEnoughGasToPayFee: false }, () => (
      <div className="flex flex-col gap-y-0.5">
        <p className="text-white">{t('errors.insufficientGasTitle')}</p>
        <p className="text-gray-200">{t('errors.insufficientGasDescription')}</p>
      </div>
    ))
    .otherwise(() => undefined)

  const handleConfirmVote = () => {
    if (isDisabled) return

    modalNavigate('neo3-vote-confirmation', { state: { neo3Account, candidate }, replace: true })
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex grow flex-col items-center gap-y-5 text-white">
        {(logoUrl || isCandidateCoz) && (
          <div className="flex h-12 w-full max-w-44 items-center justify-center rounded-full bg-gray-800">
            {cloneElement(
              !logoUrl && isCandidateCoz ? (
                <CozLogo aria-label={name} />
              ) : (
                <img src={logoUrl} alt={name} className="pointer-events-none" />
              ),
              {
                className: 'h-full max-h-8 w-fit max-w-32',
              }
            )}
          </div>
        )}

        <ul className="bg-asphalt flex w-full flex-col gap-y-2 rounded p-4 text-xs break-all">
          <li className="flex flex-col">
            <strong className="font-semibold text-gray-100 uppercase">{t('candidateNameLabel')}</strong>
            <p className="mt-0.5">{name}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <strong className="font-semibold text-gray-100 uppercase">{t('positionLabel')}</strong>
            <p className="mt-0.5">{position}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <strong className="font-semibold text-gray-100 uppercase">{t('hashLabel')}</strong>
            <p className="mt-0.5">{hash}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <strong className="font-semibold text-gray-100 uppercase">{t('totalVotesLabel')}</strong>
            <p className="mt-0.5">
              {NumberHelper.localeNumber(votes, currency)} ({candidateVotePercentage})
            </p>
          </li>
        </ul>

        <div className="mt-2 flex w-full flex-col items-center gap-y-5">
          <Button
            variant="card"
            className="w-full max-w-87.5"
            disabled={isDisabled}
            leftIcon={<TbCheckbox aria-hidden />}
            iconsOnEdge={false}
            label={isCurrentVote ? t('voteAlreadyCastButtonLabel') : t('voteButtonLabel')}
            onClick={handleConfirmVote}
          />

          {!isLoading && !isCurrentVote && !!errorMessage && (
            <AlertErrorBanner className="w-full gap-3" message={errorMessage} />
          )}
        </div>

        <Separator containerClassName="mt-2" />

        <div className="flex w-full flex-grow flex-col gap-y-1">
          <p className="font-semibold text-gray-100 uppercase">{t('descriptionLabel')}</p>
          <p className="mt-2 whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default Neo3VoteCandidateDetailsModal
