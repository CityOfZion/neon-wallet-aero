import { Separator } from '@renderer/components/Separator'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { TransactionActivityListEvent } from './TransactionActivityListEvent'
import { TransactionActivityListItemHeader } from './TransactionActivityListItemHeader'

type TProps = {
  transaction: TUseTransactionsTransaction
}

export const TransactionActivityListItem = ({ transaction }: TProps) => {
  const { blockchain, events } = transaction

  return (
    <li className="flex w-full flex-col bg-gray-900">
      <TransactionActivityListItemHeader transaction={transaction} />

      {events.length > 0 && (
        <ul className="flex w-full flex-col">
          {events.map((event, index, array) => (
            <li
              key={`${event.eventType}-${event.methodName}-${event.eventType === 'nft' ? event.collectionHash : event.contractHash}-${blockchain}-${index}`}
              className="flex h-[3.3125rem] max-h-[3.3125rem] min-h-[3.3125rem] w-full flex-col justify-center"
            >
              <TransactionActivityListEvent event={event} blockchain={blockchain} />

              {index !== array.length - 1 && <Separator className="h-px max-h-px min-h-px" />}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
