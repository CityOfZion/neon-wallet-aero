import type { TSwapApiOrderSummary } from '@cityofzion/bs-multichain'
import { Link } from 'react-router-dom'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { TransactionActivityListItemsHeaderContent } from './TransactionActivityListItemsHeaderContent'

type TProps = {
  transaction: TUseTransactionsTransaction
  swapOrders: TSwapApiOrderSummary[]
}

export const TransactionActivityListItemsHeader = ({ transaction, swapOrders }: TProps) => {
  const { txIdUrl } = transaction

  return (
    <div className="flex h-8.5 max-h-8.5 min-h-8.5 w-full items-center gap-x-2">
      {txIdUrl ? (
        <Link to={txIdUrl} target="_blank" className="block size-full cursor-pointer">
          <TransactionActivityListItemsHeaderContent transaction={transaction} swapOrders={swapOrders} />
        </Link>
      ) : (
        <TransactionActivityListItemsHeaderContent transaction={transaction} swapOrders={swapOrders} />
      )}
    </div>
  )
}
