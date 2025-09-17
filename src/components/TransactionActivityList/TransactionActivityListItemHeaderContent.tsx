import React, { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

import { IconButton } from '@/components/IconButton'
import { StringHelper } from '@/helpers/StringHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useSwapRecordSelector } from '@/hooks/useUtilitySelector'
import { TFullTransactionsItem } from '@/types/hooks'
import { TMigrationNeo3 } from '@/types/store'

import { TransactionActivityListItemHeaderDetails } from './TransactionActivityListItemHeaderDetails'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

import MdCoffee from '@/assets/images/md-coffee.svg?react'
import MdOutlineContentCopy from '@/assets/images/md-content-copy.svg?react'
import TbArrowsExchange from '@/assets/images/tb-arrows-exchange.svg?react'
import TbChevronRight from '@/assets/images/tb-chevron-right.svg?react'
import TbClock from '@/assets/images/tb-clock.svg?react'
import TbTransform from '@/assets/images/tb-transform.svg?react'

type TProps = {
  item: TFullTransactionsItem
  migrationNeo3?: TMigrationNeo3
}

export const TransactionActivityListItemHeaderContent = ({
  item: { txId, txIdUrl, date, isPending },
  migrationNeo3,
}: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.item' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { swapRecord } = useSwapRecordSelector(txId)
  const { modalNavigate } = useModalNavigate()

  const handleCancelBubbleEvent = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  // TODO: Implement navigate
  const handleGoToMigrationNeo3Status = () => {
    // modalNavigate('migration-neo3-status', { state: { hash: txId } })
  }

  const handleGoToSwapDetails = () => {
    modalNavigate('swap-details', { state: { swapRecord } })
  }

  const handleKeyDownWrapper = (callback: () => void) => {
    return ({ code }: React.KeyboardEvent<HTMLDivElement>) => {
      if (code !== 'Space' && code !== 'Enter') return

      callback()
    }
  }

  const handleCopyTxId = () => {
    UtilsHelper.copyToClipboard(txId)
  }

  return (
    <div className="flex h-full w-full items-center justify-between gap-x-2 rounded bg-gray-700/60 px-1">
      <div className="flex items-center gap-x-4 truncate whitespace-nowrap" onClick={handleCancelBubbleEvent}>
        <TransactionActivityListItemHeaderDetails
          label={format(date, t('formatFullDateTime'))}
          data={format(date, t('formatHourMinutes'))}
          icon={<TbClock aria-hidden={true} />}
        />

        {isPending && (
          <TransactionActivityListItemHeaderDetails
            className="animate-pulse"
            data={
              <TransactionActivityListTooltip data={t('pendingTooltipLabel')}>
                <span className="text-orange">{t('pendingDataLabel')}</span>
              </TransactionActivityListTooltip>
            }
            icon={<MdCoffee aria-hidden={true} className="text-orange" />}
          />
        )}
      </div>

      <div className="flex items-center gap-x-2 truncate whitespace-nowrap">
        {(migrationNeo3 || swapRecord) && (
          <div className="flex items-center gap-x-2" onClick={handleCancelBubbleEvent}>
            {migrationNeo3 && (
              <TransactionActivityListItemHeaderDetails
                role="button"
                tabIndex={0}
                className="hover:opacity-90 focus:opacity-90 active:opacity-80"
                data={<p className="text-yellow">{tCommonGeneral('migrationNeo3')}</p>}
                icon={<TbArrowsExchange aria-hidden={true} className="text-yellow" />}
                onKeyDown={handleKeyDownWrapper(handleGoToMigrationNeo3Status)}
                onClick={handleGoToMigrationNeo3Status}
              />
            )}

            {swapRecord && (
              <TransactionActivityListItemHeaderDetails
                role="button"
                tabIndex={0}
                className="hover:opacity-90 focus:opacity-90 active:opacity-80"
                data={<p className="text-blue">{tCommonGeneral('swap')}</p>}
                icon={<TbTransform aria-hidden={true} className="text-blue" />}
                onKeyDown={handleKeyDownWrapper(handleGoToSwapDetails)}
                onClick={handleGoToSwapDetails}
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-x-1 text-gray-300" onClick={handleCancelBubbleEvent}>
          <TransactionActivityListTooltip data={txId}>
            <span>
              {t('txIdLabel')} <span className="text-gray-100">{StringHelper.truncateStart(txId, 8)}</span>
            </span>
          </TransactionActivityListTooltip>

          <TransactionActivityListTooltip data={t('copyTxIdLabel')}>
            <IconButton
              aria-label={t('copyTxIdLabel')}
              size="xs"
              icon={<MdOutlineContentCopy aria-hidden={true} className="text-neon" />}
              onClick={handleCopyTxId}
            />
          </TransactionActivityListTooltip>
        </div>

        {!!txIdUrl && (
          <TbChevronRight aria-hidden className="text-neon -ml-1 h-4 max-h-4 min-h-4 w-4 max-w-4 min-w-4" />
        )}
      </div>
    </div>
  )
}
