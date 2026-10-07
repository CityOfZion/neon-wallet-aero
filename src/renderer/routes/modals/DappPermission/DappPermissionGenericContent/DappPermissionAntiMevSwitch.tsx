import { useState } from 'react'

import { BSNeoXConstants } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'

import { Switch } from '@renderer/components/Switch'

import { NetworkHelper } from '@renderer/helpers/NetworkHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
}

export const DappPermissionAntiMevSwitch = ({ blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { network } = useSelectedNetworkSelector(blockchain)
  const dispatch = useAppDispatch()

  const [isChecked, setIsChecked] = useState(
    NetworkHelper.isNeoxAntiMev({ blockchain, networkId: network.id, url: network.url })
  )

  if (blockchain !== 'neox') return null

  const handleAntiMevChange = (checked: boolean) => {
    const rpcUrls: string[] =
      BSNeoXConstants.RPC_LIST_BY_NETWORK_ID[network.id as keyof typeof BSNeoXConstants.RPC_LIST_BY_NETWORK_ID] ?? []

    let url: string | undefined

    if (checked) {
      url = rpcUrls.find(rpcUrl => NetworkHelper.isNeoxAntiMev({ blockchain, networkId: network.id, url: rpcUrl }))
    } else {
      url = rpcUrls.find(rpcUrl => !NetworkHelper.isNeoxAntiMev({ blockchain, networkId: network.id, url: rpcUrl }))
    }

    if (!url) {
      ToastHelper.error({
        message: checked ? t('antiMevEnableUrlNotFoundError') : t('antiMevDisableUrlNotFoundError'),
      })
      return
    }

    setIsChecked(checked)
    dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain, url, isAutomatic: false }))
  }

  return (
    <Switch.Root>
      <Switch.Label>{t('antiMevSwitchLabel')}</Switch.Label>
      <Switch.Control checked={isChecked} onCheckedChange={handleAntiMevChange} className="bg-gray-700" />
    </Switch.Root>
  )
}
