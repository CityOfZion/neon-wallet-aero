import { Fragment, Suspense } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { NetworkBanner } from '@renderer/components/NetworkBanner'

import { LazyHelper } from '@renderer/helpers/LazyHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import HardwareWalletManagerSetup from './HardwareWalletManagerSetup'

const WalletConnectManagerSetup = LazyHelper.delayedLazy(() => import('./WalletConnectManagerSetup'), 1000)
const AccountTasksManagerSetup = LazyHelper.delayedLazy(() => import('./AccountTasksManagerSetup'), 10000)
const WalletTasksManagerSetup = LazyHelper.delayedLazy(() => import('./WalletTasksManagerSetup'), 15000)

export const PrivatePage = () => {
  const { loginSession } = useLoginSessionSelector()

  if (!loginSession) {
    return <Navigate to="/login" replace />
  }

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
