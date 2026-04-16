import { QueryClient } from '@tanstack/react-query'

import { buildQueryKeyBalance } from '@renderer/hooks/useBalances'
import { buildTransactionsQueryKey } from '@renderer/hooks/useTransactions'
import { buildVoteNeo3GetVoteDetailsByAddressQueryKey } from '@renderer/hooks/useVoteNeo3'

import type { TNetwork } from '@shared/types/blockchain'
import type { TAccount } from '@shared/types/store'

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

  static invalidateTransactionQueries = (account: TAccount, network: TNetwork) => {
    this.client.removeQueries({
      queryKey: buildTransactionsQueryKey({ account, network }),
      type: 'all',
    })

    this.client.removeQueries({
      queryKey: buildQueryKeyBalance(account.address, account.blockchain, network),
      type: 'all',
    })

    this.client.removeQueries({
      queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network: network, address: account.address }),
      type: 'all',
    })
  }
}
