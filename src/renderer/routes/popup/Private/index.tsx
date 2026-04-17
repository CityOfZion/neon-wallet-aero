import { Fragment, Suspense } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { NetworkBanner } from '@renderer/components/NetworkBanner'

import { LazyHelper } from '@renderer/helpers/LazyHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useShowNewsModalSelector } from '@renderer/hooks/useSettingsSelector'

import HardwareWalletManagerSetup from './HardwareWalletManagerSetup'

const WalletConnectManagerSetup = LazyHelper.delayedLazy(() => import('./WalletConnectManagerSetup'), 1000)
const AccountTasksManagerSetup = LazyHelper.delayedLazy(() => import('./AccountTasksManagerSetup'), 10000)
const WalletTasksManagerSetup = LazyHelper.delayedLazy(() => import('./WalletTasksManagerSetup'), 15000)

export const PrivatePage = () => {
  const { loginSession } = useLoginSessionSelector()
  const { showNewsModalRef } = useShowNewsModalSelector()
  const { modalNavigate } = useModalNavigate()

  useMountUnsafe(async () => {
    if (loginSession && showNewsModalRef.current) {
      await UtilsHelper.sleep(500)
      modalNavigate('news')
    }
  })

  if (!loginSession) return <Navigate to="/login" />

  return (
    <Fragment>
      <Suspense fallback={null}>
        <WalletConnectManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <AccountTasksManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <WalletTasksManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <HardwareWalletManagerSetup />
      </Suspense>

      <NetworkBanner />

      <Outlet />
    </Fragment>
  )
}

export default PrivatePage
