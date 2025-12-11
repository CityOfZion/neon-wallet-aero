import { Fragment, lazy, Suspense } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { LazyHelper } from '@renderer/helpers/LazyHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import HardwareWalletManagerSetup from './HardwareWalletManagerSetup'

const NetworkBanner = lazy(() => import('@renderer/components/NetworkBanner'))
const WalletConnectManagerSetup = LazyHelper.delayedLazy(() => import('./WalletConnectManagerSetup'), 1000)

export const PrivatePage = () => {
  const { loginSession } = useLoginSessionSelector()

  if (!loginSession) return <Navigate to="/login" />

  return (
    <Fragment>
      <Suspense fallback={null}>
        <NetworkBanner />
      </Suspense>

      <Suspense fallback={null}>
        <WalletConnectManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <HardwareWalletManagerSetup />
      </Suspense>
      <Outlet />
    </Fragment>
  )
}

export default PrivatePage
