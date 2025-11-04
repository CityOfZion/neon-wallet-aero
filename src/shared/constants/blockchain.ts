import ArbitrumIcon from '@renderer/assets/blockchain/arbitrum.svg?react'
import BaseIcon from '@renderer/assets/blockchain/base.svg?react'
import EthereumIcon from '@renderer/assets/blockchain/ethereum.svg?react'
import NeoLegacyIcon from '@renderer/assets/blockchain/neo-legacy.svg?react'
import Neo3Icon from '@renderer/assets/blockchain/neo3.svg?react'
import NeoxIcon from '@renderer/assets/blockchain/neox.svg?react'
import PolygonIcon from '@renderer/assets/blockchain/polygon.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

export const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  neo3: Neo3Icon,
  neoLegacy: NeoLegacyIcon,
  ethereum: EthereumIcon,
  neox: NeoxIcon,
  polygon: PolygonIcon,
  base: BaseIcon,
  arbitrum: ArbitrumIcon,
}
