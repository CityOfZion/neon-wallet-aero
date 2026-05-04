import { isClaimable } from '@cityofzion/blockchain-service'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { TAccount } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectHasClaimPendingTransaction = (account: TAccount) =>
  createAppSelector([state => state.utility.memoryData.pendingTransactions], pendingTransactions => {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

    return pendingTransactions.some(
      transaction =>
        isClaimable(service) &&
        service.claimService.getTransactionData(transaction) &&
        AccountHelper.predicate(account)({ blockchain: transaction.blockchain, address: transaction.relatedAddress! })
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
  const { value, ref } = useAppSelector(state => state.utility.memoryData.pendingTransactions)

  return {
    pendingTransactions: value,
    pendingTransactionsRef: ref,
  }
}

export const useHasClaimPendingTransactionSelector = (account: TAccount) => {
  const { value, ref } = useAppSelector(selectHasClaimPendingTransaction(account))

  return {
    hasClaimPendingTransaction: value,
    hasClaimPendingTransactionRef: ref,
  }
}

export const useLastIndexesByWallet = () => {
  const { value, ref } = useAppSelector(state => state.utility.data.lastIndexesByWallet)

  return {
    lastIndexesByWallet: value,
    lastIndexesByWalletRef: ref,
  }
}

export const useHiddenTokensByBlockchainSelector = () => {
  const { value, ref } = useAppSelector(state => state.utility.data.hiddenTokensByBlockchain)

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
  const { value, ref } = useAppSelector(state => state.utility.data.encryptedLoginControl)

  return {
    encryptedLoginControl: value,
    encryptedLoginControlRef: ref,
  }
}

export const useHasLoginControlSelector = () => {
  const { value, ref } = useAppSelector(state => !!state.utility.data.encryptedLoginControl)

  return { hasLoginControl: value, hasLoginControlRef: ref }
}
