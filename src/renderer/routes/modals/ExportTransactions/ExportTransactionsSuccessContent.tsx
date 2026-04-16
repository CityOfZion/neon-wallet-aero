import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import type { TAccount } from '@shared/types/store'

import { ExportFullTransactionInfo } from './ExportFullTransactionInfo'

type TProps = {
  selectedAccount: TAccount
  dateFrom: Date
  dateTo: Date
}

export const ExportTransactionsSuccessContent = ({ selectedAccount, dateFrom, dateTo }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportTransactions.exportedContent' })
  const { modalEraseWrapper } = useModalNavigate()

  return (
    <div className="flex w-full grow flex-col">
      <p className="mt-7 text-xs font-bold text-gray-100 uppercase">{t('infoLabel')}</p>

      <ExportFullTransactionInfo
        className="mt-2"
        selectedAccount={selectedAccount}
        readOnly
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <Button label={t('closeButtonLabel')} variant="card" onClick={modalEraseWrapper('bottom')} className="mt-auto" />
    </div>
  )
}
