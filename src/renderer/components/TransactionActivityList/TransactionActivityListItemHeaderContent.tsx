import type React from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@renderer/components/IconButton'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'
import { useSwapRecordByHashSelector } from '@renderer/hooks/useUtilitySelector'

import MdCoffee from '@renderer/assets/images/md-coffee.svg?react'
import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbClock from '@renderer/assets/images/tb-clock.svg?react'
import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

import type { TFullTransactionsItem } from '@shared/types/hooks'
import type { TMigrationNeo3 } from '@shared/types/store'

import { TransactionActivityListItemHeaderDetails } from './TransactionActivityListItemHeaderDetails'
import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

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
  const { swapRecord } = useSwapRecordByHashSelector(txId)
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

  const handleCopyTxId = () => {
    UtilsHelper.copyToClipboard(txId)
  }

  return (
    <div className="flex h-full w-full items-center justify-between gap-x-2 rounded bg-gray-700/60 px-1">
      <div className="flex items-center gap-x-4 truncate whitespace-nowrap" onClick={handleCancelBubbleEvent}>
        <TransactionActivityListItemHeaderDetails
          label={DateHelper.formatLocalized(date, { format: 'Pp', language })}
          data={DateHelper.formatLocalized(date, { format: 'hh:mm', language })}
          icon={<TbClock aria-hidden />}
        />

        {isPending && (
          <TransactionActivityListItemHeaderDetails
            className="animate-pulse"
            data={
              <TransactionActivityListTooltip data={t('pendingTooltipLabel')}>
                <span className="text-orange">{t('pendingDataLabel')}</span>
              </TransactionActivityListTooltip>
            }
            icon={<MdCoffee aria-hidden className="text-orange" />}
          />
        )}
      </div>

      <div className="flex items-center gap-x-2 truncate whitespace-nowrap">
        {(migrationNeo3 || swapRecord) && (
          <div className="flex items-center gap-x-2" onClick={handleCancelBubbleEvent}>
            {swapRecord && (
              <TransactionActivityListItemHeaderDetails
                role="button"
                tabIndex={0}
                className="hover:opacity-90 focus:opacity-90 active:opacity-80"
                data={<p className="text-blue">{tCommonGeneral('swap')}</p>}
                icon={<TbTransform aria-hidden className="text-blue" />}
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
              icon={<MdContentCopy aria-hidden className="text-neon" />}
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
