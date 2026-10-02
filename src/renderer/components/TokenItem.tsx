import type { TBSToken } from '@cityofzion/blockchain-service'

import { StringHelper } from '@renderer/helpers/StringHelper'

import { ConstantsURLHelper } from '@shared/helpers/ConstantsURLHelper'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import { ImageWithFallback } from './ImageWithFallback'
import { Tooltip } from './Tooltip'

type TProps = {
  blockchain: TBlockchainServiceKey
  token: TBSToken
}

export const TokenItem = ({ blockchain, token }: TProps) => (
  <span className="flex size-full min-w-0 items-center text-sm whitespace-pre-wrap text-white">
    <ImageWithFallback
      src={`${ConstantsURLHelper.neonIconsUrl}/tokens/${blockchain}/${token.hash}.png`}
      fallbackSrc={`${ConstantsURLHelper.neonIconsUrl}/tokens/default-token.png`}
      alt={token.name || token.symbol}
      containerClassName="mr-2 size-4.5"
      className="rounded-full"
    />
    {token.symbol || token.name}
    <Tooltip title={token.hash} contentProps={{ className: 'wrap-anywhere' }}>
      <span className="text-gray-100">{` - ${StringHelper.truncateMiddle(token.hash, 16)}`}</span>
    </Tooltip>
  </span>
)
