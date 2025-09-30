import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import * as RadixRadio from '@radix-ui/react-radio-group'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { Separator } from './Separator'

type ItemProps = ComponentPropsWithoutRef<typeof RadixRadio.Item> & {
  withSeparator?: boolean
  separatorClassName?: string
}

const Group = forwardRef<ComponentRef<typeof RadixRadio.Root>, ComponentPropsWithoutRef<typeof RadixRadio.Root>>(
  (props, ref) => <RadixRadio.Root {...props} ref={ref} />
)

const Item = forwardRef<ComponentRef<typeof RadixRadio.Item>, ItemProps>(
  ({ className, separatorClassName, withSeparator = true, children, ...props }, ref) => (
    <RadixRadio.Item
      {...props}
      ref={ref}
      className={StyleHelper.mergeStyles(
        'group hover:bg-asphalt flex h-11 w-full cursor-pointer flex-col bg-transparent transition-colors',
        className
      )}
    >
      <div className="flex h-full w-full flex-row items-center justify-between gap-x-3 gap-y-1 px-3">{children}</div>

      {withSeparator && <Separator containerClassName={StyleHelper.mergeStyles('w-full', separatorClassName)} />}
    </RadixRadio.Item>
  )
)

const Indicator = forwardRef<
  ComponentRef<typeof RadixRadio.Indicator>,
  ComponentPropsWithoutRef<typeof RadixRadio.Indicator>
>(({ className, ...props }, ref) => (
  <div className="group-data-[state=checked]:border-neon h-4 min-h-4 w-4 min-w-4 cursor-pointer rounded-full border-2 bg-transparent outline-none group-data-[state=unchecked]:border-gray-300">
    <RadixRadio.Indicator
      {...props}
      ref={ref}
      className={StyleHelper.mergeStyles(
        "after:bg-neon relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-[50%] after:content-['']",
        className
      )}
    />
  </div>
))

export const Radio = { Group, Item, Indicator }
