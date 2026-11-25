import { createContext, useContext, useMemo, useState } from 'react'

import { differenceInCalendarDays } from 'date-fns'
import type React from 'react'
import { DayPicker, type DayPickerProps, labelNext, labelPrevious, useDayPicker } from 'react-day-picker'
import { useTranslation } from 'react-i18next'

import { DateHelper } from '@renderer/helpers/DateHelper'
import { ElementHelper } from '@renderer/helpers/ElementHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import TbChevronLeft from '@renderer/assets/images/tb-chevron-left.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'

import { Button } from './Button'
import { IconButton } from './IconButton'
import { Tooltip } from './Tooltip'

export type TCalendarProps = DayPickerProps & {
  yearRange?: number
  showYearSwitcher?: boolean
}

type TNavView = 'days' | 'years'

type TDisplayYears = {
  from: number
  to: number
}

type TCalendarContext = {
  navView: TNavView
  setNavView: React.Dispatch<React.SetStateAction<TNavView>>
  displayYears: TDisplayYears
  setDisplayYears: React.Dispatch<React.SetStateAction<TDisplayYears>>
  showYearSwitcher?: boolean
  startMonth?: Date
  endMonth?: Date
  onPrevClick?: (date: Date) => void
  onNextClick?: (date: Date) => void
}

type TNavProps = React.ComponentProps<'nav'>

type TCaptionLabelProps = React.ComponentProps<'span'>

type TMonthGridProps = React.ComponentProps<'table'>

type TYearGridProps = {
  className?: string
  displayYears: TDisplayYears
  startMonth?: Date
  endMonth?: Date
  setNavView: React.Dispatch<React.SetStateAction<TNavView>>
  navView: TNavView
} & React.ComponentProps<'div'>

const CalendarContext = createContext<TCalendarContext>({} as TCalendarContext)

const useCalendar = () => useContext(CalendarContext)

const Nav = ({ className, ...props }: TNavProps) => {
  const { navView, startMonth, endMonth, displayYears, setDisplayYears, onPrevClick, onNextClick } = useCalendar()
  const { nextMonth, previousMonth, goToMonth } = useDayPicker()
  const { t } = useTranslation('components', { keyPrefix: 'calendar' })

  const isYearsView = navView === 'years'

  const isPreviousDisabled = isYearsView
    ? (startMonth && differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), startMonth) < 0) ||
      (endMonth && differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), endMonth) > 0)
    : !previousMonth

  const isNextDisabled = isYearsView
    ? (startMonth && differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), startMonth) < 0) ||
      (endMonth && differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), endMonth) > 0)
    : !nextMonth

  const previousButtonLabel = isYearsView
    ? t('previousYearButtonLabel')
    : StringHelper.capitalize(labelPrevious(previousMonth), { preserveRest: false })

  const nextButtonLabel = isYearsView
    ? t('nextYearButtonLabel', { years: displayYears.to - displayYears.from + 1 })
    : StringHelper.capitalize(labelNext(nextMonth), { preserveRest: false })

  const handlePreviousClick = () => {
    if (!previousMonth) return

    if (isYearsView) {
      setDisplayYears(prev => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }))

      onPrevClick?.(new Date(displayYears.from - (displayYears.to - displayYears.from), 0, 1))
      return
    }

    goToMonth(previousMonth)
    onPrevClick?.(previousMonth)
  }

  const handleNextClick = () => {
    if (!nextMonth) return

    if (isYearsView) {
      setDisplayYears(prev => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }))

      onNextClick?.(new Date(displayYears.from + (displayYears.to - displayYears.from), 0, 1))

      return
    }

    goToMonth(nextMonth)
    onNextClick?.(nextMonth)
  }

  return (
    <nav className={StyleHelper.mergeStyles('flex items-start', className)} {...props}>
      <Tooltip title={isPreviousDisabled ? '' : previousButtonLabel}>
        <IconButton
          aria-label={previousButtonLabel}
          type="button"
          className="absolute left-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100 focus:opacity-100"
          size="xs"
          tabIndex={isPreviousDisabled ? undefined : -1}
          disabled={isPreviousDisabled}
          icon={<TbChevronLeft aria-hidden />}
          onClick={handlePreviousClick}
        />
      </Tooltip>

      <Tooltip title={isNextDisabled ? '' : nextButtonLabel}>
        <IconButton
          aria-label={nextButtonLabel}
          type="button"
          className="absolute right-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100 focus:opacity-100"
          size="xs"
          tabIndex={isNextDisabled ? undefined : -1}
          disabled={isNextDisabled}
          icon={<TbChevronRight aria-hidden />}
          onClick={handleNextClick}
        />
      </Tooltip>
    </nav>
  )
}

const CaptionLabel = ({ children, className, ...props }: TCaptionLabelProps) => {
  const { showYearSwitcher, navView, setNavView, displayYears } = useCalendar()

  if (!showYearSwitcher)
    return (
      <span className={StyleHelper.mergeStyles('truncate text-sm font-medium', className)} {...props}>
        {children}
      </span>
    )

  return (
    <Button
      label={
        navView === 'days'
          ? ElementHelper.isTextContentValid(children)
            ? String(children)
            : ''
          : `${displayYears.from} - ${displayYears.to}`
      }
      colorSchema="white"
      variant="text"
      className={StyleHelper.mergeStyles('w-full', className)}
      clickableProps={{ className: 'h-7 ' }}
      onClick={() => setNavView(prev => (prev === 'days' ? 'years' : 'days'))}
    />
  )
}

const MonthGrid = ({ className, children, ...props }: TMonthGridProps) => {
  const { displayYears, startMonth, endMonth, navView, setNavView } = useCalendar()

  if (navView === 'years') {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    )
  }

  return (
    <table className={StyleHelper.mergeStyles('mx-auto mt-4', className)} {...props}>
      {children}
    </table>
  )
}

const YearGrid = ({ className, displayYears, startMonth, endMonth, setNavView, navView, ...props }: TYearGridProps) => {
  const { goToMonth } = useDayPicker()

  return (
    <div className={StyleHelper.mergeStyles('mx-auto mt-4 grid grid-cols-4 gap-y-2', className)} {...props}>
      {Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, index) => {
        const isBefore = differenceInCalendarDays(new Date(displayYears.from + index, 11, 31), startMonth!) < 0

        const isAfter = differenceInCalendarDays(new Date(displayYears.from + index, 0, 0), endMonth!) > 0

        const isDisabled = isBefore || isAfter

        return (
          <Button
            key={`year-${index}`}
            label={(displayYears.from + index).toString()}
            colorSchema="white"
            variant="text"
            aria-selected={displayYears.from + index === new Date().getFullYear()}
            disabled={navView === 'years' ? isDisabled : undefined}
            clickableProps={{ className: 'h-7' }}
            onClick={() => {
              setNavView('days')

              goToMonth(new Date(displayYears.from + index, 0))
            }}
          />
        )
      })}
    </div>
  )
}

export const Calendar = ({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  components,
  startMonth,
  endMonth,
  onNextClick,
  onPrevClick,
  ...props
}: TCalendarProps) => {
  const { language } = useLanguageSelector()
  const [navView, setNavView] = useState<TNavView>('days')

  const [displayYears, setDisplayYears] = useState<TDisplayYears>(() => {
    const currentYear = new Date().getFullYear()

    return {
      from: currentYear - Math.floor(yearRange / 2 - 1),
      to: currentYear + Math.ceil(yearRange / 2),
    }
  })

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  const value = useMemo<TCalendarContext>(
    () => ({
      navView,
      setNavView,
      displayYears,
      setDisplayYears,
      showYearSwitcher,
      startMonth,
      endMonth,
      onPrevClick,
      onNextClick,
    }),
    [navView, displayYears, showYearSwitcher, startMonth, endMonth, onPrevClick, onNextClick]
  )

  return (
    <CalendarContext.Provider value={value}>
      <DayPicker
        locale={DateHelper.dateFnsLocaleByLanguage[language.value]}
        showOutsideDays={showOutsideDays}
        className={StyleHelper.mergeStyles('p-3', className)}
        classNames={{
          months: 'relative flex',
          month_caption: 'relative mx-10 flex h-7 items-center justify-center',
          weekdays: 'flex flex-row',
          weekday: 'w-9 text-sm font-normal text-gray-300',
          month: 'w-full',
          caption: 'relative flex items-center justify-center pt-1',
          week: 'mt-2 flex w-max items-start',
          day: 'flex size-9 flex-1 items-center justify-center p-0 text-sm',
          day_button:
            'text-white enabled:hover:bg-gray-300/15 enabled:cursor-pointer size-8 rounded p-0 font-normal transition-none aria-selected:opacity-100',
          range_start: 'day-range-start rounded bg-neon [&>button]:bg-neon [&>button]:hover:neon [&>button]:hover:neon',
          range_middle:
            'bg-gray-100/10 !text-white [&>button]:!bg-transparent [&>button]:!text-white [&>button]:hover:!bg-transparent [&>button]:hover:!text-white',
          range_end: 'day-range-end rounded bg-neon [&>button]:bg-neon [&>button]:hover:neon [&>button]:hover:neon',
          selected: '[&>button]:!bg-neon [&>button]:!text-asphalt',
          today:
            '[&>button]:bg-gray-300/10 [&>button]:data-[selected=true]:bg-neon [&>button]:data-[selected=true]:[not(:disabled)]:text-asphalt',
          outside: 'day-outside opacity-50',
          disabled: '[&>button]:text-gray-300 !opacity-30',
          hidden: 'invisible flex-1',
        }}
        components={{
          ...components,
          Nav,
          CaptionLabel,
          MonthGrid,
        }}
        numberOfMonths={columnsDisplayed}
        {...props}
      />
    </CalendarContext.Provider>
  )
}
