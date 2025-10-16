import { Link } from 'react-router-dom'

import type { TFullTransactionsItem } from '@shared/types/hooks'
import type { TMigrationNeo3 } from '@shared/types/store'

import { TransactionActivityListItemHeaderContent } from './TransactionActivityListItemHeaderContent'

type TProps = {
  item: TFullTransactionsItem
  migrationNeo3?: TMigrationNeo3
}

export const TransactionActivityListItemHeader = ({ item, migrationNeo3 }: TProps) => {
  const { txIdUrl } = item

  return (
    <div className="flex h-8.5 max-h-8.5 min-h-8.5 w-full items-center gap-x-2">
      {txIdUrl ? (
        <Link to={txIdUrl} target="_blank" className="block h-full w-full cursor-pointer">
          <TransactionActivityListItemHeaderContent item={item} migrationNeo3={migrationNeo3} />
        </Link>
      ) : (
        <TransactionActivityListItemHeaderContent item={item} migrationNeo3={migrationNeo3} />
      )}
    </div>
  )
}
