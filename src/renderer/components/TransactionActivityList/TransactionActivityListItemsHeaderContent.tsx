import type React from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { useSwapRecordByHashSelector } from '@renderer/hooks/useUtilitySelector'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbClock from '@renderer/assets/images/tb-clock.svg?react'
import TbMug from '@renderer/assets/images/tb-mug.svg?react'
import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

import type { TUseTransactionsTransaction } from '@shared/types/hooks'

import { TransactionActivityListItemsHeaderContentDetails } from './TransactionActivityListItemsHeaderContentDetails'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  transaction: TUseTransactionsTransaction
}

export const TransactionActivityListItemsHeaderContent = ({ transaction }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.items' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { swapRecord } = useSwapRecordByHashSelector(transaction.txId)
  const { modalNavigate } = useModalNavigate()
  const { language } = useLanguageSelector()

  const handleCancelBubbleEvent = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleGoToSwapDetails = () => {
    if (!swapRecord) return
    modalNavigate('swap-details', { state: { swapRecord } })
  }

  const handleKeyDownWrapper = (callback: () => void) => {
    return ({ code }: React.KeyboardEvent<HTMLDivElement>) => {
      if (code !== 'Space' && code !== 'Enter') return

      callback()
    }
  }

  return (
    <div className="flex size-full items-center justify-between gap-x-2 rounded bg-gray-700/60 px-1">
      <div className="flex items-center gap-x-2 truncate whitespace-nowrap" onClick={handleCancelBubbleEvent}>
        <TransactionActivityListItemsHeaderContentDetails
          label={DateHelper.formatLocalized(transaction.date, { format: 'PP - p', language })}
          data={DateHelper.formatLocalized(transaction.date, { format: 'p', language })}
          icon={<TbClock aria-hidden />}
        />

        {transaction.isPending && (
          <TransactionActivityListItemsHeaderContentDetails
            className="animate-pulse"
            data={
              <TransactionActivityListTooltip data={t('pendingTooltipLabel')}>
                <span className="text-orange">{t('pendingDataLabel')}</span>
              </TransactionActivityListTooltip>
            }
            icon={<TbMug aria-hidden className="text-orange" />}
          />
        )}
      </div>

      <div className="flex items-center gap-x-2 truncate whitespace-nowrap">
        {swapRecord && (
          <div className="flex items-center gap-x-2" onClick={handleCancelBubbleEvent}>
            <TransactionActivityListItemsHeaderContentDetails
              role="button"
              tabIndex={0}
              className="hover:opacity-90 focus:opacity-90 active:opacity-80"
              data={<span className="text-blue">{tCommonGeneral('swap')}</span>}
              icon={<TbTransform aria-hidden className="text-blue" />}
              onKeyDown={handleKeyDownWrapper(handleGoToSwapDetails)}
              onClick={handleGoToSwapDetails}
            />
          </div>
        )}

        <div className="flex items-center gap-x-1 text-gray-300" onClick={handleCancelBubbleEvent}>
          <TransactionActivityListTooltip data={transaction.txId}>
            <span>
              {t('txIdLabel')} <span className="text-gray-100">{StringHelper.truncateStart(transaction.txId, 8)}</span>
            </span>
          </TransactionActivityListTooltip>

          <TransactionActivityListTooltip data={t('copyTxIdLabel')}>
            <IconButton
              aria-label={t('copyTxIdLabel')}
              size="xs"
              icon={<MdContentCopy aria-hidden className="text-neon" />}
              onClick={ClipboardHelper.write.bind(null, transaction.txId)}
            />
          </TransactionActivityListTooltip>
        </div>

        {!!transaction.txIdUrl && (
          <TbChevronRight aria-hidden className="text-neon min-size-4 max-size-4 -ml-1 size-4" />
        )}
      </div>
    </div>
  )
}
