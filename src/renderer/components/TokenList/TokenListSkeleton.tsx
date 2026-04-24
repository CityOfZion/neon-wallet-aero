import type { ReactNode } from 'react'

import { Skeleton } from '@renderer/components/Skeleton'

type TProps = {
  isLoading: boolean
  children: ReactNode
}

export const TokenListSkeleton = ({ isLoading, children }: TProps) => (
  <Skeleton.Root
    loading={isLoading}
    className="my-4 flex min-h-0 w-full flex-col gap-y-2"
    items={Array.from({ length: 4 }, () => null).map((_, index) => (
      <Skeleton.Item key={`token-list-skeleton-item-${index}`} className="h-14 rounded-xs" />
    ))}
  >
    {children}
  </Skeleton.Root>
)
