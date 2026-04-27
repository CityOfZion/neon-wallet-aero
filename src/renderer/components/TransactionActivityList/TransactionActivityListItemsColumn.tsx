import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ElementHelper } from '@renderer/helpers/ElementHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TContentProps = Pick<TProps, 'data'>

type TProps = {
  data: ReactNode
  label?: string
  url?: string
  className?: string
  labelClassName?: string
}

const Content = ({ data }: TContentProps) =>
  ElementHelper.isTextContentValid(data) ? (
    <TransactionActivityListTooltip data={data}>
      <span className="inline-block truncate">{data}</span>
    </TransactionActivityListTooltip>
  ) : (
    data
  )

export const TransactionActivityListItemsColumn = ({ data, label, url, className, labelClassName }: TProps) => (
  <div className={StyleHelper.mergeStyles('flex w-20.5 max-w-20.5 min-w-20.5 flex-col', className)}>
    {label && <p className={StyleHelper.mergeStyles('font-medium text-gray-300', labelClassName)}>{label}</p>}

    {url ? (
      <Link to={url} target="_blank" className="text-neon flex max-w-fit">
        <Content data={data} />
      </Link>
    ) : (
      <span className="flex max-w-fit text-white">
        <Content data={data} />
      </span>
    )}
  </div>
)
