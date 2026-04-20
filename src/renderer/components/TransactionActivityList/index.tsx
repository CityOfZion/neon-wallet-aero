import { useRef } from 'react'

import { hasFullTransactions } from '@cityofzion/blockchain-service'
import * as dateFns from 'date-fns'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { ExportTransactionsHelper } from '@renderer/helpers/ExportTransactionsHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { useTransactions } from '@renderer/hooks/useTransactions'
import { useInfiniteScrollVirtualization, useVirtualization } from '@renderer/hooks/useVirtualization'

import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'

import type { TUseTransactionsTransactionDefault } from '@shared/types/hooks'
import type { TAccount } from '@shared/types/store'

import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'
import { TransactionActivityListDateRange } from './TransactionActivityListDateRange'
import { TransactionActivityListEmpty } from './TransactionActivityListEmpty'
import { TransactionActivityListItem } from './TransactionActivityListItem'
import { TransactionActivityListSkeleton } from './TransactionActivityListSkeleton'

type TActionsData = {
  dateFrom: Date
  dateTo: Date
}

type TProps = {
  selectedAccount: TAccount
}

const heights = {
  DATE: 40,
  DATE_GAP: 16,
  HEADER: 34,
  ITEM: 53,
  SEPARATOR: 1,
  SEPARATOR_MARGIN: 8,
  TRANSACTION_GAP: 8,
}

export const TransactionActivityList = ({ selectedAccount }: TProps) => {
  const dateNow = new Date()
  const { language } = useLanguageSelector()
  const { modalNavigateWrapper } = useModalNavigate()
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList' })

  const { actionData, setData } = useActions<TActionsData>({
    dateFrom: dateFns.startOfMonth(dateNow),
    dateTo: dateNow,
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransactions({
    account: selectedAccount,
    ...actionData,
  })

  const { dateFrom, dateTo } = actionData

  const isDateDisabled = isLoading ? true : { after: dateNow }

  const contentRef = useRef<HTMLUListElement>(null)

  // TODO: change variable names, comments and height when UTXO is implemented
  const { virtualizer } = useVirtualization({
    contentRef,
    count: data.length,
    gap: heights.DATE_GAP,
    estimateSize: index => {
      const { transactions } = data[index] // Get the transactions for the current date group
      const transactionsLength = transactions.length // Number of transactions in this group

      // Base height includes date label, separator, and separator margin
      let height = heights.DATE + heights.SEPARATOR + heights.SEPARATOR_MARGIN

      // If there aren't transactions, return the base height
      if (transactionsLength === 0) return height

      // Add height for each header
      height += transactionsLength * heights.HEADER

      // Add gaps between transactions, except after the last one
      height += (transactionsLength - 1) * heights.TRANSACTION_GAP

      const [firstTransaction] = transactions

      // Calculate total number of items across all transactions in the group
      const itemsLength =
        firstTransaction.view === 'default'
          ? (transactions as TUseTransactionsTransactionDefault[]).flatMap(({ events }) => events).length
          : 0

      // Add height for each item
      height += itemsLength * heights.ITEM

      return height // Return the final estimated height
    },
  })

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
  const hasFullTransactionsService = hasFullTransactions(service)

  const handleSelectDateFrom = (dateFrom: Date) => {
    setData(ExportTransactionsHelper.calculateDateFromSelectionMaxOneYear({ dateFrom, dateTo }))
  }

  const handleSelectDateTo = (dateTo: Date) => {
    setData(ExportTransactionsHelper.calculateDateToSelectionMaxOneYear({ dateFrom, dateTo }))
  }

  useInfiniteScrollVirtualization({
    virtualizer,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
  })

  return (
    <div
      className={StyleHelper.mergeStyles('flex min-h-0 w-full flex-col gap-y-6 text-sm', {
        'gap-y-2': isLoading || data.length === 0,
      })}
    >
      {hasFullTransactionsService && (
        <div className="flex items-center justify-between">
          <Tooltip title={t('exportTransactionsButtonLabel')} delayDuration={400}>
            <IconButton
              aria-label={t('exportTransactionsButtonLabel')}
              icon={<TbFileExport className="text-blue" aria-hidden />}
              onClick={modalNavigateWrapper('export-transactions', {
                state: {
                  dateFrom,
                  dateTo,
                  readOnly: false,
                  selectedAccount,
                },
              })}
            />
          </Tooltip>

          <TransactionActivityListDateRange
            dateFrom={dateFrom}
            dateTo={dateTo}
            isDisabled={isDateDisabled}
            onSelectDateFrom={handleSelectDateFrom}
            onSelectDateTo={handleSelectDateTo}
          />
        </div>
      )}

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
              const { date, transactions } = data[virtualItem.index]

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

                  {transactions.length > 0 && (
                    <ul className="flex flex-col gap-y-2">
                      {transactions.map((transaction, index) => (
                        <TransactionActivityListItem key={`${transaction.txId}-${index}`} transaction={transaction} />
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
