import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useBeforeLogin } from '@/hooks/useBeforeLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()

  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login/neon-account/password')
  }, [navigate])

  return <Outlet />
}
