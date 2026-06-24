import { useEffect } from 'react'

import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

type TNetworkBannerBaseProps = ComponentProps<'div'> & {
  label: ReactNode
  cornerClassName?: string
  labelClassName?: string
}

const NetworkBannerBase = ({
  label,
  className,
  cornerClassName,
  labelClassName,
  ...props
}: TNetworkBannerBaseProps) => (
  <div
    className={StyleHelper.mergeStyles('fixed top-0 left-0 z-50 flex w-full justify-center border-t-3', className)}
    {...props}
  >
    <div
      className={StyleHelper.mergeStyles(
        "relative size-4.5 overflow-hidden before:absolute before:top-0 before:left-0 before:block before:size-full before:rounded-[50%] before:shadow-[0.563rem_-0.563rem_0_0] before:content-['']",
        cornerClassName
      )}
    />
    <p
      className={StyleHelper.mergeStyles(
        'text-1xs block max-w-50 truncate rounded-b-md px-2.5 py-0 tracking-wide text-white uppercase',
        labelClassName
      )}
    >
      {label}
    </p>
    <div
      className={StyleHelper.mergeStyles(
        "relative size-4.5 overflow-hidden before:absolute before:top-0 before:left-0 before:block before:size-full before:rounded-[50%] before:shadow-[-0.563rem_-0.563rem_0_0] before:content-['']",
        cornerClassName
      )}
    />
  </div>
)

export const NetworkBanner = () => {
  const { t } = useTranslation('components', { keyPrefix: 'networkBanner' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { pathname } = useLocation()

  const networks = Object.values(selectedNetworkByBlockchain)
  const hasCustom = networks.some(network => network.type === 'custom')
  const hasTestnet = networks.some(network => network.type === 'testnet')
  const isVisible = hasCustom || hasTestnet

  useEffect(() => {
    const element = document.getElementById('screen-layout-container')

    if (element) element.style.paddingTop = isVisible ? '2rem' : ''
  }, [isVisible, pathname])

  if (!isVisible) return null

  if (hasCustom && hasTestnet) {
    return (
      <NetworkBannerBase
        label={t('testnetCustomLabel')}
        className="border-orange"
        cornerClassName="before:shadow-orange"
        labelClassName="bg-orange"
      />
    )
  }

  if (hasCustom) {
    return (
      <NetworkBannerBase
        label={t('customLabel')}
        className="border-pink"
        cornerClassName="before:shadow-pink"
        labelClassName="bg-pink"
      />
    )
  }

  return (
    <NetworkBannerBase
      label={t('testnetLabel')}
      className="border-purple"
      cornerClassName="before:shadow-purple"
      labelClassName="bg-purple"
    />
  )
}
