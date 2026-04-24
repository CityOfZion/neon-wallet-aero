import { Skeleton } from '@renderer/components/Skeleton'

export const NftListSkeleton = () => (
  <Skeleton.Root
    loading
    className="flex flex-col gap-y-2"
    items={[
      <Skeleton.Item className="h-18 rounded-xs" />,
      <Skeleton.Item className="h-18 rounded-xs" />,
      <Skeleton.Item className="h-18 rounded-xs" />,
      <Skeleton.Item className="h-18 rounded-xs" />,
    ]}
  />
)
