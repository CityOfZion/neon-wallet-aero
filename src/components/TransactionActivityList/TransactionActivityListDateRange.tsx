import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

import { Button } from '@/components/Button'
import { DatePicker } from '@/components/DatePicker'

import MdCalendarMonth from '@/assets/images/md-calendar-month.svg?react'
import MdChevronRight from '@/assets/images/md-chevron-right.svg?react'

type TProps = {
  dateFrom: Date
  dateTo: Date
  isDisabled: boolean | { after: Date }
  onSelectDateFrom: (dateFrom: Date) => void
  onSelectDateTo: (dateTo: Date) => void
}

export const TransactionActivityListDateRange = ({
  dateFrom,
  dateTo,
  isDisabled,
  onSelectDateFrom,
  onSelectDateTo,
}: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.dateRange' })

  return (
    <div className="bg-asphalt flex h-9 max-w-72 min-w-56 items-center justify-center gap-x-0.5 rounded px-2">
      <MdCalendarMonth aria-hidden={true} className="mr-0.5 h-3 max-h-3 min-h-3 w-3 max-w-3 min-w-3 text-gray-100" />

      <DatePicker.Root>
        <DatePicker.Trigger asChild>
          <Button
            label={format(dateFrom, t('formatExtendedDate'))}
            type="button"
            flat
            variant="text"
            colorSchema="neon"
            clickableProps={{ className: 'h-6 min-h-6 max-h-6' }}
          />
        </DatePicker.Trigger>

        <DatePicker.Picker
          mode="single"
          selected={dateFrom}
          defaultMonth={dateFrom}
          required={true}
          disabled={isDisabled}
          onSelect={onSelectDateFrom}
        />
      </DatePicker.Root>

      <MdChevronRight aria-hidden={true} className="h-4 max-h-4 min-h-4 w-4 max-w-4 min-w-4 text-gray-100" />

      <DatePicker.Root>
        <DatePicker.Trigger asChild>
          <Button
            label={format(dateTo, t('formatExtendedDate'))}
            type="button"
            flat
            variant="text"
            colorSchema="neon"
            clickableProps={{ className: 'h-6 min-h-6 max-h-6' }}
          />
        </DatePicker.Trigger>

        <DatePicker.Picker
          mode="single"
          selected={dateTo}
          defaultMonth={dateTo}
          required={true}
          disabled={isDisabled}
          onSelect={onSelectDateTo}
        />
      </DatePicker.Root>
    </div>
  )
}
