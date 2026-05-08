import { useMemo } from 'react'

import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useBalance } from '@renderer/hooks/useBalances'
import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useExchange } from '@renderer/hooks/useExchange'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import {
  buildNeo3VoteGetVoteDetailsByAddressQueryKey,
  useNeo3VoteCalculateVoteFee,
  useNeo3VoteGetVoteDetailsByAddress,
  useNeo3VoteValidations,
} from '@renderer/hooks/useNeo3Vote'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheckbox from '@renderer/assets/images/tb-checkbox.svg?react'

import { thunks } from '@renderer/store/thunks'
import type { TModalState } from '@shared/types/modal'

import { Neo3VoteConfirmationSkeleton } from './Neo3VoteConfirmationSkeleton'

export const Neo3VoteConfirmationModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteConfirmation' })
  const { candidate, neo3Account } = useModalState<TModalState<'neo3-vote-confirmation'>>()
  const calculateVoteFeeQuery = useNeo3VoteCalculateVoteFee({
    neo3Account,
    candidatePubKey: candidate.pubKey,
  })
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useNeo3VoteValidations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })
  const { currency } = useCurrencySelector()
  const { modalNavigate } = useModalNavigate()
  const { confirmAction } = useConfirmAction()
  const queryClient = useQueryClient()
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const [isSubmitting, startSubmit] = usePressOnce()
  const dispatch = useAppDispatch()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3
  const exchangeQuery = useExchange([{ blockchain: 'neo3', tokens: [blockchainService.feeToken] }])

  const fee = calculateVoteFeeQuery.data || '0'
  const isCurrentVote = voteDetailsByAddressQuery.data?.candidatePubKey === candidate.pubKey
  const isWatchAccount = neo3Account?.type === 'watch'
  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance || 0
  const hasNeoAmount = neoAmount > 0

  const isLoading =
    voteDetailsByAddressQuery.isLoading ||
    calculateVoteFeeQuery.isLoading ||
    exchangeQuery.isLoading ||
    balanceQuery.isLoading

  const isDisabled =
    isLoading ||
    isWatchAccount ||
    isSubmitting ||
    !hasEnoughGasToPayFee ||
    !hasNeoAmount ||
    !fee ||
    voteDetailsByAddressQuery.data?.candidatePubKey === candidate.pubKey

  const feeFiatPrice = useMemo(
    () => {
      let value = 0

      if (exchangeQuery.data && fee)
        value =
          NumberHelper.number(fee) *
          ExchangeHelper.getExchangeConvertedPrice(blockchainService.feeToken.hash, 'neo3', exchangeQuery.data)

      return CurrencyHelper.format(value, { currency, maximumFractionDigits: 4 })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exchangeQuery.data, fee, currency]
  )

  const errorMessage = match({ hasNeoAmount, isWatchAccount, hasEnoughGasToPayFee })
    .with({ hasNeoAmount: false }, () => t('errors.notEnoughNeo'))
    .with({ isWatchAccount: true }, () => t('errors.accountCanNotBeWatch'))
    .with({ hasEnoughGasToPayFee: false }, () => (
      <div className="flex flex-col gap-y-0.5">
        <p className="text-white">{t('errors.insufficientGasTitle')}</p>
        <p className="text-gray-200">{t('errors.insufficientGasDescription')}</p>
      </div>
    ))
    .otherwise(() => undefined)

  const handleSubmit = async () => {
    if (isDisabled) return

    try {
      await confirmAction({ account: neo3Account })

      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(neo3Account)

      const pendingTransaction = await blockchainService.voteService.vote({
        account: serviceAccount,
        candidatePubKey: candidate.pubKey,
      })

      const notificationPrefix = 'modals:neo3VoteConfirmation.notifications'
      const notificationSuccessPrefix = `${notificationPrefix}.voteSuccessNotification`
      const notificationFailurePrefix = `${notificationPrefix}.voteFailureNotification`

      dispatch(
        thunks.waitPendingTransaction({
          pendingTransaction,
          successNotification: {
            title: `${notificationSuccessPrefix}.title`,
            previewBody: `${notificationSuccessPrefix}.previewBody`,
          },
          failureNotification: {
            title: `${notificationFailurePrefix}.title`,
            previewBody: `${notificationFailurePrefix}.previewBody`,
          },
        })
      )

      const queryKey = buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network, address: serviceAccount.address })

      queryClient.setQueryData(queryKey, {
        ...voteDetailsByAddressQuery.data,
        candidatePubKey: candidate.pubKey,
        candidateName: candidate.name,
      })

      modalNavigate('neo3-vote-success', { state: { candidate, neo3Account }, replace: true })
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'Neo3VoteConfirmationModal', operation: 'submitVote' })

      ToastHelper.error({ message: AppError.wrap(error, t('errors.castVoteFailed')).message, duration: 6000 })
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2 text-sm">
          <strong className="font-bold">{t('highlightLabel')}</strong>
          <p>{t('detailsLabel')}</p>
        </div>

        <DashedSeparator />

        <p className="-mb-2 text-gray-100 uppercase">{t('votingDetailsLabel')}</p>

        <div className="flex w-full flex-col items-center gap-y-2.5">
          <Neo3VoteConfirmationSkeleton isLoading={isLoading}>
            <ul className="flex w-full flex-col gap-y-2 rounded bg-gray-900/50 p-4 text-xs break-all">
              <li className="flex flex-col">
                <p className="text-blue">{t('accountNameLabel')}</p>
                <p className="mt-0.5">{neo3Account.name}</p>
                <Separator containerClassName="mt-2" />
              </li>
              <li className="flex flex-col">
                <p className="text-blue">{t('addressLabel')}</p>
                <p className="mt-0.5">{neo3Account.address}</p>
                <Separator containerClassName="mt-2" />
              </li>
              <li className="flex flex-col">
                <p className="text-blue">{t('candidateLabel')}</p>
                <p className="mt-0.5">{candidate.name}</p>
                <Separator containerClassName="mt-2" />
              </li>
              <li className="flex flex-col">
                <p className="text-blue">{t('hashLabel')}</p>
                <p className="mt-0.5">{candidate.hash}</p>
                <Separator containerClassName="mt-2" />
              </li>
              <li className="flex flex-col">
                <p className="text-blue">{t('votesLabel')}</p>
                <p className="mt-0.5">
                  {neoAmount} {BSNeo3Constants.NEO_TOKEN.symbol}
                </p>
              </li>
            </ul>

            <div className="flex w-full rounded bg-gray-900/50 px-4 py-3 whitespace-nowrap">
              <span className="text-blue grow">{t('feeLabel')}</span>
              <div className="flex flex-col">
                <span className="truncate text-right">
                  {fee} {blockchainService.feeToken.symbol}
                </span>
                <span className="text-right text-gray-300">{feeFiatPrice}</span>
              </div>
            </div>

            {!isLoading && !!errorMessage && <AlertErrorBanner className="mt-2 w-full gap-3" message={errorMessage} />}
          </Neo3VoteConfirmationSkeleton>

          <Button
            label={isCurrentVote ? t('voteAlreadyCastButtonLabel') : t('confirmationButtonLabel')}
            variant="card"
            className="mt-4 w-full"
            leftIcon={<TbCheckbox aria-hidden />}
            iconsOnEdge={false}
            onClick={startSubmit(handleSubmit)}
            disabled={isDisabled}
            loading={isSubmitting}
          />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default Neo3VoteConfirmationModal
