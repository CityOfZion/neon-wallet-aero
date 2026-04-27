import type { ComponentProps } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = ComponentProps<'div'> & {
  containerClassName?: string
  type?: 'vertical' | 'horizontal'
}

export const Separator = ({ className, containerClassName, type = 'horizontal', ...props }: TProps) => {
  const isHorizontal = type === 'horizontal'

  return (
    <div
      className={StyleHelper.mergeStyles(
        {
          'w-full': isHorizontal,
          'h-full': !isHorizontal,
        },
        containerClassName
      )}
    >
      {isHorizontal ? (
        <div
          className={StyleHelper.mergeStyles('h-px max-h-px min-h-px w-full bg-gray-300/30', className)}
          {...props}
        />
      ) : (
        <div
          className={StyleHelper.mergeStyles('h-full w-px max-w-px min-w-px bg-gray-300/30', className)}
          {...props}
        />
      )}
    </div>
  )
}
