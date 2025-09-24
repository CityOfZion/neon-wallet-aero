import { BSTokenHelper } from '@cityofzion/blockchain-service'

import { AccountHelper } from '@/helpers/AccountHelper'
import { IAccountState } from '@/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectHasClaimPendingTransaction = (account: IAccountState) =>
  createAppSelector([state => state.utility.inMemoryData.pendingTransactions], pendingTransactions => {
    return pendingTransactions.some(
      transaction => !!transaction.isClaim && AccountHelper.predicate(account)(transaction.account)
    )
  })

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

export const useSwapRecordSelector = (hash: string) => {
  const normalizedHash = BSTokenHelper.normalizeHash(hash)

  const { value: swapRecord, ref: swapRecordRef } = useAppSelector(({ utility }) =>
    utility.data.swapRecords.find(({ txFrom }) => !!txFrom && BSTokenHelper.normalizeHash(txFrom) === normalizedHash)
  )

  return { swapRecord, swapRecordRef }
}

export const useMigrationNeo3Selector = (hash: string) => {
  const { value: migrationNeo3, ref: migrationNeo3Ref } = useAppSelector(
    ({ utility }) => utility.data.migrationsNeo3[BSTokenHelper.normalizeHash(hash)]
  )

  return { migrationNeo3, migrationNeo3Ref }
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
