import { useTranslation } from 'react-i18next'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import HiOutlineTicket from '@renderer/assets/images/hi-outline-ticket.svg?react'
import TbMessage from '@renderer/assets/images/tb-message.svg?react'

import { HelpLinkItem } from './HelpLinkItem'

export const HelpPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'help' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <ScreenLayout heading={t('title')}>
      <ul className="flex w-full flex-col py-2.5">
        <HelpLinkItem
          label={t('chatWithUsItemLabel')}
          to={ConstantsHelper.cozDiscordUrl}
          icon={<TbMessage aria-hidden className="text-yellow" />}
          isExternal
        />

        <HelpLinkItem
          label={t('openSupportTicketItemLabel')}
          icon={<HiOutlineTicket aria-hidden className="text-yellow" />}
          onClick={modalNavigateWrapper('support-ticket')}
          hideSeparator
        />
      </ul>
    </ScreenLayout>
  )
}

export default HelpPage
