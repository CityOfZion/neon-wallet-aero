import type { ComponentProps } from 'react'

import type { TCalendarProps } from './Calendar'
import { Calendar } from './Calendar'
import { Popover } from './Popover'

const Root = Popover.Root

const Trigger = Popover.Trigger

type TPickerProps = TCalendarProps & {
  popoverContentProps?: ComponentProps<typeof Popover.Content>
}

const Picker = ({ popoverContentProps, ...props }: TPickerProps) => (
  <Popover.Content className="mx-4 my-2 w-auto max-w-fit min-w-fit bg-gray-800 p-0" {...popoverContentProps}>
    <Calendar {...props} />
  </Popover.Content>
)

export const DatePicker = { Root, Trigger, Picker }
