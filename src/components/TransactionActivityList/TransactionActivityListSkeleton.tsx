import { Skeleton } from '@/components/Skeleton'

export const TransactionActivityListSkeleton = () => (
  <div className="flex min-h-0 w-full flex-col gap-y-6 overflow-y-auto py-4">
    {new Array(3).fill(null).map((_, index) => (
      <Skeleton.Root
        loading
        key={`skeleton-${index}`}
        items={
          <div className="flex flex-col gap-y-3">
            <Skeleton.Item className="h-10 rounded-xs" />

            <div className="flex flex-col gap-y-2">
              <Skeleton.Item className="h-[3.3125rem] rounded-xs" />
              <Skeleton.Item className="h-[3.3125rem] rounded-xs" />
            </div>
          </div>
        }
      />
    ))}
  </div>
)
