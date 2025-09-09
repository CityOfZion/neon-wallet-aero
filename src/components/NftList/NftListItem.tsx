import { NftResponse } from '@cityofzion/blockchain-service'
import { VirtualItem } from '@tanstack/react-virtual'

import { IAccountState } from '@/types/store'

import { NftListItemContent } from './NftListItemContent'

type TProps = {
  nft: NftResponse
  selectedAccount: IAccountState
  link: string
  virtualItem: VirtualItem
}

export const NftListItem = ({ nft, selectedAccount, link, virtualItem }: TProps) => {
  return (
    <li
      key={virtualItem.key}
      className="absolute top-0 left-0 w-full"
      style={{
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
      }}
    >
      {link ? (
        <a
          href={link}
          target="_blank"
          className="flex w-full min-w-0 cursor-pointer items-center gap-5 rounded-md bg-gray-900 p-2.5 text-sm transition-colors hover:bg-gray-700/60"
          rel="noreferrer"
        >
          <NftListItemContent selectedAccount={selectedAccount} nft={nft} link={link} />
        </a>
      ) : (
        <div className="flex w-full min-w-0 items-center gap-5 rounded-md bg-gray-700/60 p-2.5 text-sm">
          <NftListItemContent selectedAccount={selectedAccount} nft={nft} link={link} />
        </div>
      )}
    </li>
  )
}
