import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Skeleton } from '@renderer/components/Skeleton'

export const VoteNeo3Skeleton = () => (
  <div className="flex w-full flex-col gap-y-2">
    <Skeleton.Root
      loading
      className="w-full"
      items={[<Skeleton.Item className="h-5 rounded-xs" />, <Skeleton.Item className="h-11 rounded-xs" />]}
    />

    <DashedSeparator className="my-2" />

    <Skeleton.Root
      loading
      className="flex flex-col gap-y-2"
      items={[
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
        <Skeleton.Item className="h-11 rounded-xs" />,
      ]}
    />
  </div>
)
