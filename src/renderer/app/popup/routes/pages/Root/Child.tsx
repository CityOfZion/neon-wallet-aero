import { Outlet } from 'react-router-dom'
import { useBeforePopupLogin } from '@renderer/hooks/useBeforePopupLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforePopupLogin()

  return <Outlet />
}
