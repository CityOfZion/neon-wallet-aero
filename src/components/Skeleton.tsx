import { ComponentProps } from 'react'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  loading?: boolean
  items: React.JSX.Element[] | React.JSX.Element
} & ComponentProps<'div'>

export const Item = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={StyleHelper.mergeStyles('h-4 w-full rounded-lg bg-gray-300/15', className)} {...props} />
}

const Root = ({ loading, className, children, items, ...props }: TProps) => {
  if (loading) {
    return (
      <div role="status" className={StyleHelper.mergeStyles('flex animate-pulse flex-col gap-1', className)} {...props}>
        {items}
      </div>
    )
  }

  return children
}

export const Skeleton = { Root, Item }
