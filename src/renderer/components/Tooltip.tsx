import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = {
  title: string
  icon?: ReactNode
  open?: boolean
  delayDuration?: number
  contentProps?: RadixTooltip.TooltipContentProps
  arrowProps?: RadixTooltip.TooltipArrowProps
  variant?: 'default' | 'black'
  children: ReactNode
}

export const Tooltip = ({
  title,
  icon,
  open,
  delayDuration,
  arrowProps,
  variant = 'default',
  children,
  ...props
}: TProps) => {
  const { className: contentClassName, ...contentProps } = props.contentProps || {}

  const isDefaultVariant = variant === 'default'
  const isBlackVariant = variant === 'black'

  if (!title) return children

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root open={open} delayDuration={delayDuration}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side="bottom"
            className={StyleHelper.mergeStyles(
              'z-1010 mx-2 flex max-w-[86vw] items-center gap-x-2 rounded p-2 text-center text-xs font-bold wrap-break-word text-white shadow-lg',
              {
                'bg-gray-700': isDefaultVariant,
                'bg-gray-900': isBlackVariant,
              },
              contentClassName
            )}
            {...contentProps}
          >
            {icon}
            <span className="block">{title}</span>
            <RadixTooltip.Arrow
              className={StyleHelper.mergeStyles(
                { 'fill-gray-700': isDefaultVariant, 'fill-gray-900': isBlackVariant },
                arrowProps?.className
              )}
              {...arrowProps}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
