import { Fragment, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { NetworkBanner } from '@renderer/components/NetworkBanner'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

export const AppPage = () => {
  const { loginSession } = useLoginSessionSelector()
  const { wallets } = useWalletsSelector()
  const { logout } = useLogin()

  useEffect(() => {
    if (wallets.length === 0) logout()
  }, [logout, wallets])

  if (!loginSession) return <Navigate to="/login" />

  return (
    <Fragment>
      <NetworkBanner />

      <Outlet />
    </Fragment>
  )
}
