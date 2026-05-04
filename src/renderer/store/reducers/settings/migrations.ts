import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

export const settingsMigrations = {
  0: (state: any) => ({
    ...state,
    data: {
      ...state.data,
      selectedNetworkByBlockchain: {
        ...state.data.selectedNetworkByBlockchain,
        bitcoin: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.bitcoin.defaultNetwork,
        stellar: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar.defaultNetwork,
      },
    },
  }),
}
