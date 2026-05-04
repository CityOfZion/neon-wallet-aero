import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Skeleton } from '@renderer/components/Skeleton'

export const Neo3VoteSkeleton = () => (
  <div className="flex w-full flex-col gap-y-2">
    <Skeleton.Root
      loading
      className="w-full"
      items={[
        <Skeleton.Item key="neo3-vote-skeleton-item-1" className="h-5 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-2" className="h-11 rounded-xs" />,
      ]}
    />

    <DashedSeparator className="my-2" />

    <Skeleton.Root
      loading
      className="flex flex-col gap-y-2"
      items={[
        <Skeleton.Item key="neo3-vote-skeleton-item-3" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-4" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-5" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-6" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-7" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-8" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-9" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-10" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-11" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-12" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-13" className="h-11 rounded-xs" />,
        <Skeleton.Item key="neo3-vote-skeleton-item-14" className="h-11 rounded-xs" />,
      ]}
    />
  </div>
)
