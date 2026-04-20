import { Separator } from '@renderer/components/Separator'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { TransactionActivityListEvent } from './TransactionActivityListEvent'
import { TransactionActivityListItemHeader } from './TransactionActivityListItemHeader'

type TProps = {
  transaction: TUseTransactionsTransaction
}

export const TransactionActivityListItem = ({ transaction }: TProps) => (
  <li className="flex w-full flex-col bg-gray-900">
    <TransactionActivityListItemHeader transaction={transaction} />

    {/* TODO: change component names and improve the skeleton height on UTXO task */}
    {transaction.view === 'default' && transaction.events.length > 0 && (
      <ul className="flex w-full flex-col">
        {transaction.events.map((event, index) => {
          const hash = event.eventType === 'nft' ? event.nft?.hash : event.token?.hash

          return (
            <li
              key={`${event.eventType}-${hash}-${event.methodName}-${transaction.blockchain}-${index}`}
              className="group/item flex h-13.25 max-h-13.25 min-h-13.25 w-full flex-col justify-center"
            >
              <TransactionActivityListEvent event={event} />

              <Separator className="h-px max-h-px min-h-px" containerClassName="group-last/item:hidden" />
            </li>
          )
        })}
      </ul>
    )}
  </li>
)
