import { Skeleton } from '@renderer/components/Skeleton'

export const NftListSkeleton = () => (
  <div className="mb-4 flex min-h-0 w-full flex-col gap-y-4 overflow-y-auto">
    {new Array(4).fill(null).map((_, index) => (
      <Skeleton.Root loading key={`skeleton-${index}`} items={<Skeleton.Item className="h-18 rounded-xs" />} />
    ))}
  </div>
)
