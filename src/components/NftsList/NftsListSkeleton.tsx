import { Skeleton } from '@/components/Skeleton'

export const NftsListSkeleton = () => (
  <div className="mb-4 flex min-h-0 w-full flex-col gap-y-4 overflow-y-auto">
    {new Array(4).fill(null).map((_, index) => (
      <Skeleton.Root loading key={`skeleton-${index}`} items={<Skeleton.Item className="h-19 rounded-xs" />} />
    ))}
  </div>
)
