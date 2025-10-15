import { waitForAccountTransaction } from '@cityofzion/blockchain-service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { TRootState } from '@shared/types/redux'
import type { TNotification } from '@shared/types/store'

import { authReducerActions } from '../reducers/auth'
import { utilityReducerActions } from '../reducers/utility'

type TParams = {
  transaction: TTransactionsTransfer
  successNotification?: Pick<TNotification, 'title' | 'previewBody'>
  failureNotification?: Pick<TNotification, 'title' | 'previewBody'>
}

export const waitTransaction = createAsyncThunk<void, TParams>(
  'waitTransaction',
  async ({ transaction, successNotification, failureNotification }, { getState, dispatch }) => {
    const state = getState() as TRootState
    const account = transaction.account
    const { address, blockchain } = account
    const network = state.settings.data.selectedNetworkByBlockchain[blockchain]

    let isSuccessfulTransaction = false

    try {
      dispatch(utilityReducerActions.addPendingTransaction(transaction))

      const service = bsAggregator.blockchainServicesByName[blockchain]

      isSuccessfulTransaction = await waitForAccountTransaction({
        service,
        txId: transaction.hash,
        address,
        maxAttempts: 20,
      })
    } catch (error) {
      console.error(error)
    }

    ReactQueryHelper.invalidateTransactionQueries({ account, network, toAccount: transaction.toAccount })

    dispatch(utilityReducerActions.removePendingTransaction(transaction.hash))

    if (isSuccessfulTransaction && successNotification) {
      dispatch(
        authReducerActions.saveNotification({
          title: successNotification.title,
          previewBody: successNotification.previewBody,
          action: {
            type: 'navigate',
            payload: { to: 'account-transaction', address, blockchain },
          },
        })
      )
    } else if (!isSuccessfulTransaction && failureNotification) {
      dispatch(
        authReducerActions.saveNotification({
          title: failureNotification.title,
          previewBody: failureNotification.previewBody,
          related: { address, blockchain },
        })
      )
    }
  }
)
