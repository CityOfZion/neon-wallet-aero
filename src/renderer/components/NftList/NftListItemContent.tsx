import { Fragment, useState } from 'react'

import type { TNftResponse } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { StringHelper } from '@renderer/helpers/StringHelper'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'

import type { TAccount } from '@shared/types/store'

import { BlockchainIcon } from '../BlockchainIcon'
import { Tooltip } from '../Tooltip'

type TProps = {
  selectedAccount: TAccount
  nft: TNftResponse
}

export const NftListItemContent = ({ selectedAccount, nft }: TProps) => {
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const [imageError, setImageError] = useState(false)

  return (
    <Fragment>
      <div className="h-14 max-h-14 min-h-14 w-20 max-w-20 min-w-20 overflow-hidden rounded-xs bg-gray-300/30">
        {imageError || !nft.image ? (
          <div className="flex size-full items-center justify-center">
            <TbDiamond aria-hidden className="text-neon" />
          </div>
        ) : (
          <img
            className="pointer-events-none size-full object-cover"
            src={nft.image}
            alt={nft.name}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex h-11.5 min-w-0 grow flex-col justify-between gap-2">
        {nft.name && (
          <Tooltip
            title={nft.name}
            contentProps={{ className: 'bg-asphalt' }}
            arrowProps={{ className: 'fill-asphalt' }}
            delayDuration={0}
          >
            <span className="w-fit max-w-32 truncate text-white">{nft.name}</span>
          </Tooltip>
        )}

        {(nft.collection?.image || nft.creator?.name || nft.creator?.address) && (
          <div className="flex items-center gap-1">
            {nft.collection?.image && (
              <div className="min-size-4 size-4 overflow-hidden rounded-full bg-gray-300/30">
                <img
                  className="pointer-events-none size-full object-cover"
                  src={nft.collection.image}
                  alt={nft.collection.name}
                />
              </div>
            )}

            {(nft.creator?.name || nft.creator?.address) && (
              <p className="-mt-0.5 truncate text-xs text-gray-300">{nft.creator.name || nft.creator.address}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex h-11.5 items-center gap-4">
        <div className="flex h-full flex-col items-end justify-between gap-2">
          <Tooltip
            title={nft.hash}
            contentProps={{ className: 'bg-asphalt' }}
            arrowProps={{ className: 'fill-asphalt' }}
            delayDuration={0}
          >
            <p className="text-blue max-w-18 truncate">{StringHelper.truncateMiddle(nft.hash, 8)}</p>
          </Tooltip>

          <div className="flex items-center gap-1">
            <BlockchainIcon blockchain={selectedAccount.blockchain} className="size-3 text-gray-300" />
            <p className="max-w-18 truncate text-xs text-gray-300">{tCommonBlockchain(selectedAccount.blockchain)}</p>
          </div>
        </div>

        {nft.explorerUri && <TbChevronRight aria-hidden className="size-6 text-gray-300" />}
      </div>
    </Fragment>
  )
}
