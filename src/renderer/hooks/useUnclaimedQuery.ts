import { isCalculableFee, isClaimable } from '@cityofzion/blockchain-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { getI18next } from '@renderer/libs/i18next'
import { thunks } from '@renderer/store/thunks'
import type { TNetwork } from '@shared/types/blockchain'
import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { TUseUnclaimedResult } from '@shared/types/query'
import type { IAccountState } from '@shared/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useAppDispatch } from './useRedux'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHasClaimPendingTransactionSelector } from './useUtilitySelector'

const { t } = getI18next()

export const buildQueryKeyUnclaimed = (account: IAccountState, network?: TNetwork) => {
  const key: any[] = ['unclaimed', account.address]

  if (network) {
    key.push(network)
  }

  return key
}

const getUnclaimedInfos = async (
  account: IAccountState,
  hasClaimPendingTransaction: boolean,
  encryptedPassword?: string
): Promise<TUseUnclaimedResult> => {
  const blockchainService = bsAggregator.blockchainServicesByName[account.blockchain]

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
    unclaimed = await blockchainService.claimDataService.getUnclaimed(account.address)
  }

  const unclaimedNumber = parseFloat(unclaimed)

  let fee = '0'

  if (isCalculableFee(blockchainService) && unclaimedNumber > 0) {
    const key = await EncryptionHelper.decrypt(account.encryptedKey, encryptedPassword)

    if (!key) {
      throw new AppError(t('hooks:useUnclaimedQuery.errors.noKey', { address: account.address }))
    }

    const serviceAccount = AccountHelper.getServiceAccount({ account, key })

    fee = await blockchainService.calculateTransferFee({
      senderAccount: serviceAccount,
      intents: [
        {
          amount: '0',
          receiverAddress: account.address,
          tokenHash: blockchainService.burnToken.hash,
          tokenDecimals: blockchainService.burnToken.decimals,
        },
      ],
    })
  }

  return { unclaimed, unclaimedNumber, fee, feeNumber: parseFloat(fee) }
}

export const useUnclaimed = (account: IAccountState) => {
  const { hasClaimPendingTransactionRef } = useHasClaimPendingTransactionSelector(account)
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { loginSessionRef } = useLoginSessionSelector()

  return useQuery({
    queryKey: buildQueryKeyUnclaimed(account, selectedNetworkByBlockchain[account.blockchain]),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    queryFn: getUnclaimedInfos.bind(
      null,
      account,
      hasClaimPendingTransactionRef.current,
      loginSessionRef.current?.encryptedPassword
    ),
  })
}

export const useUnclaimedMutation = () => {
  const { loginSessionRef } = useLoginSessionSelector()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { t: unclaimedT } = useTranslation('hooks', { keyPrefix: 'useUnclaimedMutation' })
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (account: IAccountState) => {
      if (!loginSessionRef.current) {
        throw new AppError(unclaimedT('errors.loginSessionIsNotDefined'))
      }

      const blockchainService = bsAggregator.blockchainServicesByName[account.blockchain]
      if (!isClaimable(blockchainService)) {
        throw new AppError(
          t('hooks:useUnclaimedQuery.errors.blockchainIsNotClaimable', {
            address: account.address,
            blockchain: account.blockchain,
          })
        )
      }

      const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSessionRef.current.encryptedPassword)

      const serviceAccount = AccountHelper.getServiceAccount({ account, key })
      const transactionHash = await blockchainService.claim(serviceAccount)
      const token = blockchainService.burnToken

      const transaction: TTransactionsTransfer = {
        hash: transactionHash,
        time: DateHelper.getNowUnix(),
        account: account,
        toAccount: account,
        isPending: true,
        isClaim: true,
        amount: '0',
        to: account.address,
        from: account.address,
        asset: token.symbol,
        assetHash: token.hash,
        token,
        fromAccount: account,
      }

      dispatch(
        thunks.waitTransaction({
          transaction,
          successNotification: {
            title: 'hooks:useUnclaimedMutation.successNotification.title',
            previewBody: 'hooks:useUnclaimedMutation.successNotification.previewBody',
          },
          failureNotification: {
            title: 'hooks:useUnclaimedMutation.failureNotification.title',
            previewBody: 'hooks:useUnclaimedMutation.failureNotification.previewBody',
          },
        })
      )
    },
    onError: error => {
      console.error(error)
      ToastHelper.error({ message: AppError.wrap(error, unclaimedT('errors.claimError')).message })
    },
    onSuccess: (_data, account) => {
      queryClient.setQueryData(buildQueryKeyUnclaimed(account, selectedNetworkByBlockchain[account.blockchain]), {
        unclaimed: '0',
        unclaimedNumber: 0,
        fee: '0',
        feeNumber: 0,
      })
      ToastHelper.success({ message: unclaimedT('messages.claimedSuccess') })
    },
  })
}
