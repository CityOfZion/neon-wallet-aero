import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import NeonWalletFullImage from '@renderer/assets/images/neon-wallet-full.svg?react'

import type { TMainLayoutProps } from './ScreenLayout'
import { ScreenLayout } from './ScreenLayout'

type TProps = TMainLayoutProps & {
  showBackButton?: boolean
}

export const LoginLayout = ({ contentClassName, children, showBackButton, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' })

  return (
    <ScreenLayout
      contentClassName={StyleHelper.mergeStyles('items-center', contentClassName)}
      {...props}
      heading={t('title')}
      withBackButton={showBackButton}
    >
      <NeonWalletFullImage aria-hidden className="-mt-3.5 h-11 max-h-11 min-h-11" />

      {children}
    </ScreenLayout>
  )
}
