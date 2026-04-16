import React from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import ArbitrumIcon from '@renderer/assets/images/blockchains/arbitrum.svg?react'
import BaseIcon from '@renderer/assets/images/blockchains/base.svg?react'
import EthereumIcon from '@renderer/assets/images/blockchains/ethereum.svg?react'
import NeoLegacyIcon from '@renderer/assets/images/blockchains/neo-legacy.svg?react'
import Neo3Icon from '@renderer/assets/images/blockchains/neo3.svg?react'
import NeoxIcon from '@renderer/assets/images/blockchains/neox.svg?react'
import PolygonIcon from '@renderer/assets/images/blockchains/polygon.svg?react'
import SolanaIcon from '@renderer/assets/images/blockchains/solana.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

type Props = React.SVGProps<SVGSVGElement> & {
  blockchain: TBlockchainServiceKey
}

const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  neo3: Neo3Icon,
  neoLegacy: NeoLegacyIcon,
  ethereum: EthereumIcon,
  neox: NeoxIcon,
  polygon: PolygonIcon,
  base: BaseIcon,
  arbitrum: ArbitrumIcon,
  solana: SolanaIcon,
}

export const BlockchainIcon = React.memo(({ blockchain, ...props }: Props) => {
  const Component = ICONS_BY_BLOCKCHAIN[blockchain]

  return (
    <Component {...props} className={StyleHelper.mergeStyles('size-4 object-contain text-gray-100', props.className)} />
  )
})
