import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/Button'

import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useHasHardwareAccountSelector } from '@renderer/hooks/useAccountSelector'
import { useCreateHardwareWallet } from '@renderer/hooks/useHardwareWallet'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { usePressOnce } from '@renderer/hooks/usePressOnce'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbBluetooth from '@renderer/assets/images/tb-bluetooth.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

export const ConnectHardwareWallet = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'connectHardwareWallet' })
  const { modalNavigateWrapper } = useModalNavigate()
  const { createHardwareWallet } = useCreateHardwareWallet()
  const { hasHardwareAccount } = useHasHardwareAccountSelector()
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const [isDisconnecting, startDisconnect] = usePressOnce(async () => {
    await HardwareWalletHelper.disconnect()
    navigate(-1)
  })

  const handleConnect = async (accounts: TBSAccount<TBlockchainServiceKey>[]) => {
    const [firstAccount] = await createHardwareWallet(accounts)

    ToastHelper.success({ message: t('successToastMessage') })
    modalErase('bottom')
    navigate('/wallets', { replace: true, state: { account: firstAccount } })
  }

  return (
    <ScreenLayout heading={t('title')} className="text-white" contentClassName="items-center">
      <p className="text-center text-xl">{t('description')}</p>

      <TbHelp aria-hidden className="text-blue mt-3 size-21 stroke-1" />

      <Button
        variant="card"
        className="mt-5 w-full"
        textClassName="text-start"
        clickableProps={{
          className: 'h-14',
        }}
        label={t('byBluetoothButtonLabel')}
        colorSchema="white"
        leftIcon={<TbBluetooth aria-hidden className="group-aria-[disabled=false]:text-neon" />}
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
        leftIcon={<TbDeviceUsb aria-hidden className="group-aria-[disabled=false]:text-neon rotate-45" />}
        rightIcon={<TbChevronRight aria-hidden className="text-gray-300" />}
        onClick={modalNavigateWrapper('connect-hardware-wallet', { state: { onConnect: handleConnect, type: 'usb' } })}
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

export default ConnectHardwareWallet
