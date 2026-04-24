import type { ComponentProps } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = ComponentProps<'div'> & {
  containerClassName?: string
}

export const Separator = ({ className, containerClassName, ...props }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('w-full', containerClassName)}>
      <div className={StyleHelper.mergeStyles('h-px min-h-px w-full bg-gray-300/30', className)} {...props} />
    </div>
  )
}
