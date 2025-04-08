import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@/helpers/StyleHelper'
import { MainLayout } from '@/layouts/MainLayout'

import NeonWalletFullImage from '@/assets/images/neon-wallet-full.svg?react'

type TProps = ComponentProps<'div'>

export const LoginLayout = ({ className, children, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' })

  return (
    <MainLayout className={StyleHelper.mergeStyles('items-center', className)} {...props}>
      <h1 className="mt-7 text-sm font-bold text-white">{t('title')}</h1>

      <NeonWalletFullImage className="mt-4 h-11" />

      {children}
    </MainLayout>
  )
}
