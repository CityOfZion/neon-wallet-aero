import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { StyleHelper } from '@/helpers/StyleHelper'

import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TContentProps = Pick<TProps, 'data'>

type TProps = {
  data: ReactNode
  label?: string
  url?: string
  className?: string
}

const Content = ({ data }: TContentProps) =>
  typeof data === 'string' || typeof data === 'number' ? (
    <TransactionActivityListTooltip data={data}>
      <span className="inline-block truncate">{data}</span>
    </TransactionActivityListTooltip>
  ) : (
    data
  )

export const TransactionActivityListEventColumn = ({ data, label, url, className }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex max-w-20.5 min-w-20.5 flex-col', className)}>
      {label && <p className="font-medium text-gray-300">{label}</p>}

      {url ? (
        <Link to={url} target="_blank" className="text-neon flex">
          <Content data={data} />
        </Link>
      ) : (
        <span className="flex text-white">
          <Content data={data} />
        </span>
      )}
    </div>
  )
}
