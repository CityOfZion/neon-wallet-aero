import { Skeleton } from '@renderer/components/Skeleton'

export const DappConnectionListSkeleton = () => (
  <Skeleton.Root
    loading
    className="mt-4 flex w-full flex-col gap-y-2"
    items={[
      <Skeleton.Item className="h-10 rounded-xs" />,
      <Skeleton.Item className="h-10 rounded-xs" />,
      <Skeleton.Item className="h-10 rounded-xs" />,
      <Skeleton.Item className="h-10 rounded-xs" />,
    ]}
  />
)
