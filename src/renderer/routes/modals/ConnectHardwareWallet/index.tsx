import { useMutation } from '@tanstack/react-query'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'

import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useLastIndexesByWallet } from '@renderer/hooks/useUtilitySelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import NeonWalletIcon from '@renderer/assets/images/neon-wallet-icon.svg?react'

import type { TModalState } from '@shared/types/modal'

export const ConnectHardwareWalletModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareWalletModal' })
  const { onConnect, type } = useModalState<TModalState<'connect-hardware-wallet'>>()
  const { lastIndexesByWallet } = useLastIndexesByWallet()

  const hardwareWalletConnectionMutation = useMutation({
    mutationFn: async () => {
      await HardwareWalletHelper.disconnect()

      // Prevent a UI freeze when connecting the hardware wallet
      await UtilsHelper.sleep(1000)

      const accounts = await HardwareWalletHelper.connect({ lastIndexesByWallet, type })

      // Improve the UX
      await UtilsHelper.sleep(1000)

      await onConnect(accounts)
    },
  })

  useMountUnsafe(() => {
    hardwareWalletConnectionMutation.mutateAsync()
  })

  return (
    <BottomModalLayout heading={t('title')} contentClassName="items-center text-center">
      <h2 className="text-xl text-white">{t('subtitle')}</h2>

      <NeonWalletIcon className="text-neon mt-6 mb-9" aria-hidden />

      {match(hardwareWalletConnectionMutation)
        .with({ isError: true }, () => (
          <Fragment>
            <AlertErrorBanner message={hardwareWalletConnectionMutation.error!.message} />

            <Button
              label={t('searchAgainButtonLabel')}
              variant="text-slim"
              className="mt-7"
              onClick={() => hardwareWalletConnectionMutation.mutateAsync()}
            />
          </Fragment>
        ))
        .otherwise(() => (
          <Fragment>
            <p className="text-xl text-white">
              {type === 'usb' ? t('searchingUsbMessage') : t('searchingBluetoothMessage')}
            </p>

            <p className="mt-1.5 text-xs text-gray-100">{t('alert')}</p>

            <Loader className="mt-9 size-11 text-gray-300" />
          </Fragment>
        ))}
    </BottomModalLayout>
  )
}

export default ConnectHardwareWalletModal
