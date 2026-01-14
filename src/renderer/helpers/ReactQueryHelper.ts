import { QueryClient } from '@tanstack/react-query'

import { buildQueryKeyBalance } from '@renderer/hooks/useBalances'
import {
  buildGetFullTransactionsAggregatedQueryKey,
  buildGetFullTransactionsQueryKey,
} from '@renderer/hooks/useGetFullTransactions'

import type { TNetwork } from '@shared/types/blockchain'
import type { IAccountState } from '@shared/types/store'

export class ReactQueryHelper {
  static readonly client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        gcTime: Infinity,
        staleTime: 60 * 1000, // 1 minute
      },
    },
  })

  static invalidateTransactionQueries(account: IAccountState, network: TNetwork, toAccount?: IAccountState) {
    this.client.removeQueries({
      queryKey: buildGetFullTransactionsQueryKey({ account, network }),
    })

    this.client.removeQueries({
      queryKey: buildGetFullTransactionsAggregatedQueryKey(),
    })

    this.client.removeQueries({
      queryKey: buildQueryKeyBalance(account.address, account.blockchain, network),
    })

    if (toAccount) {
      this.client.removeQueries({
        queryKey: buildQueryKeyBalance(toAccount.address, toAccount.blockchain, network),
      })

      this.client.removeQueries({
        queryKey: buildGetFullTransactionsQueryKey({ account: toAccount, network }),
      })
    }
  }
}
