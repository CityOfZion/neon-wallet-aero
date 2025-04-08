import { Navigate, Outlet } from 'react-router-dom'

import { useLoginSessionSelector } from '@/hooks/useAuthSelector'

export const AppPage = () => {
  const { loginSession } = useLoginSessionSelector()

  if (!loginSession) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
