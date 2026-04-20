import type { TNftResponse } from '@cityofzion/blockchain-service'
import type { VirtualItem } from '@tanstack/react-virtual'

import type { TAccount } from '@shared/types/store'

import { NftListItemContent } from './NftListItemContent'

type TProps = {
  virtualItem: VirtualItem
  nft: TNftResponse
  selectedAccount: TAccount
}

export const NftListItem = ({ virtualItem, nft, selectedAccount }: TProps) => {
  return (
    <li
      className="absolute top-0 left-0 w-full text-sm"
      style={{
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
      }}
    >
      {nft.explorerUri ? (
        <a
          href={nft.explorerUri}
          target="_blank"
          className="flex w-full min-w-0 cursor-pointer items-center gap-4 rounded bg-transparent p-2.5 transition-colors hover:bg-gray-700/60 focus:bg-gray-700/60 active:bg-gray-700/40"
          rel="noreferrer"
        >
          <NftListItemContent selectedAccount={selectedAccount} nft={nft} />
        </a>
      ) : (
        <div className="flex w-full min-w-0 items-center gap-4 rounded bg-gray-700/60 p-2.5">
          <NftListItemContent selectedAccount={selectedAccount} nft={nft} />
        </div>
      )}
    </li>
  )
}
