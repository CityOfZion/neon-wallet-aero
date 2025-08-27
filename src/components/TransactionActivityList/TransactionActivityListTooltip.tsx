import { ReactNode } from 'react'

import { Tooltip } from '@/components/Tooltip'
import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  data: string | number
  children: ReactNode
  className?: string
}

export const TransactionActivityListTooltip = ({ data, className, children }: TProps) => (
  <Tooltip
    title={data.toString()}
    delayDuration={0}
    contentProps={{
      className: StyleHelper.mergeStyles('text-center inline-block max-w-44 break-words', className),
    }}
  >
    {children}
  </Tooltip>
)
