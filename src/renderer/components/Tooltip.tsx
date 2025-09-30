import { ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = {
  title: string
  icon?: ReactNode
  open?: boolean
  delayDuration?: number
  contentProps?: RadixTooltip.TooltipContentProps
  arrowProps?: RadixTooltip.TooltipArrowProps
  children: ReactNode
}

export const Tooltip = ({ title, icon, open, delayDuration, arrowProps, children, ...props }: TProps) => {
  const { className: contentClassName, ...contentProps } = props.contentProps ?? {}

  if (!title) return children

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root open={open} delayDuration={delayDuration}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side="bottom"
            className={StyleHelper.mergeStyles(
              'z-[1010] flex items-center gap-x-2 rounded bg-gray-700 p-2 text-xs font-bold text-white shadow-lg',
              contentClassName
            )}
            {...contentProps}
          >
            {icon}
            {title}
            <RadixTooltip.Arrow
              className={StyleHelper.mergeStyles('fill-gray-700', arrowProps?.className)}
              {...arrowProps}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
