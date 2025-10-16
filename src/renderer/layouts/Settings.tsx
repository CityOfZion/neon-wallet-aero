import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import { ScreenLayout } from './ScreenLayout'

type TProps = {
  title: string
  children: React.ReactNode
  hideBackButton?: boolean
}

export const SettingsLayout = ({ children, title, hideBackButton }: TProps) => {
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()
  const navigate = useNavigate()

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
