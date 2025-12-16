import { Link } from 'react-router-dom'

import type { TFullTransactionsItem } from '@shared/types/hooks'

import { TransactionActivityListItemHeaderContent } from './TransactionActivityListItemHeaderContent'

type TProps = {
  item: TFullTransactionsItem
}

export const TransactionActivityListItemHeader = ({ item }: TProps) => {
  const { txIdUrl } = item

  return (
    <div className="flex h-8.5 max-h-8.5 min-h-8.5 w-full items-center gap-x-2">
      {txIdUrl ? (
        <Link to={txIdUrl} target="_blank" className="block h-full w-full cursor-pointer">
          <TransactionActivityListItemHeaderContent item={item} />
        </Link>
      ) : (
        <TransactionActivityListItemHeaderContent item={item} />
      )}
    </div>
  )
}
