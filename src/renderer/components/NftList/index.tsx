import { useRef } from 'react'
import { hasExplorerService, NftResponse } from '@cityofzion/blockchain-service'
import { useNfts } from '@renderer/hooks/useNfts'
import { useInfiniteScrollVirtualization, useVirtualization } from '@renderer/hooks/useVirtualization'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { IAccountState } from '@shared/types/store'
import { match } from 'ts-pattern'

import { NftListEmpty } from './NftListEmpty'
import { NftListItem } from './NftListItem'
import { NftListSkeleton } from './NftListSkeleton'

type TProps = {
  selectedAccount: IAccountState
}

export const NftList = ({ selectedAccount }: TProps) => {
  const { aggregatedData: nfts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNfts(selectedAccount)

  const getHref = (nft: NftResponse) => {
    try {
      const service = bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
      if (!hasExplorerService(service)) return ''
      return service.explorerService.buildNftUrl({
        tokenHash: nft.hash,
        collectionHash: nft.collection.hash,
      })
    } catch (error) {
      console.error('Error building NFT URL:', { nft, error })
    }

    return ''
  }

  const contentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualization({
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

  return match({ isLoading, nfts })
    .with({ isLoading: true }, () => <NftListSkeleton />)
    .with({ nfts: [] }, () => <NftListEmpty />)
    .otherwise(() => (
      <ul className="flex min-w-0 flex-col gap-1" ref={contentRef}>
        {virtualizer.getVirtualItems().map(virtualItem => {
          const nft = nfts[virtualItem.index]
          const link = getHref(nft)

          return (
            <NftListItem
              key={virtualItem.key}
              nft={nft}
              selectedAccount={selectedAccount}
              link={link}
              virtualItem={virtualItem}
            />
          )
        })}
      </ul>
    ))
}
