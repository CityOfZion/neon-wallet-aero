import { type ComponentProps } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = ComponentProps<'div'> & {
  enabled?: boolean
}

export const BorderLoader = ({ className, children, enabled, ...props }: TProps) => {
  return (
    <div
      className={StyleHelper.mergeStyles(
        'relative flex w-fit items-center justify-center overflow-hidden rounded-sm p-0.5',
        "transition-all before:absolute before:block before:aspect-square before:w-[120%] before:animate-spin before:bg-[conic-gradient(from_0deg_at_50%_50%,#47BEFF_0%,#47BEFF00_100%)] before:opacity-0 before:content-['']",
        {
          'before:opacity-100': enabled,
        },
        className
      )}
      {...props}
    >
      <div className={StyleHelper.mergeStyles('relative z-1 w-full rounded-sm bg-gray-800')}>{children}</div>
    </div>
  )
}
