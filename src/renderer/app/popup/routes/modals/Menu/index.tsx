import { useTranslation } from 'react-i18next'
import { TabsHelper } from '@renderer/helpers/TabsHelper'
import { useLogin } from '@renderer/hooks/useLogin'
import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import { MenuItemButton } from './MenuItemButton'
import { MenuItemLink } from './MenuItemLink'

import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'
import TbDoorExit from '@renderer/assets/images/tb-door-exit.svg?react'
import TbFileImport from '@renderer/assets/images/tb-file-import.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import TbReplace from '@renderer/assets/images/tb-replace.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'
import TbSettings from '@renderer/assets/images/tb-settings.svg?react'
import TbShoppingBag from '@renderer/assets/images/tb-shopping-bag.svg?react'
import TbUsers from '@renderer/assets/images/tb-users.svg?react'
import Wallet from '@renderer/assets/images/wallet.svg?react'

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
          onClick={TabsHelper.openTab.bind(null, '/buy-and-sell-tokens')}
        />

        <MenuItemLink label={t('importItemLabel')} to="/app/import" icon={<TbFileImport aria-hidden={true} />} />

        <MenuItemLink
          label={t('neo3NeoXBridgeItemLabel')}
          to="/app/neo3-neox-bridge"
          icon={<TbReplace2 aria-hidden />}
        />

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
