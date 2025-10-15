import { buildQueryKeyBalance } from '@renderer/hooks/useBalances'
import {
  buildGetFullTransactionsAggregatedQueryKey,
  buildGetFullTransactionsQueryKey,
} from '@renderer/hooks/useGetFullTransactions'
import { queryClient } from '@renderer/libs/query'
import { TNetwork } from '@shared/types/blockchain'
import { IAccountState } from '@shared/types/store'

type TInvalidateTransactionQueryParams = {
  account: IAccountState
  toAccount?: IAccountState
  network: TNetwork
}

export class ReactQueryHelper {
  static invalidateTransactionQueries = ({ account, network, toAccount }: TInvalidateTransactionQueryParams) => {
    queryClient.removeQueries({
      queryKey: buildGetFullTransactionsQueryKey({ account, network }),
    })

    queryClient.removeQueries({
      queryKey: buildGetFullTransactionsAggregatedQueryKey(),
    })

    queryClient.removeQueries({
      queryKey: buildQueryKeyBalance(account.address, account.blockchain, network),
    })

    if (toAccount) {
      queryClient.removeQueries({
        queryKey: buildQueryKeyBalance(toAccount.address, toAccount.blockchain, network),
      })

      queryClient.removeQueries({
        queryKey: buildGetFullTransactionsQueryKey({ account: toAccount, network }),
      })
    }
  }
}
