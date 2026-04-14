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
  link?: string
}

export const NftListItemContent = ({ selectedAccount, nft, link }: TProps) => {
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const [imageError, setImageError] = useState(false)

  return (
    <Fragment>
      <div className="mi-h-[3.5rem] h-[3.5rem] w-[5rem] min-w-[5rem] overflow-hidden rounded-xs bg-gray-300/30">
        {imageError || !nft.image ? (
          <div className="flex size-full items-center justify-center">
            <TbDiamond aria-hidden className="text-neon" />
          </div>
        ) : (
          <img className="size-full object-cover" src={nft.image} alt={nft.name} onError={() => setImageError(true)} />
        )}
      </div>
      <div className="flex min-w-0 flex-grow flex-col gap-2.5">
        <Tooltip
          title={nft.name || ''}
          contentProps={{ className: 'bg-asphalt' }}
          arrowProps={{ className: 'fill-asphalt' }}
          delayDuration={0}
        >
          <span className="w-fit max-w-32 truncate text-white capitalize">{nft.name}</span>
        </Tooltip>

        <div className="flex items-center gap-1.5">
          {nft.collection?.image && (
            <div className="min-size-4 size-4 overflow-hidden rounded-full bg-gray-300/30">
              <img className="size-full object-cover" src={nft.collection.image} alt={nft.collection.name} />
            </div>
          )}

          {(nft.creator?.name || nft.creator?.address) && (
            <p className="-mt-0.5 truncate text-xs text-gray-300 capitalize">
              {nft.creator.name || nft.creator.address}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex w-18 flex-col items-end gap-2.5">
          <Tooltip
            title={nft.hash}
            contentProps={{ className: 'bg-asphalt' }}
            arrowProps={{ className: 'fill-asphalt' }}
            delayDuration={0}
          >
            <p className="text-blue">{StringHelper.truncateMiddle(nft.hash, 8)}</p>
          </Tooltip>

          <div className="flex items-center gap-1.5">
            <BlockchainIcon blockchain={selectedAccount.blockchain} type="gray" className="size-3 opacity-60" />
            <p className="text-xs text-gray-300">{tCommonBlockchain(selectedAccount.blockchain)}</p>
          </div>
        </div>

        {link && <TbChevronRight aria-hidden className="size-6 text-gray-300" />}
      </div>
    </Fragment>
  )
}
