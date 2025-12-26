import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'
import { TemporaryLimitsBox } from '@renderer/components/TemporaryLimitsBox'

import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useLogin } from '@renderer/hooks/useLogin'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbBluetooth from '@renderer/assets/images/tb-bluetooth.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

export const LoginHardwarePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginHardware' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { loginWithHardwareWallet } = useLogin()
  const navigate = useNavigate()
  const { modalErase } = useModalNavigate()

  const handleConnect = async (accounts: TBSAccount<TBlockchainServiceKey>[]) => {
    await loginWithHardwareWallet(accounts)
    ToastHelper.success({ message: t('successToastMessage') })
    modalErase('bottom')
    navigate('/wallets', { replace: true })
  }

  return (
    <div className="flex w-full grow flex-col items-center">
      <h2 className="text-lg text-white">{t('title')}</h2>

      <Button
        variant="card"
        className="mt-5 w-full"
        textClassName="text-start"
        clickableProps={{
          className: 'h-14',
        }}
        label={t('byBluetoothButtonLabel')}
        colorSchema="white"
        leftIcon={<TbBluetooth aria-hidden className="text-neon" />}
        rightIcon={<TbChevronRight aria-hidden className="text-gray-300" />}
        onClick={modalNavigateWrapper('connect-hardware-wallet', {
          state: { onConnect: handleConnect, type: 'bluetooth' },
        })}
      />

      <Button
        variant="card"
        className="mt-2.5 w-full"
        textClassName="text-start"
        clickableProps={{
          className: 'h-14',
        }}
        label={t('byUSBButtonLabel')}
        colorSchema="white"
        leftIcon={<TbDeviceUsb aria-hidden className="text-neon rotate-45" />}
        rightIcon={<TbChevronRight aria-hidden className="text-gray-300" />}
        onClick={modalNavigateWrapper('connect-hardware-wallet', { state: { onConnect: handleConnect, type: 'usb' } })}
      />

      <TemporaryLimitsBox className="mt-auto mb-4 pt-4" />
    </div>
  )
}

export default LoginHardwarePage
