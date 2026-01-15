import { createListenerMiddleware } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import type { TRootState } from '@shared/types/redux'

import { settingsReducerActions } from '../reducers/settings'

export function getNetworkMiddleware() {
  const networkListenerMiddleware = createListenerMiddleware()

  networkListenerMiddleware.startListening({
    predicate: action =>
      settingsReducerActions.setSelectedNetworkByBlockchain.match(action) ||
      settingsReducerActions.setSelectedNetwork.match(action) ||
      settingsReducerActions.setSelectedNetworkUrl.match(action) ||
      (action.type === REHYDRATE && action.key === 'settingsReducer'),
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState() as TRootState

      const selectedNetworkByBlockchain = state.settings?.data?.selectedNetworkByBlockchain
      if (!selectedNetworkByBlockchain) return

      Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
        service.setNetwork(selectedNetworkByBlockchain[service.name])
      })
    },
  })

  return networkListenerMiddleware.middleware
}
