import { useRef } from 'react'

import { hasFullTransactions } from '@cityofzion/blockchain-service'
import * as dateFns from 'date-fns'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { useTransactionsQuery } from '@renderer/hooks/useTransactionsQuery'
import { useInfiniteScrollVirtualization, useVirtualization } from '@renderer/hooks/useVirtualization'

import TbFileExport from '@renderer/assets/images/tb-file-export.svg?react'

import type { TAccount } from '@shared/types/store'

import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'
import { TransactionActivityListDateRange } from './TransactionActivityListDateRange'
import { TransactionActivityListEmpty } from './TransactionActivityListEmpty'
import { TransactionActivityListItems } from './TransactionActivityListItems'
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
  ITEM: 56,
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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransactionsQuery({
    account: selectedAccount,
    ...actionData,
  })

  const { dateFrom, dateTo } = actionData
  const isDateDisabled = isLoading ? true : { after: dateNow }

  const contentRef = useRef<HTMLUListElement>(null)

  const { virtualizer } = useVirtualization({
    contentRef,
    count: data.length,
    gap: heights.DATE_GAP,
    estimateSize: index => {
      const { transactions } = data[index] // Get the transactions for the current date group
      const transactionsLength = transactions.length // Number of transactions in this group

      // Base height includes date label and separator
      let height = heights.DATE + heights.SEPARATOR

      // If there aren't transactions, return the base height
      if (transactionsLength === 0) return height

      // Add height for separator margin
      height += heights.SEPARATOR_MARGIN

      // Add height for each header
      height += transactionsLength * heights.HEADER

      // Add gaps between transactions, except after the last one
      height += (transactionsLength - 1) * heights.TRANSACTION_GAP

      let itemsLength = 0

      // Calculate total number of items across all transactions in the group
      transactions.forEach(transaction => {
        if (transaction.view === 'utxo') {
          itemsLength += Math.max(transaction.inputs.length, transaction.outputs.length) + transaction.nfts.length

          return
        }

        itemsLength += transaction.events.length
      })

      // Add height for each item
      height += itemsLength * heights.ITEM

      return height // Return the final estimated height
    },
  })

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
  const hasFullTransactionsService = hasFullTransactions(service)

  const handleSelectDateFrom = (dateFrom: Date) => {
    setData(DateHelper.calculateDateFromSelectionMaxOneYear({ dateFrom, dateTo }))
  }

  const handleSelectDateTo = (dateTo: Date) => {
    setData(DateHelper.calculateDateToSelectionMaxOneYear({ dateFrom, dateTo }))
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
              const hasTransactions = transactions.length > 0

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

                  <Separator containerClassName={StyleHelper.mergeStyles({ 'mb-2': hasTransactions })} />

                  {hasTransactions && (
                    <ul className="flex flex-col gap-y-2">
                      {transactions.map(transaction => (
                        <TransactionActivityListItems key={transaction.txId} transaction={transaction} />
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
