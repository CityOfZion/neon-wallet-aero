import { useMemo } from 'react'

import { hasFullTransactions, type TGetTransactionsByAddressResponse } from '@cityofzion/blockchain-service'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as dateFns from 'date-fns'
import { cloneDeep } from 'lodash'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import {
  type TUseTransactionsBuildTransactionsQueryKeyParams,
  type TUseTransactionsGroupedTransactionsByDate,
  type TUseTransactionsProps,
  type TUseTransactionsQueryData,
  type TUseTransactionsTransaction,
} from '@shared/types/hooks'
import type { TAccount } from '@shared/types/store'

import { useAccountsMapSelector } from './useAccountSelector'
import { useSelectedNetworkSelector } from './useSettingsSelector'
import { useHiddenTokensByBlockchainSelector, usePendingTransactionsSelector } from './useUtilitySelector'

export const buildTransactionsQueryKey = ({
  address,
  blockchain,
  network,
  dateFrom,
  dateTo,
}: TUseTransactionsBuildTransactionsQueryKeyParams) => {
  const queryKey: any[] = ['transactions', address, blockchain, network]

  if (dateFrom) {
    queryKey.push(DateHelper.format(dateFrom, 'yyyy-MM-dd'))
  }

  if (dateTo) {
    queryKey.push(DateHelper.format(dateTo, 'yyyy-MM-dd'))
  }

  return queryKey
}

const fetchTransactions = async (
  account: TAccount,
  dateFrom: Date,
  dateTo: Date,
  nextPageParams: any,
  accountsMap: Map<string, TAccount>
) => {
  const { blockchain } = account
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const transactionsMap: TUseTransactionsQueryData['transactions'] = new Map()

  let response: TGetTransactionsByAddressResponse<TBlockchainServiceKey>

  if (hasFullTransactions(service)) {
    const dateNow = new Date()

    response = await service.fullTransactionsDataService.getFullTransactionsByAddress({
      address: account.address,
      dateFrom: dateFrom.toJSON(),
      dateTo: (dateFns.isSameDay(dateTo, dateNow) ? dateNow : dateTo).toJSON(),
      pageSize: 50,
      nextPageParams,
    })
  } else {
    response = await service.blockchainDataService.getTransactionsByAddress({
      address: account.address,
      nextPageParams,
    })
  }

  response.transactions.forEach(transaction => {
    const newTransaction: TUseTransactionsTransaction = { ...transaction, account, blockchain, isPending: false }

    if (newTransaction.view === 'utxo') {
      newTransaction.inputs = newTransaction.inputs.map(({ address, ...input }) => ({
        ...input,
        account: address ? accountsMap.get(AccountHelper.buildAccountKey({ address, blockchain })) : undefined,
      }))

      newTransaction.outputs = newTransaction.outputs.map(({ address, ...output }) => ({
        ...output,
        account: address ? accountsMap.get(AccountHelper.buildAccountKey({ address, blockchain })) : undefined,
      }))
    } else {
      newTransaction.events = newTransaction.events.map(({ from, to, ...event }) => ({
        ...event,
        from,
        to,
        fromAccount: from ? accountsMap.get(AccountHelper.buildAccountKey({ address: from, blockchain })) : undefined,
        toAccount: to ? accountsMap.get(AccountHelper.buildAccountKey({ address: to, blockchain })) : undefined,
      }))
    }

    transactionsMap.set(transaction.txId, newTransaction)
  })

  return { ...response, transactions: Array.from(transactionsMap.values()) }
}

export const useTransactions = ({ account, dateFrom, dateTo }: TUseTransactionsProps) => {
  const { accountsMapRef } = useAccountsMapSelector()
  const { network } = useSelectedNetworkSelector(account.blockchain)
  const { pendingTransactions } = usePendingTransactionsSelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const query = useInfiniteQuery({
    queryKey: buildTransactionsQueryKey({
      address: account.address,
      blockchain: account.blockchain,
      network,
      dateFrom,
      dateTo,
    }),
    queryFn: ({ pageParam: nextPageParams }) =>
      fetchTransactions(account, dateFrom, dateTo, nextPageParams, accountsMapRef.current),
    initialPageParam: undefined,
    getNextPageParam: ({ nextPageParams }) => nextPageParams,
  })

  const data = useMemo(() => {
    if (query.isLoading || !query.data) return []

    const groupedTransactionsMap = new Map<string, TUseTransactionsTransaction>()
    const transactionsMap = cloneDeep(query.data.pages.flatMap(page => page.transactions))

    transactionsMap.forEach(transaction => groupedTransactionsMap.set(transaction.txId, transaction))

    pendingTransactions.forEach(transaction => {
      if (
        AccountHelper.predicate(transaction.account)(account) &&
        dateFns.isWithinInterval(transaction.date, { start: dateFrom, end: dateTo })
      ) {
        groupedTransactionsMap.set(transaction.txId, transaction)
      }
    })

    const sortedTransactions = Array.from(groupedTransactionsMap.values()).sort((a, b) => {
      const newerDate = new Date(a.date)
      const olderDate = new Date(b.date)

      if (newerDate > olderDate) return -1
      if (newerDate < olderDate) return 1

      return 0
    })

    const groupedDataByDates = new Map<string, TUseTransactionsGroupedTransactionsByDate>()

    sortedTransactions.forEach(transaction => {
      const hiddenTokens = hiddenTokensByBlockchain[transaction.blockchain]
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[transaction.blockchain]

      if (!!hiddenTokens && hiddenTokens.length > 0) {
        const isHiddenToken = (tokenHash: string) => {
          return hiddenTokens.includes(service.tokenService.normalizeHash(tokenHash))
        }

        if (transaction.view === 'utxo') {
          transaction.inputs = transaction.inputs.filter(({ token }) => !isHiddenToken(token.hash))
          transaction.outputs = transaction.outputs.filter(({ token }) => !isHiddenToken(token.hash))
        } else {
          transaction.events = transaction.events.filter(event => {
            if (event.eventType !== 'token') return true

            const tokenHash = event.token?.hash

            if (!tokenHash) return true

            return !isHiddenToken(tokenHash)
          })
        }
      }

      const date = DateHelper.format(transaction.date, 'MM-dd-yyyy')
      const existingGroupedData = groupedDataByDates.get(date)

      if (existingGroupedData) {
        existingGroupedData.transactions.push(transaction)

        return
      }

      groupedDataByDates.set(date, { date, transactions: [transaction] })
    })

    return Array.from(groupedDataByDates.values())
  }, [account, dateFrom, dateTo, hiddenTokensByBlockchain, pendingTransactions, query.data, query.isLoading])

  return { ...query, data }
}
