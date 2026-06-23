import { useEffect, useLayoutEffect } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { match } from 'ts-pattern'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { AlertSuccessBanner } from '@renderer/components/AlertSuccessBanner'
import { BorderLoader } from '@renderer/components/BorderLoader'
import { Button } from '@renderer/components/Button'

import { HardwareWalletHelper } from '@renderer/helpers/HardwareWalletHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useCreateHardwareWallet } from '@renderer/hooks/useHardwareWallet'
import { useLogin } from '@renderer/hooks/useLogin'
import { usePageTitle } from '@renderer/hooks/usePageTitle'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useLastIndexesByWallet } from '@renderer/hooks/useUtilitySelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import NeonWalletFullIcon from '@renderer/assets/images/neon-wallet-full.svg?react'
import TbDeviceUsb from '@renderer/assets/images/tb-device-usb.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { rendererApi } from '@shared/message-api/renderer'
import type { THardwareWalletHelperConnectionType } from '@shared/types/helpers'

type THardwareWalletHelperConnectType = 'login' | 'create'

export const ConnectHardwareWalletPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'connectHardwareWallet' })
  const { lastIndexesByWallet } = useLastIndexesByWallet()
  const { loginWithHardwareWallet } = useLogin()
  const { createHardwareWallet } = useCreateHardwareWallet()
  const { loginSession } = useLoginSessionSelector()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const connectionType = (searchParams.get('connection-type') || 'usb') as THardwareWalletHelperConnectionType
  const type = (searchParams.get('type') || 'login') as THardwareWalletHelperConnectType

  const hardwareWalletConnectionMutation = useMutation({
    mutationFn: async () => {
      await HardwareWalletHelper.disconnect()

      // Prevent a UI freeze when connecting the hardware wallet
      await UtilsHelper.sleep(1000)

      const accounts = await HardwareWalletHelper.connect({ lastIndexesByWallet, type: connectionType })

      // Improve the UX
      await UtilsHelper.sleep(1000)

      if (type === 'login') {
        await loginWithHardwareWallet(accounts)
      } else {
        const createdAccounts = await createHardwareWallet(accounts)
        dispatch(settingsReducerActions.setSelectedWallet(createdAccounts[0].wallet))
      }
    },
  })

  useEffect(() => {
    if (!hardwareWalletConnectionMutation.isSuccess) return

    UtilsHelper.sleep(2000).then(async () => {
      await rendererApi.send('tab:close-all')
      await rendererApi.send('popup:open')
    })
  }, [hardwareWalletConnectionMutation.isSuccess])

  useLayoutEffect(() => {
    if (!loginSession && type === 'create') {
      rendererApi.send('tab:close-all')
    }
  }, [loginSession, type])

  usePageTitle(t('pageTitle'))

  return (
    <ScreenLayout withBack={false} contentClassName="items-center justify-center">
      <div className="flex max-h-154 w-full max-w-212 grow flex-col items-center rounded-lg bg-gray-300/10 px-40 py-25">
        <NeonWalletFullIcon className="text-neon" aria-hidden />

        <div className="mt-12 flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
          <p className="text-sm text-gray-100">{t('alert')}</p>

          {match(hardwareWalletConnectionMutation)
            .with({ isSuccess: true }, () => (
              <AlertSuccessBanner className="mt-4 px-6 text-sm" message={t('successBannerMessage')} />
            ))
            .with({ isError: true }, () => (
              <AlertErrorBanner
                className="mt-4 px-6 text-sm"
                message={hardwareWalletConnectionMutation.error!.message}
              />
            ))
            .otherwise(() => null)}
        </div>

        <BorderLoader enabled={hardwareWalletConnectionMutation.isPending} className="mt-auto w-full max-w-96">
          <Button
            disabled={hardwareWalletConnectionMutation.isPending || hardwareWalletConnectionMutation.isSuccess}
            onClick={() => hardwareWalletConnectionMutation.mutateAsync()}
            leftIcon={<TbDeviceUsb aria-hidden className="rotate-45" />}
            iconsOnEdge={false}
            label={connectionType === 'usb' ? t('searchUsbButtonLabel') : t('searchBluetoothButtonLabel')}
            colorSchema="blue"
            variant="card"
            className="w-full"
          />
        </BorderLoader>
      </div>
    </ScreenLayout>
  )
}

export default ConnectHardwareWalletPage
