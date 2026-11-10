import { useTranslation } from 'react-i18next'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbBrandDiscord from '@renderer/assets/images/tb-brand-discord.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'

import { ConstantsURLHelper } from '@shared/helpers/ConstantsURLHelper'
import { rendererApi } from '@shared/message-api/renderer'

import { HelpLinkItem } from './HelpLinkItem'

export const HelpPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'help' })

  return (
    <ScreenLayout heading={t('title')}>
      <ul className="flex w-full flex-col py-2.5">
        <HelpLinkItem
          label={t('liveSupportItemLabel')}
          isExternal
          icon={<TbMessage aria-hidden className="text-yellow" />}
          onClick={() => rendererApi.send('tab:open', { href: '/live-support' })}
        />

        <HelpLinkItem
          label={t('discordItemLabel')}
          to={ConstantsURLHelper.cozDiscordUrl}
          isExternal
          hideSeparator
          icon={<TbBrandDiscord aria-hidden className="text-yellow" />}
        />
      </ul>
    </ScreenLayout>
  )
}

export default HelpPage
