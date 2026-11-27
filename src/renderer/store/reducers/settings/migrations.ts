import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { NetworkHelper } from '@renderer/helpers/NetworkHelper'

export const settingsMigrations = {
  0: (state: any) => ({
    ...state,
    data: {
      ...state.data,
      selectedNetworkByBlockchain: {
        ...state.data.selectedNetworkByBlockchain,
        ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
        polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        bitcoin: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.bitcoin.defaultNetwork,
        stellar: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar.defaultNetwork,
      },
    },
  }),
  1: (state: any) => ({
    ...state,
    data: {
      ...state.data,
      customNetworks: {
        neo3: [],
        neoLegacy: [],
        ethereum: [],
        neox: [],
        bitcoin: [],
        polygon: [],
        base: [],
        arbitrum: [],
        solana: [],
        stellar: [],
      },
    },
  }),
  2: (state: any) => ({
    ...state,
    data: {
      ...state.data,
      customNetworks: {
        ...state.data.customNetworks,
        neo3: [NetworkHelper.defaultCozNeo3CustomNetwork, ...(state.data.customNetworks?.neo3 || [])],
      },
      selectedNetworkByBlockchain: {
        ...state.data.selectedNetworkByBlockchain,
        bitcoin: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.bitcoin.defaultNetwork,
      },
    },
  }),
}
