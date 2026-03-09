import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'

import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'

import { useHasHardwareAccountSelector } from '@renderer/hooks/useAccountSelector'
import { usePressOnce } from '@renderer/hooks/usePressOnce'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbBluetooth from '@renderer/assets/images/tb-bluetooth.svg?react'
import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

import { rendererApi } from '@shared/message-api/renderer'

export const CreateHardwareWallet = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'createHardwareWallet' })

  const { hasHardwareAccount } = useHasHardwareAccountSelector()
  const navigate = useNavigate()

  const [isDisconnecting, startDisconnect] = usePressOnce(async () => {
    await HardwareWalletHelper.disconnect()
    navigate(-1)
  })

  return (
    <ScreenLayout heading={t('title')} className="text-white" contentClassName="items-center">
      <p className="text-center text-xl">{t('description')}</p>

      <TbHelp aria-hidden className="text-blue mt-3 size-21 stroke-1" />

      <Button
        variant="card"
        className="mt-5 w-full"
        textClassName="text-start"
        clickableProps={{ className: 'h-14' }}
        label={t('byBluetoothButtonLabel')}
        colorSchema="white"
        leftIcon={<TbBluetooth aria-hidden className="group-aria-[disabled=false]:text-neon" />}
        rightIcon={<TbExternalLink aria-hidden className="text-gray-300" />}
        onClick={() =>
          rendererApi.send('tab:open', {
            href: '/connect-hardware-wallet',
            query: { 'connection-type': 'bluetooth', type: 'create' },
          })
        }
      />

      <Button
        variant="card"
        className="mt-2.5 w-full"
        textClassName="text-start"
        clickableProps={{ className: 'h-14' }}
        label={t('byUSBButtonLabel')}
        colorSchema="white"
        leftIcon={<TbDeviceUsb aria-hidden className="group-aria-[disabled=false]:text-neon rotate-45" />}
        rightIcon={<TbExternalLink aria-hidden className="text-gray-300" />}
        onClick={() =>
          rendererApi.send('tab:open', {
            href: '/connect-hardware-wallet',
            query: { 'connection-type': 'usb', type: 'create' },
          })
        }
      />

      {hasHardwareAccount && (
        <Button
          className="mt-auto w-full pt-2.5"
          variant="outlined"
          colorSchema="error"
          rightIcon={<TbPlugX aria-hidden />}
          label={t('disconnectButtonLabel')}
          onClick={startDisconnect}
          loading={isDisconnecting}
          iconsOnEdge={false}
        />
      )}
    </ScreenLayout>
  )
}

export default CreateHardwareWallet
