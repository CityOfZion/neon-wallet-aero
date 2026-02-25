import { useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { type BSNeo3, BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { TransactionHelper } from '@renderer/helpers/TransactionHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBalance } from '@renderer/hooks/useBalances'
import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useExchange } from '@renderer/hooks/useExchange'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'
import {
  buildVoteNeo3GetVoteDetailsByAddressQueryKey,
  useVoteNeo3CalculateVoteFee,
  useVoteNeo3GetVoteDetailsByAddress,
  useVoteNeo3Validations,
} from '@renderer/hooks/useVoteNeo3'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheckbox from '@renderer/assets/images/tb-checkbox.svg?react'

import { thunks } from '@renderer/store/thunks'
import type { TModalState } from '@shared/types/modal'

import { VoteNeo3ConfirmationSkeleton } from './VoteNeo3ConfirmationSkeleton'

export const VoteNeo3ConfirmationModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'voteNeo3Confirmation' })
  const { loginSessionRef } = useLoginSessionSelector()
  const { candidate, neo3Account } = useModalState<TModalState<'vote-neo3-confirmation'>>()
  const calculateVoteFeeQuery = useVoteNeo3CalculateVoteFee({
    neo3Account,
    candidatePubKey: candidate.pubKey,
  })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useVoteNeo3Validations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })
  const { currency } = useCurrencySelector()
  const { modalNavigate } = useModalNavigate()
  const { confirmAction } = useConfirmAction()
  const queryClient = useQueryClient()
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const [isSubmitting, startSubmit] = usePressOnce()
  const dispatch = useAppDispatch()

  const feeBn = BSBigNumberHelper.fromNumber(calculateVoteFeeQuery.data ?? '0')
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3
  const exchangeQuery = useExchange([{ blockchain: 'neo3', tokens: [blockchainService.feeToken] }])

  const isCurrentVote = voteDetailsByAddressQuery.data?.candidatePubKey === candidate.pubKey
  const isWatchAccount = neo3Account?.type === 'watch'
  const neoAmountBn = BSBigNumberHelper.fromNumber(voteDetailsByAddressQuery.data?.neoBalance ?? 0)
  const hasNeoAmount = neoAmountBn.isGreaterThan(0)

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
    feeBn.isLessThanOrEqualTo(0) ||
    voteDetailsByAddressQuery.data?.candidatePubKey === candidate.pubKey

  const feeFiatPrice = useMemo(
    () => {
      let value = BSBigNumberHelper.fromNumber('0')

      if (exchangeQuery.data && feeBn.isGreaterThan(0))
        value = feeBn.multipliedBy(
          ExchangeHelper.getExchangeConvertedPrice(blockchainService.feeToken.hash, 'neo3', exchangeQuery.data)
        )

      return CurrencyHelper.format(value.toFixed(), { currency, maximumFractionDigits: 4 })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exchangeQuery.data, feeBn, currency]
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

      const key = await EncryptionHelper.decrypt(neo3Account.encryptedKey, loginSessionRef.current?.encryptedPassword)
      const account = await AccountHelper.getServiceAccount({ account: neo3Account!, key })

      const txId = await blockchainService.voteService.vote({
        account,
        candidatePubKey: candidate.pubKey,
      })

      const transaction = TransactionHelper.buildPendingTransaction({
        txId,
        fromAccount: neo3Account,
        events: [{ amount: '0', token: blockchainService.burnToken, method: 'vote' }],
      })

      dispatch(
        thunks.waitTransaction({
          transaction,
          successNotification: {
            title: 'modals:voteNeo3Confirmation.notifications.voteSuccessNotification.title',
            previewBody: 'modals:voteNeo3Confirmation.notifications.voteSuccessNotification.previewBody',
          },
          failureNotification: {
            title: 'modals:voteNeo3Confirmation.notifications.voteFailureNotification.title',
            previewBody: 'modals:voteNeo3Confirmation.notifications.voteFailureNotification.previewBody',
          },
        })
      )

      const queryKey = buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address: account.address })

      queryClient.setQueryData(queryKey, {
        ...voteDetailsByAddressQuery.data,
        candidatePubKey: candidate.pubKey,
        candidateName: candidate.name,
      })

      modalNavigate('vote-neo3-success', { state: { candidate, neo3Account }, replace: true })
    } catch (error) {
      console.error(error)
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
          <VoteNeo3ConfirmationSkeleton isLoading={isLoading}>
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
                  {neoAmountBn.toFixed()} {BSNeo3Constants.NEO_TOKEN.symbol}
                </p>
              </li>
            </ul>

            <div className="flex w-full rounded bg-gray-900/50 px-4 py-3 whitespace-nowrap">
              <span className="text-blue flex-grow">{t('feeLabel')}</span>
              <div className="flex flex-col">
                <span className="truncate text-right">
                  {feeBn.toFixed()} {blockchainService.feeToken.symbol}
                </span>
                <span className="text-right text-gray-300">{feeFiatPrice}</span>
              </div>
            </div>

            {!isLoading && !!errorMessage && <AlertErrorBanner className="mt-2 w-full gap-3" message={errorMessage} />}
          </VoteNeo3ConfirmationSkeleton>

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

export default VoteNeo3ConfirmationModal
