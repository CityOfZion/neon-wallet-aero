import { waitForAccountTransaction } from '@cityofzion/blockchain-service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@renderer/helpers/ReactQueryHelper'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'
import type { TRootState } from '@shared/types/redux'
import type { TNotification, TSaveNotification } from '@shared/types/store'

import { authReducerActions } from '../reducers/auth'
import { utilityReducerActions } from '../reducers/utility'

type TParams = {
  pendingTransaction: TUseTransactionsTransaction
  successNotification: Pick<TNotification, 'title' | 'previewBody'>
  failureNotification: Pick<TNotification, 'title' | 'previewBody'>
}

export const waitPendingTransaction = createAsyncThunk<void, TParams>(
  'waitPendingTransaction',
  async ({ pendingTransaction, successNotification, failureNotification }, { getState, dispatch }) => {
    const state = getState() as TRootState
    const account = pendingTransaction.account
    const { address, blockchain } = account
    const network = state.settings.data.selectedNetworkByBlockchain[blockchain]

    const notification: TSaveNotification = {
      title: failureNotification.title,
      previewBody: failureNotification.previewBody,
      related: { address, blockchain },
    }

    try {
      dispatch(utilityReducerActions.addPendingTransaction(pendingTransaction))

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

      const isCompleted = await waitForAccountTransaction({
        service,
        txId: pendingTransaction.txId,
        address,
        maxAttempts: 20,
      })

      if (isCompleted) {
        notification.title = successNotification.title
        notification.previewBody = successNotification.previewBody
        notification.action = {
          type: 'navigate',
          payload: { to: 'account-transactions', address, blockchain },
        }
      }
    } catch {
      /* empty */
    }

    ReactQueryHelper.invalidateTransactionQueries(account, network)

    dispatch(authReducerActions.saveNotification(notification))
    dispatch(utilityReducerActions.removePendingTransaction(pendingTransaction.txId))
  }
)
