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
        <MenuItemLink label={t('walletsItemLabel')} to="/wallets" icon={<Wallet aria-hidden />} />

        <MenuItemButton
          label={t('buyAndSellTokensItemLabel')}
          isExternal
          icon={<TbShoppingBag aria-hidden />}
          onClick={TabsHelper.openTab.bind(null, '/buy-and-sell-tokens')}
        />

        <MenuItemLink label={t('importItemLabel')} to="/import" icon={<TbFileImport aria-hidden />} />

        <MenuItemLink label={t('neo3NeoXBridgeItemLabel')} to="/neo3-neox-bridge" icon={<TbReplace2 aria-hidden />} />

        <MenuItemLink
          label={t('connectHardwareWalletItemLabel')}
          to="/connect-hardware-wallet"
          icon={<TbDeviceUsb aria-hidden className="rotate-45" />}
        />

        <MenuItemLink label={t('contactsItemLabel')} to="/contacts" icon={<TbUsers aria-hidden />} />

        <MenuItemLink label={t('helpItemLabel')} to="/help" icon={<TbHelp aria-hidden className="text-yellow" />} />

        <MenuItemLink label={t('settingsItemLabel')} to="/settings" icon={<TbSettings aria-hidden />} />

        <MenuItemButton
          label={t('logoutItemLabel')}
          hasSeparator={false}
          icon={<TbDoorExit aria-hidden />}
          onClick={logout}
        />
      </ul>
    </SideModalLayout>
  )
}

export default MenuModal
