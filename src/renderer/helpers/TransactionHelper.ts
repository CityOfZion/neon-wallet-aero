import { hasExplorerService } from '@cityofzion/blockchain-service'

import type { TTransactionHelperBuildPendingTransactionParams } from '@shared/types/helpers'
import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'

export class TransactionHelper {
  static buildPendingTransaction({
    fromAccount,
    txId,
    type,
    events,
  }: TTransactionHelperBuildPendingTransactionParams): TUseTransactionsTransaction {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[fromAccount.blockchain]
    const explorerService = hasExplorerService(service) ? service.explorerService : undefined

    const transaction: TUseTransactionsTransaction = {
      txId,
      txIdUrl: explorerService?.buildTransactionUrl(txId),
      date: new Date().toISOString(),
      account: fromAccount,
      block: 0,
      invocationCount: 0,
      notificationCount: 0,
      networkFeeAmount: undefined,
      systemFeeAmount: undefined,
      isPending: true,
      blockchain: fromAccount.blockchain,
      type: type ?? 'default',
      events: [],
    }

    if (events) {
      transaction.events = events.map(({ amount, toAddress, token, toAccount, method }) => {
        return {
          eventType: 'token',
          methodName: method ?? 'transfer',
          contractHash: token.hash,
          from: fromAccount.address,
          to: toAddress,
          amount,
          token,
          tokenType: 'generic',
          toAccount,
          fromAccount,
          contractHashUrl: explorerService?.buildContractUrl(token.hash),
          fromUrl: explorerService?.buildAddressUrl(fromAccount.address),
          toUrl: toAddress ? explorerService?.buildAddressUrl(toAddress) : undefined,
        }
      })
    }

    return transaction
  }
}
