import type { TCalendarProps } from './Calendar'
import { Calendar } from './Calendar'
import type { TPopoverContentProps } from './Popover'
import { Popover } from './Popover'

const Root = Popover.Root

const Trigger = Popover.Trigger

type TPickerProps = TCalendarProps & {
  popoverContentProps?: TPopoverContentProps
}

const Picker = ({ popoverContentProps, ...props }: TPickerProps) => (
  <Popover.Content className="mx-4 my-2 w-auto max-w-fit min-w-fit bg-gray-800 p-0" {...popoverContentProps}>
    <Calendar {...props} />
  </Popover.Content>
)

export const DatePicker = { Root, Trigger, Picker }
