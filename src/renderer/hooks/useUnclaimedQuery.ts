import { isClaimable } from '@cityofzion/blockchain-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { thunks } from '@renderer/store/thunks'
import { AppError } from '@shared/helpers/ErrorHelper'
import { I18nextHelper } from '@shared/helpers/I18nextHelper'
import type { TNetwork } from '@shared/types/blockchain'
import type { TUseUnclaimedResult } from '@shared/types/query'
import type { TAccount } from '@shared/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useAppDispatch } from './useRedux'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHasClaimPendingTransactionSelector } from './useUtilitySelector'

const { t } = I18nextHelper.get()

export const buildQueryKeyUnclaimed = (account: TAccount, network?: TNetwork) => {
  const key: any[] = ['unclaimed', account.address]

  if (network) {
    key.push(network)
  }

  return key
}

const getUnclaimedInfos = async (
  account: TAccount,
  hasClaimPendingTransaction: boolean
): Promise<TUseUnclaimedResult> => {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

  if (!isClaimable(blockchainService)) {
    throw new AppError(
      t('hooks:useUnclaimedQuery.errors.blockchainIsNotClaimable', {
        address: account.address,
        blockchain: account.blockchain,
      })
    )
  }

  let unclaimed = '0'

  if (!hasClaimPendingTransaction) {
    unclaimed = await blockchainService.claimService.getUnclaimed(account.address)
  }

  const unclaimedNumber = parseFloat(unclaimed)

  let fee = '0'

  if (unclaimedNumber > 0) {
    try {
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(account)
      fee = await blockchainService.claimService.calculateFee(serviceAccount)
    } catch {
      /* empty */
    }
  }

  return { unclaimed, unclaimedNumber, fee, feeNumber: parseFloat(fee) }
}

export const useUnclaimed = (account: TAccount) => {
  const { hasClaimPendingTransactionRef } = useHasClaimPendingTransactionSelector(account)
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildQueryKeyUnclaimed(account, selectedNetworkByBlockchain[account.blockchain]),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    queryFn: getUnclaimedInfos.bind(null, account, hasClaimPendingTransactionRef.current),
  })
}

export const useUnclaimedMutation = () => {
  const { loginSessionRef } = useLoginSessionSelector()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { t: tHook } = useTranslation('hooks', { keyPrefix: 'useUnclaimedMutation' })
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (account: TAccount) => {
      if (!loginSessionRef.current) {
        throw new AppError(tHook('errors.loginSessionIsNotDefined'))
      }

      const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

      if (!isClaimable(blockchainService)) {
        throw new AppError(
          t('hooks:useUnclaimedQuery.errors.blockchainIsNotClaimable', {
            address: account.address,
            blockchain: account.blockchain,
          })
        )
      }

      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(account)
      const pendingTransaction = await blockchainService.claimService.claim(serviceAccount)

      const notificationPrefix = 'hooks:useUnclaimedMutation'
      const notificationSuccessPrefix = `${notificationPrefix}.successNotification`
      const notificationFailurePrefix = `${notificationPrefix}.failureNotification`

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
    },
    onError: error => {
      LoggerHelper.sentry(error, { where: 'useUnclaimedMutation' })
      ToastHelper.error({ message: AppError.wrap(error, tHook('errors.claimError')).message })
    },
    onSuccess: (_data, account) => {
      const queryKey = buildQueryKeyUnclaimed(account, selectedNetworkByBlockchain[account.blockchain])

      queryClient.setQueryData(queryKey, { unclaimed: '0', unclaimedNumber: 0, fee: '0', feeNumber: 0 })

      ToastHelper.success({ message: tHook('messages.claimedSuccess') })
    },
  })
}
