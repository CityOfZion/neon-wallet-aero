import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@/helpers/StyleHelper'

import { ScreenLayout, TMainLayoutProps } from './ScreenLayout'

import NeonWalletFullImage from '@/assets/images/neon-wallet-full.svg?react'

type TProps = TMainLayoutProps

export const LoginLayout = ({ contentClassName, children, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' })

  return (
    <ScreenLayout contentClassName={StyleHelper.mergeStyles('items-center', contentClassName)} {...props}>
      <h1 className="mt-7 text-sm font-bold text-white">{t('title')}</h1>

      <NeonWalletFullImage className="mt-4 h-11" />

      {children}
    </ScreenLayout>
  )
}
