import { useTranslation } from 'react-i18next'

import { TabsHelper } from '@/helpers/TabsHelper'
import { useLogin } from '@/hooks/useLogin'
import { SideModalLayout } from '@/layouts/SideModalLayout'

import { MenuItemButton } from './MenuItemButton'
import { MenuItemLink } from './MenuItemLink'

import TbDeviceUsb from '@/assets/images/tb-device-usb.svg?react'
import TbDoorExit from '@/assets/images/tb-door-exit.svg?react'
import TbFileImport from '@/assets/images/tb-file-import.svg?react'
import TbHelp from '@/assets/images/tb-help.svg?react'
import TbReplace from '@/assets/images/tb-replace.svg?react'
import TbSettings from '@/assets/images/tb-settings.svg?react'
import TbShoppingBag from '@/assets/images/tb-shopping-bag.svg?react'
import TbUsers from '@/assets/images/tb-users.svg?react'
import Wallet from '@/assets/images/wallet.svg?react'

export const MenuModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'menuModal' })
  const { logout } = useLogin()

  return (
    <SideModalLayout heading={t('title')}>
      <ul className="flex w-full flex-col">
        <MenuItemLink label={t('walletsItemLabel')} to="/app/wallets" icon={<Wallet aria-hidden={true} />} />

        <MenuItemButton
          label={t('buyAndSellTokensItemLabel')}
          isExternal
          icon={<TbShoppingBag aria-hidden={true} />}
          onClick={TabsHelper.openTab.bind(null, '/app/settings/buy-and-sell-tokens')}
        />

        <MenuItemLink label={t('importItemLabel')} to="/app/import" icon={<TbFileImport aria-hidden={true} />} />

        <MenuItemLink
          label={t('connectHardwareWalletItemLabel')}
          to="/app/connect-hardware-wallet"
          icon={<TbDeviceUsb aria-hidden={true} className="rotate-45" />}
        />

        <MenuItemLink label={t('contactsItemLabel')} to="/app/contacts" icon={<TbUsers aria-hidden={true} />} />

        <MenuItemLink label={t('swapItemLabel')} to="/app/swap" icon={<TbReplace aria-hidden />} />

        <MenuItemLink
          label={t('helpItemLabel')}
          to="/app/help"
          icon={<TbHelp aria-hidden={true} className="text-yellow" />}
        />

        <MenuItemLink label={t('settingsItemLabel')} to="/app/settings" icon={<TbSettings aria-hidden={true} />} />

        <MenuItemButton
          label={t('logoutItemLabel')}
          hasSeparator={false}
          icon={<TbDoorExit aria-hidden={true} />}
          onClick={logout}
        />
      </ul>
    </SideModalLayout>
  )
}
