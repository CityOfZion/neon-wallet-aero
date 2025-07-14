import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/IconButton'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalNavigate } from '@/hooks/useModalRouter'

import { ScreenLayout } from './ScreenLayout'

import TbArrowLeft from '@/assets/images/tb-arrow-left.svg?react'
import TbMenu2 from '@/assets/images/tb-menu-2.svg?react'

type TProps = {
  title: string
  children: React.ReactNode
}

export const SettingsLayout = ({ children, title }: TProps) => {
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()
  const navigate = useNavigate()

  const hideBackButton = location.hash.endsWith('/change-password/3')

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <ScreenLayout className="bg-asphalt text-white">
      <div className="flex w-full gap-9">
        <header
          className={StyleHelper.mergeStyles(
            'relative mt-2 mb-5 flex w-full flex-row items-center justify-end text-white'
          )}
        >
          {!hideBackButton && (
            <IconButton
              type="button"
              icon={<TbArrowLeft aria-hidden />}
              onClick={handleBack}
              aria-label={tCommonGeneral('back')}
            />
          )}

          <h1 className="w-full max-w-[82%] truncate text-center text-sm font-bold">{title}</h1>

          <IconButton
            aria-label={tCommonGeneral('menuIconButtonAriaLabel')}
            className="mb-0.5"
            icon={<TbMenu2 aria-hidden />}
            onClick={modalNavigateWrapper('menu')}
          />
        </header>
      </div>

      {children}
    </ScreenLayout>
  )
}
