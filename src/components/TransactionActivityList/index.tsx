import { useRef } from 'react'
import * as dateFns from 'date-fns'
import { match } from 'ts-pattern'

import { Separator } from '@/components/Separator'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useGetFullTransactions } from '@/hooks/useGetFullTransactions'
import { useInfiniteScrollVirtualization, useVirtualization } from '@/hooks/useVirtualization'
import { IAccountState } from '@/types/store'

import { TransactionActivityListEmpty } from './TransactionActivityListEmpty'
import { TransactionActivityListItem } from './TransactionActivityListItem'
import { TransactionActivityListSkeleton } from './TransactionActivityListSkeleton'

type TProps = {
  selectedAccount: IAccountState
}

const heights = {
  DATE: 40,
  DATE_GAP: 16,
  HEADER: 34,
  EVENT: 53,
  SEPARATOR: 1,
  SEPARATOR_MARGIN: 8,
  TRANSACTION_GAP: 16,
}

export const TransactionActivityList = ({ selectedAccount }: TProps) => {
  const dateNow = new Date()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFullTransactions({
    accounts: [selectedAccount],
    dateFrom: dateFns.subMonths(dateNow, 1),
    dateTo: dateNow,
  })

  const contentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualization({
    contentRef,
    count: data.length,
    gap: heights.DATE_GAP,
    estimateSize: index => {
      const { items } = data[index] // Get the transactions (items) for the current date group
      const itemsLength = items.length // Number of transactions (items) in this group

      // Base height includes date label, separator, and separator margin
      let height = heights.DATE + heights.SEPARATOR + heights.SEPARATOR_MARGIN

      // If there aren't transactions (items), return the base height
      if (itemsLength === 0) return height

      // Add height for each header
      height += itemsLength * heights.HEADER

      // Add gaps between transactions (items), except after the last one
      height += (itemsLength - 1) * heights.TRANSACTION_GAP

      // Calculate total number of events across all items in the group
      const eventsLength = items.flatMap(({ events }) => events).length

      // Add height for each event
      height += eventsLength * heights.EVENT

      return height // Return the final estimated height
    },
  })

  useInfiniteScrollVirtualization({
    virtualizer,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
  })

  return (
    <div className="flex min-h-0 w-full flex-col text-sm">
      {match({ isLoading, data })
        .with({ isLoading: true }, () => <TransactionActivityListSkeleton />)
        .with({ data: [] }, () => <TransactionActivityListEmpty />)
        .otherwise(() => (
          <ul
            className={StyleHelper.mergeStyles('flex w-full flex-col opacity-0 transition-opacity', {
              'opacity-100': !!virtualizer.options.paddingStart,
            })}
            ref={contentRef}
          >
            {virtualizer.getVirtualItems().map(virtualItem => {
              const { date, items } = data[virtualItem.index]
              return (
                <li
                  key={virtualItem.key}
                  className="absolute top-0 left-0 flex w-full flex-col"
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <h3 className="flex h-10 max-h-10 min-h-10 items-center font-medium text-white">{date}</h3>

                  <Separator className="h-px max-h-px min-h-px" containerClassName="mb-2" />

                  {items.length > 0 && (
                    <ul className="flex flex-col gap-y-4">
                      {items.map((item, index) => (
                        <TransactionActivityListItem key={`${item.txId}-${index}`} item={item} />
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
    </div>
  )
}
