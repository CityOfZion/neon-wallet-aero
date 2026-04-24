import { Skeleton } from '@renderer/components/Skeleton'

export const TransactionActivityListSkeleton = () => (
  <div className="flex w-full flex-col gap-y-4 py-2">
    {new Array(4).fill(null).map((_, index) => (
      <Skeleton.Root
        key={`skeleton-${index}`}
        loading
        className="flex flex-col gap-y-2"
        items={[
          <Skeleton.Item className="h-10 rounded-xs" />,
          <Skeleton.Item className="h-8.5 rounded-xs" />,
          <Skeleton.Item className="h-13.25 rounded-xs" />,
          <Skeleton.Item className="h-13.25 rounded-xs" />,
        ]}
      />
    ))}
  </div>
)
