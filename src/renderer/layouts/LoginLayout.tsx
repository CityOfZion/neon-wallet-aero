import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import NeonWalletFullImage from '@renderer/assets/images/neon-wallet-full.svg?react'

import type { TMainLayoutProps } from './ScreenLayout'
import { ScreenLayout } from './ScreenLayout'

export const LoginLayout = ({ contentClassName, children, ...props }: TMainLayoutProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' })

  return (
    <ScreenLayout
      heading={t('title')}
      contentClassName={StyleHelper.mergeStyles('items-center', contentClassName)}
      {...props}
    >
      <NeonWalletFullImage aria-hidden className="-mt-3 h-11 max-h-11 min-h-11" />

      {children}
    </ScreenLayout>
  )
}
