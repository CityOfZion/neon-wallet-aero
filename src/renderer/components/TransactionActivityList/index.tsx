import { useRef } from 'react'

import * as dateFns from 'date-fns'
import { match } from 'ts-pattern'

import { Separator } from '@renderer/components/Separator'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useGetFullTransactions } from '@renderer/hooks/useGetFullTransactions'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { useInfiniteScrollVirtualization, useVirtualization } from '@renderer/hooks/useVirtualization'

import type { IAccountState } from '@shared/types/store'

import { TransactionActivityListDateRange } from './TransactionActivityListDateRange'
import { TransactionActivityListEmpty } from './TransactionActivityListEmpty'
import { TransactionActivityListItem } from './TransactionActivityListItem'
import { TransactionActivityListSkeleton } from './TransactionActivityListSkeleton'

type TActionsData = {
  accounts: IAccountState[]
  dateFrom: Date
  dateTo: Date
}

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
  const { language } = useLanguageSelector()

  const { actionData, setData } = useActions<TActionsData>({
    accounts: [selectedAccount],
    dateFrom: dateFns.startOfMonth(dateNow),
    dateTo: dateNow,
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFullTransactions(actionData)

  const { dateFrom, dateTo } = actionData

  const isDateDisabled = isLoading ? true : { after: dateNow }

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

  const handleSelectDateFrom = async (date: Date) => {
    const newDateFrom = dateFns.startOfDay(date)

    setData({ dateFrom: newDateFrom })

    if (dateTo && dateFns.isAfter(newDateFrom, dateTo)) {
      const dateNow = new Date()
      const newDateTo = dateFns.endOfDay(dateFns.min([dateNow, dateFns.add(newDateFrom, { weeks: 1 })]))

      setData({ dateTo: dateFns.isSameDay(dateNow, newDateTo) ? dateNow : newDateTo })

      return
    }

    if (dateTo && dateFns.differenceInYears(dateTo, newDateFrom) > 0) {
      const dateNow = new Date()
      const newDateTo = dateFns.endOfDay(dateFns.add(newDateFrom, { years: 1, days: -1 }))

      setData({ dateTo: dateFns.isSameDay(dateNow, newDateTo) ? dateNow : newDateTo })
    }
  }

  const handleSelectDateTo = async (date: Date) => {
    const dateNow = new Date()
    const newDateTo = dateFns.isSameDay(dateNow, date) ? dateNow : dateFns.endOfDay(date)

    setData({ dateTo: newDateTo })

    if (dateFrom && dateFns.isBefore(newDateTo, dateFrom)) {
      setData({ dateFrom: dateFns.startOfDay(dateFns.sub(newDateTo, { weeks: 1 })) })

      return
    }

    if (dateFrom && dateFns.differenceInYears(newDateTo, dateFrom) > 0) {
      setData({ dateFrom: dateFns.startOfDay(dateFns.sub(newDateTo, { years: 1, days: -1 })) })
    }
  }

  useInfiniteScrollVirtualization({
    virtualizer,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
  })

  return (
    <div className="flex min-h-0 w-full flex-col gap-y-2 text-sm">
      <div className="flex justify-end">
        <TransactionActivityListDateRange
          dateFrom={dateFrom}
          dateTo={dateTo}
          isDisabled={isDateDisabled}
          onSelectDateFrom={handleSelectDateFrom}
          onSelectDateTo={handleSelectDateTo}
        />
      </div>

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
                  <h3 className="flex h-10 max-h-10 min-h-10 items-center font-medium text-white">
                    {DateHelper.formatLocalized(date, { format: 'PPP', language })}
                  </h3>

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
