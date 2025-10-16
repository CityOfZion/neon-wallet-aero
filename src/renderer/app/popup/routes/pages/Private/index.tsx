import { Fragment, lazy, Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

const NetworkBanner = lazy(() => import('@renderer/components/NetworkBanner'))

export const PrivatePage = () => {
  const { loginSession } = useLoginSessionSelector()

  if (!loginSession) return <Navigate to="/login" />

  return (
    <Fragment>
      <Suspense fallback={null}>
        <NetworkBanner />
      </Suspense>

      <Outlet />
    </Fragment>
  )
}

export default PrivatePage
