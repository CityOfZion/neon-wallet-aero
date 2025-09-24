import { useTranslation } from 'react-i18next'

import { PageHelper } from '@/helpers/PageHelper'
import { useLogin } from '@/hooks/useLogin'
import { SideModalLayout } from '@/layouts/SideModalLayout'

import { MenuItem } from './MenuItem'

import TbDeviceUsb from '@/assets/images/tb-device-usb.svg?react'
import TbDoorExit from '@/assets/images/tb-door-exit.svg?react'
import TbFileImport from '@/assets/images/tb-file-import.svg?react'
import TbHelp from '@/assets/images/tb-help.svg?react'
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
        <MenuItem label={t('walletsItemLabel')} to="/app/wallets" icon={<Wallet aria-hidden={true} />} />

        <MenuItem
          label={t('buyAndSellTokensItemLabel')}
          isExternal
          icon={<TbShoppingBag aria-hidden={true} />}
          onClick={PageHelper.openTabAsInternalPage.bind(null, '/app/settings/buy-and-sell-tokens')}
        />

        <MenuItem label={t('importItemLabel')} to="/app/import" icon={<TbFileImport aria-hidden={true} />} />

        <MenuItem
          label={t('connectHardwareWalletItemLabel')}
          to="/app/connect-hardware-wallet"
          icon={<TbDeviceUsb aria-hidden={true} className="rotate-45" />}
        />

        <MenuItem label={t('contactsItemLabel')} to="/app/contacts" icon={<TbUsers aria-hidden={true} />} />

        <MenuItem
          label={t('helpItemLabel')}
          to="/app/help"
          icon={<TbHelp aria-hidden={true} className="text-yellow" />}
        />

        <MenuItem label={t('settingsItemLabel')} to="/app/settings" icon={<TbSettings aria-hidden={true} />} />

        <MenuItem
          label={t('logoutItemLabel')}
          hasSeparator={false}
          icon={<TbDoorExit aria-hidden={true} />}
          onClick={logout}
        />
      </ul>
    </SideModalLayout>
  )
}
