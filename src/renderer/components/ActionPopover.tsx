import { forwardRef, useState } from 'react'

import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentProps, ComponentPropsWithoutRef, ComponentRef } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import ActionPopoverArrow from '@renderer/assets/images/action-popover-arrow.svg?react'

import { Button } from './Button'
import { Link } from './Link'
import { Separator } from './Separator'

const Root = RadixPopover.Root

const Trigger = RadixPopover.Trigger

type TContentSide = ComponentPropsWithoutRef<typeof RadixPopover.Content>['side']

const sides: TContentSide[] = ['top', 'bottom', 'right', 'left']

type TContentProps = ComponentPropsWithoutRef<typeof RadixPopover.Content> & {
  contentClassName?: string
}

const Content = forwardRef<ComponentRef<typeof RadixPopover.Content>, TContentProps>(
  ({ className, contentClassName, side = 'right', align = 'center', children, ...props }, ref) => {
    const [internalSide, setInternalSide] = useState<TContentSide>(side)

    const isRightSide = internalSide === 'right'
    const isLeftSide = internalSide === 'left'
    const isBottomSide = internalSide === 'bottom'
    const isTopSide = internalSide === 'top'

    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          className={StyleHelper.mergeStyles(
            'group relative z-1010',
            {
              '-right-1': isRightSide,
              '-left-1': isLeftSide,
              '-top-1': isBottomSide,
              '-bottom-1': isTopSide,
            },
            className
          )}
          side={side}
          align={align}
          onOpenAutoFocus={event => {
            const target = event?.currentTarget

            if (target) {
              requestAnimationFrame(() => {
                const nextSide = (target as HTMLElement)?.dataset?.['side'] as TContentSide

                if (!sides.includes(nextSide)) return

                setInternalSide(nextSide)
              })
            }
          }}
          {...props}
        >
          <div
            className={StyleHelper.mergeStyles(
              'border-neon flex flex-col overflow-hidden rounded-sm bg-gray-900/60 backdrop-blur-md',
              {
                'border-r-4': isRightSide,
                'border-l-4': isLeftSide,
                'border-t-4': isBottomSide,
                'border-b-4': isTopSide,
              },
              contentClassName
            )}
          >
            {children}
          </div>

          <RadixPopover.Arrow asChild width={24} height={24} className="text-neon relative -top-px">
            <ActionPopoverArrow aria-hidden viewBox="0 0 24 24" />
          </RadixPopover.Arrow>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    )
  }
)

type TItemProps =
  | ({ actionPopoverItemType?: 'button' } & ComponentProps<typeof Button>)
  | ({ actionPopoverItemType?: 'link' } & ComponentProps<typeof Link>)

const Item = ({ actionPopoverItemType = 'button', clickableProps, ...props }: TItemProps) => {
  const commonProps: any = {
    variant: 'text',
    flat: true,
    className: 'w-full',
    clickableProps: { className: 'rounded-none min-h-8 h-8 max-h-8 px-3 justify-start', ...clickableProps },
  }

  if (actionPopoverItemType === 'button') {
    return (
      <RadixPopover.PopoverClose asChild>
        <Button {...commonProps} {...props} />
      </RadixPopover.PopoverClose>
    )
  }

  return (
    <RadixPopover.PopoverClose asChild>
      <Link {...commonProps} {...props} />
    </RadixPopover.PopoverClose>
  )
}

export const ActionPopover = {
  Root,
  Trigger,
  Content,
  Item,
  Separator,
}
