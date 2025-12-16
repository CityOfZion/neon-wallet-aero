import { Skeleton } from '@renderer/components/Skeleton'

export const DappConnectionListSkeleton = () => (
  <Skeleton.Root
    loading
    className="mt-4 flex w-full flex-col gap-y-2"
    items={new Array(4).fill(null).map((_, index) => (
      <Skeleton.Item key={`dapp-connection-list-skeleton-item-${index}`} className="h-10 rounded-xs" />
    ))}
  />
)
