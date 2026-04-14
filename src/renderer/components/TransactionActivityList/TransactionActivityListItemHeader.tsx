import { Link } from 'react-router-dom'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { TransactionActivityListItemHeaderContent } from './TransactionActivityListItemHeaderContent'

type TProps = {
  transaction: TUseTransactionsTransaction
}

export const TransactionActivityListItemHeader = ({ transaction }: TProps) => {
  const { txIdUrl } = transaction

  return (
    <div className="flex h-8.5 max-h-8.5 min-h-8.5 w-full items-center gap-x-2">
      {txIdUrl ? (
        <Link to={txIdUrl} target="_blank" className="block size-full cursor-pointer">
          <TransactionActivityListItemHeaderContent transaction={transaction} />
        </Link>
      ) : (
        <TransactionActivityListItemHeaderContent transaction={transaction} />
      )}
    </div>
  )
}
