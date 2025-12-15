import { cloneElement } from 'react'

import { motion } from 'motion/react'
import type { ComponentProps, JSX, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'
import { NetworkBanner } from '@renderer/components/NetworkBanner'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useRemoveOverflowShift } from '@renderer/hooks/useRemoveOverflowShift'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

export type TMainLayoutProps = {
  children?: ReactNode
  heading?: string
  icon?: JSX.Element
  rightComponent?: JSX.Element
  leftComponent?: JSX.Element
  contentClassName?: string
  headerClassName?: string
  withBackButton?: boolean
} & ComponentProps<typeof motion.div>

export const ScreenLayout = ({
  heading,
  icon,
  children,
  contentClassName,
  headerClassName,
  className,
  rightComponent,
  leftComponent,
  withBackButton = true,
  ...props
}: TMainLayoutProps): JSX.Element => {
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { ref } = useRemoveOverflowShift<HTMLDivElement>()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const isTestnetSelected = Object.values(selectedNetworkByBlockchain).some(network => network.type === 'testnet')

  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={StyleHelper.mergeStyles(
        'flex h-full w-full grow flex-col overflow-x-hidden overflow-y-auto bg-gray-900 px-4 py-3 text-white',
        { 'pt-8': isTestnetSelected },
        className
      )}
      ref={ref}
      id="screen-layout-container"
      {...props}
    >
      {isTestnetSelected && <NetworkBanner />}

      {heading && (
        <header
          className={StyleHelper.mergeStyles(
            'relative flex items-center justify-between pb-5 text-white',
            headerClassName
          )}
        >
          {leftComponent || (
            <IconButton
              aria-label={tCommonGeneral('back')}
              type="button"
              icon={<TbArrowLeft aria-hidden />}
              className={StyleHelper.mergeStyles({ invisible: !withBackButton })}
              onClick={handleBack}
            />
          )}

          <h1 className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-x-2 text-sm font-bold">
            {icon &&
              cloneElement(icon, {
                ...icon.props,
                className: StyleHelper.mergeStyles(
                  'text-neon min-w-6 max-w-6 min-h-6 max-h-6 h-6 w-6',
                  icon.props.className
                ),
              })}

            {heading}
          </h1>

          {rightComponent}
        </header>
      )}

      <main
        className={StyleHelper.mergeStyles('flex min-h-0 w-full grow flex-col', contentClassName)}
        id="screen-layout-content"
      >
        {children}
      </main>
    </motion.div>
  )
}
