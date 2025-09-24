import { Fragment } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { NetworkBanner } from '@/components/NetworkBanner'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'

export const AppPage = () => {
  const { loginSession } = useLoginSessionSelector()

  if (!loginSession) {
    return <Navigate to="/login" />
  }

  return (
    <Fragment>
      <NetworkBanner />
      <Outlet />
    </Fragment>
  )
}
