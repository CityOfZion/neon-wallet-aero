import { useTranslation } from 'react-i18next'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

export const NetworkBanner = () => {
  const { t } = useTranslation('components', { keyPrefix: 'networkBanner' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const isTestnetSelected = Object.values(selectedNetworkByBlockchain).some(network => network.type === 'testnet')

  if (!isTestnetSelected) return null

  return (
    <div className="border-purple absolute top-0 left-0 z-50 flex w-full justify-center border-t-3">
      <div className="absolute flex justify-center">
        <div className="before:shadow-purple relative h-4.5 w-4.5 overflow-hidden before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:rounded-[50%] before:shadow-[0.563rem_-0.563rem_0_0] before:content-['']" />
        <p className="bg-purple text-1xs block max-w-50 truncate rounded-b-md px-2.5 py-0 tracking-wide text-white uppercase">
          {t('testnetLabel')}
        </p>
        <div className="before:shadow-purple relative h-4.5 w-4.5 overflow-hidden before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:rounded-[50%] before:shadow-[-0.563rem_-0.563rem_0_0] before:content-['']" />
      </div>
    </div>
  )
}

export default NetworkBanner
