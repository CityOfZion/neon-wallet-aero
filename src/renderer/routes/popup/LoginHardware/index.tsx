import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { TemporaryLimitsBox } from '@renderer/components/TemporaryLimitsBox'

import TbBluetooth from '@renderer/assets/images/tb-bluetooth.svg?react'
import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

import { rendererApi } from '@shared/message-api/renderer'

export const LoginHardwarePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginHardware' })

  return (
    <div className="flex w-full grow flex-col items-center">
      <h2 className="text-lg text-white">{t('title')}</h2>

      <Button
        variant="card"
        className="mt-5 w-full"
        textClassName="text-start"
        clickableProps={{ className: 'h-14' }}
        label={t('byBluetoothButtonLabel')}
        colorSchema="white"
        leftIcon={<TbBluetooth aria-hidden className="text-neon" />}
        rightIcon={<TbExternalLink aria-hidden className="text-gray-300" />}
        onClick={() =>
          rendererApi.send('tab:open', {
            href: '/connect-hardware-wallet',
            query: { 'connection-type': 'bluetooth' },
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
        leftIcon={<TbDeviceUsb aria-hidden className="text-neon rotate-45" />}
        rightIcon={<TbExternalLink aria-hidden className="text-gray-300" />}
        onClick={() =>
          rendererApi.send('tab:open', { href: '/connect-hardware-wallet', query: { 'connection-type': 'usb' } })
        }
      />

      <TemporaryLimitsBox className="mt-auto mb-4 pt-4" />
    </div>
  )
}

export default LoginHardwarePage
