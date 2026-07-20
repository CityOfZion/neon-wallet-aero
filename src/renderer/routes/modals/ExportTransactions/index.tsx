import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { isSameDay } from 'date-fns/isSameDay'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { FileHelper } from '@renderer/helpers/FileHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useLanguageSelector, useSelectedWalletSelector } from '@renderer/hooks/useSettingsSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TModalState } from '@shared/types/modal'
import type { TAccount } from '@shared/types/store'

import { ExportFullTransactionInfo } from './ExportFullTransactionInfo'
import { ExportTransactionsSuccessContent } from './ExportTransactionsSuccessContent'

type TActionsData = {
  selectedAccount: TAccount
  dateFrom: Date
  dateTo: Date
}

export const ExportTransactionsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportTransactions' })

  const modalState = useModalState<TModalState<'export-transactions'>>()
  const { modalNavigate } = useModalNavigate()
  const { selectedWallet } = useSelectedWalletSelector()
  const { language } = useLanguageSelector()
  const today = new Date()

  const { actionData, setData, handleAct, actionState } = useActions<TActionsData>({
    selectedAccount: modalState.selectedAccount,
    dateFrom: modalState.dateFrom,
    dateTo: modalState.dateTo,
  })

  const { dateFrom, dateTo, selectedAccount } = actionData

  const account = actionData.selectedAccount
  const service = account
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
    : undefined
  const isDisabled = !account || !!modalState.readOnly || !service || !hasFullTransactions(service)

  const handleSelectDateFrom = (dateFrom: Date) => {
    setData(DateHelper.calculateDateFromSelectionMaxOneYear({ dateFrom, dateTo }))
  }

  const handleSelectDateTo = (dateTo: Date) => {
    setData(DateHelper.calculateDateToSelectionMaxOneYear({ dateFrom, dateTo }))
  }

  const handleSelectWallet = () => {
    modalNavigate('wallet-selection', {
      state: {
        selectedWallet,
        hideActions: true,
        shouldPersistSelection: false,
        onSelect: wallet => {
          modalNavigate('account-selection', {
            state: {
              walletId: wallet.id,
              selectedAccount,
              hideActions: true,
              shouldPersistSelection: false,
              onSelect: (account: TAccount) => {
                setData({ selectedAccount: account })
                modalNavigate(-2)
              },
            },
          })
        },
      },
    })
  }

  const handleExport = async () => {
    try {
      if (isDisabled) return

      const csvData = await service.fullTransactionsDataService.exportFullTransactionsByAddress({
        address: account.address,
        dateFrom: actionData.dateFrom.toJSON(),
        dateTo: (isSameDay(today, actionData.dateTo) ? today : actionData.dateTo).toJSON(),
      })

      const format = 'MMddyyyy'
      const formattedDateFrom = DateHelper.formatLocalized(actionData.dateFrom, {
        language,
        format,
      })
      const formattedDateTo = DateHelper.formatLocalized(actionData.dateTo, {
        language,
        format,
      })

      const filename = `neon-transactions-${selectedAccount.address}-${selectedAccount.blockchain}-${formattedDateFrom}-${formattedDateTo}.csv`

      FileHelper.download(csvData, { type: 'text/csv' }, filename)

      modalNavigate('success', {
        replace: true,
        state: {
          heading: t('title'),
          subtitle: t('exportedContent.description'),
          content: (
            <ExportTransactionsSuccessContent selectedAccount={selectedAccount} dateFrom={dateFrom} dateTo={dateTo} />
          ),
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'ExportTransactionsModal', operation: 'export' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.exportError')).message })
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <form onSubmit={handleAct(handleExport)} className="flex grow flex-col">
        <p className="text-xs text-white">{t('info.description')}</p>

        <p className="mt-7 text-xs font-bold text-gray-100 uppercase">{t('info.accountInfoLabel')}</p>
        {selectedAccount && (
          <ExportFullTransactionInfo
            className="mt-2"
            selectedAccount={actionData.selectedAccount}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSelectWallet={handleSelectWallet}
            onSelectDateFrom={handleSelectDateFrom}
            onSelectDateTo={handleSelectDateTo}
          />
        )}

        <Button
          label={t('info.exportButtonLabel')}
          variant="card"
          type="submit"
          loading={actionState.isActing}
          className="mt-auto"
        />
      </form>
    </BottomModalLayout>
  )
}

export default ExportTransactionsModal
