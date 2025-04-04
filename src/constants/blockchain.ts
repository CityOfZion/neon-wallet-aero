import { TBlockchainServiceKey } from '@/types/blockchain'

import ArbitrumIcon from '@/assets/blockchain/arbitrum.svg?react'
import BaseIcon from '@/assets/blockchain/base.svg?react'
import EthereumIcon from '@/assets/blockchain/ethereum.svg?react'
import NeoLegacyIcon from '@/assets/blockchain/neo-legacy.svg?react'
import Neo3Icon from '@/assets/blockchain/neo3.svg?react'
import NeoxIcon from '@/assets/blockchain/neox.svg?react'
import PolygonIcon from '@/assets/blockchain/polygon.svg?react'

export const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  neo3: Neo3Icon,
  neoLegacy: NeoLegacyIcon,
  ethereum: EthereumIcon,
  neox: NeoxIcon,
  polygon: PolygonIcon,
  base: BaseIcon,
  arbitrum: ArbitrumIcon,
}
