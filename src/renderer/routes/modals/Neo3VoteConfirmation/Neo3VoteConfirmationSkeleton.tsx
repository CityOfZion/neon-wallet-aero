import type { ReactNode } from 'react'

import { Skeleton } from '@renderer/components/Skeleton'

type TProps = {
  isLoading: boolean
  children: ReactNode
}

export const Neo3VoteConfirmationSkeleton = ({ isLoading, children }: TProps) => (
  <Skeleton.Root
    loading={isLoading}
    className="flex w-full flex-col gap-y-2.5"
    items={[
      <Skeleton.Item key="neo3-vote-confirmation-skeleton-item-1" className="h-66 w-full" />,
      <Skeleton.Item key="neo3-vote-confirmation-skeleton-item-2" className="h-15 w-full" />,
    ]}
  >
    {children}
  </Skeleton.Root>
)
