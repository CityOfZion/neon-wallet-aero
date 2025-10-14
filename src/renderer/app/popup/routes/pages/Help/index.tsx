import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/IconButton'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { ScreenLayout } from '@renderer/layouts/ScreenLayout'
import { DISCORD_LINK } from '@shared/constants/links'

import { HelpLinkItem } from './HelpLinkItem'

import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'

export const HelpPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'help' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <ScreenLayout
      className="bg-asphalt"
      heading={t('title')}
      rightComponent={
        <IconButton
          aria-label={commonT('menuIconButtonAriaLabel')}
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
    >
      <ul className="flex w-full flex-col">
        <HelpLinkItem
          label={t('chatWithUsItemLabel')}
          to={DISCORD_LINK}
          icon={<TbMessage aria-hidden className="text-yellow" />}
          hideSeparator
        />
      </ul>
    </ScreenLayout>
  )
}
