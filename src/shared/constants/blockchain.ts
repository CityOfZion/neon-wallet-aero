import { TBSToken } from '@cityofzion/blockchain-service'
import { BSNeoLegacyConstants } from '@cityofzion/bs-neo-legacy'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { TBlockchainServiceKey } from '@shared/types/blockchain'

import ArbitrumIcon from '@renderer/assets/blockchain/arbitrum.svg?react'
import BaseIcon from '@renderer/assets/blockchain/base.svg?react'
import EthereumIcon from '@renderer/assets/blockchain/ethereum.svg?react'
import NeoLegacyIcon from '@renderer/assets/blockchain/neo-legacy.svg?react'
import Neo3Icon from '@renderer/assets/blockchain/neo3.svg?react'
import NeoxIcon from '@renderer/assets/blockchain/neox.svg?react'
import PolygonIcon from '@renderer/assets/blockchain/polygon.svg?react'

export const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  neo3: Neo3Icon,
  neoLegacy: NeoLegacyIcon,
  ethereum: EthereumIcon,
  neox: NeoxIcon,
  polygon: PolygonIcon,
  base: BaseIcon,
  arbitrum: ArbitrumIcon,
}

export const TIP_CONFIG_BY_BLOCKCHAIN: Partial<
  Record<TBlockchainServiceKey, { token: TBSToken; address: string; min: number }>
> = {
  neo3: {
    address: 'Na6zQi9giUtftPGbLeFn9nfuWjEMP98Trq',
    min: 0.00000001,
    token: BSNeo3Constants.GAS_TOKEN,
  },
  neoLegacy: {
    address: 'AZPLskUGhR5j7kT9T4ioMG2frzuLwxBw3p',
    min: 0.00000001,
    token: BSNeoLegacyConstants.GAS_ASSET,
  },
}
