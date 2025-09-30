import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NftResponse } from '@cityofzion/blockchain-service'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { IAccountState } from '@shared/types/store'

import { BlockchainIcon } from '../BlockchainIcon'
import { Tooltip } from '../Tooltip'

import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'

type TProps = {
  selectedAccount: IAccountState
  nft: NftResponse
  link: string
}

export const NftListItemContent = ({ selectedAccount, nft, link }: TProps) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'blockchain' })
  const [imageError, setImageError] = useState(false)

  return (
    <Fragment>
      <div className="mi-h-[3.5rem] h-[3.5rem] w-[5rem] min-w-[5rem] overflow-hidden rounded-xs bg-gray-300/30">
        {imageError || !nft.image ? (
          <div className="flex h-full w-full items-center justify-center">
            <TbDiamond aria-hidden className="text-neon" />
          </div>
        ) : (
          <img
            className="h-full w-full object-cover"
            src={nft.image}
            alt={nft.name}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-grow flex-col gap-2.5">
        <Tooltip
          title={nft.name ?? ''}
          contentProps={{ className: 'bg-asphalt' }}
          arrowProps={{ className: 'fill-asphalt' }}
          delayDuration={0}
        >
          <span className="w-fit max-w-32 truncate text-white capitalize">{nft.name}</span>
        </Tooltip>

        <div className="flex items-center gap-1.5">
          {nft.collection?.image && (
            <div className="h-[1rem] min-h-[1rem] w-[1rem] min-w-[1rem] overflow-hidden rounded-full bg-gray-300/30">
              <img className="h-full w-full object-cover" src={nft.collection.image} alt={nft.collection.name} />
            </div>
          )}

          <p className="-mt-0.5 truncate text-xs text-gray-300 capitalize">{nft.creator.name ?? nft.creator.address}</p>
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
            <BlockchainIcon blockchain={selectedAccount.blockchain} type="gray" className="h-3 w-3 opacity-60" />
            <p className="text-xs text-gray-300">{tCommon(selectedAccount.blockchain)}</p>
          </div>
        </div>

        {link && <TbChevronRight aria-hidden={true} className="h-6 w-6 text-gray-300" />}
      </div>
    </Fragment>
  )
}
