import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

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
}
