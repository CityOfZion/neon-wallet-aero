import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { useLogin } from '@/hooks/useLogin'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

export const AppPage = () => {
  const { loginSession } = useLoginSessionSelector()
  const { wallets } = useWalletsSelector()
  const { logout } = useLogin()

  useEffect(() => {
    if (wallets.length === 0) logout()
  }, [logout, wallets])

  if (!loginSession) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
