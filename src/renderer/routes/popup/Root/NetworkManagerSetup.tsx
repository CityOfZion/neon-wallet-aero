import isEqual from 'lodash/isEqual'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useLazyPingNetworks } from '@renderer/hooks/usePingNetworks'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import { settingsReducerActions } from '@renderer/store/reducers/settings'

const NetworkManager = () => {
  const dispatch = useAppDispatch()
  const { getPingNetworks } = useLazyPingNetworks()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  useMountUnsafe(async () => {
    const services = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

    const updatedNetworks = { ...selectedNetworkByBlockchain }

    const promises = services.map(async service => {
      const currentNetwork = updatedNetworks[service.name]

      try {
        await service.pingNetwork(currentNetwork.url)
      } catch {
        const [newNetwork] = await getPingNetworks(service.name)

        if (!newNetwork) return

        updatedNetworks[service.name] = {
          ...currentNetwork,
          url: newNetwork.url,
        }
      }
    })

    await Promise.allSettled(promises)

    if (!isEqual(updatedNetworks, selectedNetworkByBlockchain)) {
      dispatch(settingsReducerActions.setSelectedNetworkByBlockchain(updatedNetworks))
    }
  })

  return null
}

export default NetworkManager
