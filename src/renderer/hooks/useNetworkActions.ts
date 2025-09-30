import { useCallback } from 'react'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { settingsReducerActions } from '@renderer/store/reducers/SettingsReducer'
import { TBlockchainServiceKey, TNetwork } from '@shared/types/blockchain'

import { useAppDispatch } from './useRedux'

export const useNetworkActions = () => {
  const dispatch = useAppDispatch()
  const { sessions, disconnect } = useWalletConnectWallet()

  const setNetwork = useCallback(
    async (blockchain: TBlockchainServiceKey, network: TNetwork<TBlockchainServiceKey>) => {
      await Promise.allSettled(sessions.map(session => disconnect(session)))

      dispatch(settingsReducerActions.setSelectedNetwork({ blockchain, network }))
    },
    [disconnect, dispatch, sessions]
  )

  const setNetworkNode = useCallback(
    (blockchain: TBlockchainServiceKey, url: string, isAutomatic?: boolean) => {
      dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain, url, isAutomatic }))
    },
    [dispatch]
  )

  return {
    setNetwork,
    setNetworkNode,
  }
}
