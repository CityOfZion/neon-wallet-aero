import { useRef } from 'react'

import { match } from 'ts-pattern'

import { useNfts } from '@renderer/hooks/useNfts'
import { useInfiniteScrollVirtualization, useVirtualization } from '@renderer/hooks/useVirtualization'

import type { TAccount } from '@shared/types/store'

import { NftListEmpty } from './NftListEmpty'
import { NftListItem } from './NftListItem'
import { NftListSkeleton } from './NftListSkeleton'

type TProps = {
  selectedAccount: TAccount
}

export const NftList = ({ selectedAccount }: TProps) => {
  const { aggregatedData: nfts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNfts(selectedAccount)

  const contentRef = useRef<HTMLUListElement>(null)

  const { virtualizer } = useVirtualization({
    contentRef,
    count: nfts.length,
    estimateSize: () => 76,
    gap: 8,
    overscan: 5,
  })

  useInfiniteScrollVirtualization({
    virtualizer,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: nfts,
  })

  return (
    <div className="mt-6 mb-4">
      {match({ isLoading, nfts })
        .with({ isLoading: true }, () => <NftListSkeleton />)
        .with({ nfts: [] }, () => <NftListEmpty />)
        .otherwise(() => (
          <div className="pt-2">
            <ul className="flex min-w-0 flex-col" ref={contentRef}>
              {virtualizer.getVirtualItems().map(virtualItem => {
                const nft = nfts[virtualItem.index]

                return (
                  <NftListItem
                    key={virtualItem.key}
                    virtualItem={virtualItem}
                    nft={nft}
                    selectedAccount={selectedAccount}
                  />
                )
              })}
            </ul>
          </div>
        ))}
    </div>
  )
}
