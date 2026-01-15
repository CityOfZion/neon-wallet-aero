import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { IAccountState } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectHasClaimPendingTransaction = (account: IAccountState) =>
  createAppSelector([state => state.utility.inMemoryData.pendingTransactions], pendingTransactions => {
    return pendingTransactions.some(
      transaction => !!transaction.isClaim && AccountHelper.predicate(account)(transaction.account)
    )
  })

const selectSwapRecordByHash = (hash: string) =>
  createAppSelector([state => state.utility.data.swapRecords], swapRecords =>
    swapRecords.find(({ txFrom, account }) => {
      const service = account
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
        : undefined
      return !!txFrom && !!service && service.tokenService.predicateByHash(hash, txFrom)
    })
  )

export const usePendingTransactionsSelector = () => {
  const { ref, value } = useAppSelector(state => state.utility.inMemoryData.pendingTransactions)

  return {
    pendingTransactions: value,
    pendingTransactionsRef: ref,
  }
}

export const useHasClaimPendingTransactionSelector = (account: IAccountState) => {
  const { ref, value } = useAppSelector(selectHasClaimPendingTransaction(account))

  return {
    hasClaimPendingTransaction: value,
    hasClaimPendingTransactionRef: ref,
  }
}

export const useLastIndexesByWallet = () => {
  const { ref, value } = useAppSelector(state => state.utility.data.lastIndexesByWallet)

  return {
    lastIndexesByWallet: value,
    lastIndexesByWalletRef: ref,
  }
}

export const useHiddenTokensByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => state.utility.data.hiddenTokensByBlockchain)

  return {
    hiddenTokensByBlockchain: value,
    hiddenTokensByBlockchainRef: ref,
  }
}

export const useSwapRecordByHashSelector = (hash: string) => {
  const { value: swapRecord, ref: swapRecordRef } = useAppSelector(selectSwapRecordByHash(hash))
  return { swapRecord, swapRecordRef }
}

export const useLoginControlSelector = () => {
  const { ref, value } = useAppSelector(state => state.utility.data.encryptedLoginControl)

  return {
    encryptedLoginControl: value,
    encryptedLoginControlRef: ref,
  }
}

export const useHasLoginControlSelector = () => {
  const { ref, value } = useAppSelector(state => !!state.utility.data.encryptedLoginControl)

  return { hasLoginControl: value, hasLoginControlRef: ref }
}
