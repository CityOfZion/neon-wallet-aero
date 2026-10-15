import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'
import { Tooltip } from '@renderer/components/Tooltip'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

import { ScreenLayout } from './ScreenLayout'

type TProps = {
  title: string
  children: React.ReactNode
  withBack?: boolean
  backUrl?: string
}

export const SettingsLayout = ({ children, title, withBack = true, backUrl }: TProps) => {
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const navigate = useNavigate()

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl)
      return
    }

    navigate(-1)
  }

  return (
    <ScreenLayout className="bg-asphalt text-white">
      <header className="relative mt-2 mb-5 flex min-h-8 w-full flex-row items-center text-white">
        {withBack && (
          <Tooltip title={tCommonGeneral('back')}>
            <IconButton
              type="button"
              icon={<TbArrowLeft aria-hidden />}
              onClick={handleBack}
              aria-label={tCommonGeneral('back')}
            />
          </Tooltip>
        )}

        <h1 className="absolute top-1/2 left-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-sm font-bold">
          {title}
        </h1>
      </header>

      {children}
    </ScreenLayout>
  )
}
