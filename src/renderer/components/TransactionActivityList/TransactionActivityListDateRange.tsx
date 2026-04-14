import { Button } from '@renderer/components/Button'
import { DatePicker } from '@renderer/components/DatePicker'

import { DateHelper } from '@renderer/helpers/DateHelper'

import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import MdCalendarMonth from '@renderer/assets/images/md-calendar-month.svg?react'
import MdChevronRight from '@renderer/assets/images/md-chevron-right.svg?react'

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
  const { language } = useLanguageSelector()

  return (
    <div className="bg-asphalt flex h-9 w-fit min-w-56 items-center justify-center gap-x-0.5 rounded px-2">
      <MdCalendarMonth aria-hidden className="min-size-3 max-size-3 mr-0.5 size-3 text-gray-100" />

      <DatePicker.Root>
        <DatePicker.Trigger asChild>
          <Button
            label={DateHelper.formatLocalized(dateFrom, { format: 'PPP', language })}
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
          required
          disabled={isDisabled}
          onSelect={onSelectDateFrom}
        />
      </DatePicker.Root>

      <MdChevronRight aria-hidden className="min-size-4 max-size-4 size-4 text-gray-100" />

      <DatePicker.Root>
        <DatePicker.Trigger asChild>
          <Button
            label={DateHelper.formatLocalized(dateTo, { format: 'PPP', language })}
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
          required
          disabled={isDisabled}
          onSelect={onSelectDateTo}
        />
      </DatePicker.Root>
    </div>
  )
}
