import { useTranslation } from 'react-i18next'

import { ActionStep } from '@renderer/components/ActionStep'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { DatePicker } from '@renderer/components/DatePicker'
import { Separator } from '@renderer/components/Separator'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import MdCalendarMonth from '@renderer/assets/images/md-calendar-month.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'

import type { TAccount } from '@shared/types/store'

type TProps = {
  selectedAccount: TAccount
  dateFrom: Date
  dateTo: Date
  readOnly?: boolean
  className?: string
  onSelectWallet?: () => void
  onSelectDateFrom?: (date: Date) => void
  onSelectDateTo?: (date: Date) => void
}

export const ExportFullTransactionInfo = ({
  selectedAccount,
  readOnly = false,
  dateFrom,
  dateTo,
  className,
  onSelectWallet,
  onSelectDateFrom,
  onSelectDateTo,
}: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportTransactions.info' })
  const { language } = useLanguageSelector()
  const today = new Date()

  const formattedDateFrom = DateHelper.formatLocalized(dateFrom, {
    format: 'P',
    language,
  })

  const formattedDateTo = DateHelper.formatLocalized(dateTo, {
    format: 'P',
    language,
  })

  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex w-full flex-col items-center rounded-sm bg-gray-900/60 px-3.5',
        className
      )}
    >
      <ActionStep
        title={
          readOnly ? (
            <p className="px-2 text-xs text-white">
              {selectedAccount ? selectedAccount.address : t('addressPlaceholder')}
            </p>
          ) : (
            <Button
              className="min-w-0"
              colorSchema="neon"
              label={selectedAccount ? selectedAccount.address : t('addressPlaceholder')}
              textClassName="text-xs text-left"
              variant="text"
              flat
              type="button"
              onClick={onSelectWallet}
            />
          )
        }
        leftIcon={<BlockchainIcon blockchain={selectedAccount.blockchain} type="blue" className="size-4" />}
      />

      <Separator />

      <ActionStep
        title={
          <div className="flex items-center gap-1">
            {readOnly ? (
              <p className="px-2 text-xs text-white">{formattedDateFrom}</p>
            ) : (
              <DatePicker.Root>
                <DatePicker.Trigger asChild>
                  <Button label={formattedDateFrom} flat variant="text" colorSchema="neon" type="button" />
                </DatePicker.Trigger>

                <DatePicker.Picker
                  autoFocus
                  mode="single"
                  disabled={{
                    after: today,
                  }}
                  required
                  defaultMonth={dateFrom}
                  selected={dateFrom}
                  onSelect={onSelectDateFrom}
                  popoverContentProps={{ align: 'start' }}
                />
              </DatePicker.Root>
            )}

            <TbChevronRight className="text-blue size-4" aria-hidden />

            {readOnly ? (
              <p className="px-2 text-xs text-white">{formattedDateTo}</p>
            ) : (
              <DatePicker.Root>
                <DatePicker.Trigger asChild>
                  <Button label={formattedDateTo} flat variant="text" colorSchema="neon" type="button" />
                </DatePicker.Trigger>

                <DatePicker.Picker
                  numberOfMonths={1}
                  autoFocus
                  required
                  mode="single"
                  disabled={{
                    after: today,
                  }}
                  defaultMonth={dateTo}
                  selected={dateTo}
                  onSelect={onSelectDateTo}
                  popoverContentProps={{ align: 'start' }}
                />
              </DatePicker.Root>
            )}
          </div>
        }
        leftIcon={<MdCalendarMonth className="text-blue size-5" aria-hidden />}
      >
        {!readOnly && <span className="text-right text-xs text-gray-300">{t('datePickerStepTip')}</span>}
      </ActionStep>
    </div>
  )
}
