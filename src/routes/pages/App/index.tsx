import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useLoginSessionSelector } from '@/hooks/useAuthSelector'

export const AppPage = () => {
  const { loginSession } = useLoginSessionSelector()
  const location = useLocation()

  if (!loginSession) {
    // TODO: Change this when login flow is implemented
    return <Navigate to="/" state={{ from: location.pathname }} />
  }

  return <Outlet />
}
