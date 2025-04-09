import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { EnvHelper } from '@/helpers/EnvHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useBeforeLogin } from '@/hooks/useBeforeLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login/neon-account/password', { replace: true })
  }, [navigate])

  return (
    <div
      className={StyleHelper.mergeStyles('flex h-full w-full items-center justify-center bg-gray-950', {
        'h-screen w-screen': EnvHelper.DEV,
      })}
    >
      <div
        id="popup-root"
        className={StyleHelper.mergeStyles(
          'max-h-popup-h-screen min-h-popup-h-screen h-popup-h-screen w-popup-w-screen max-w-popup-w-screen min-w-popup-w-screen relative overflow-hidden',
          { 'rounded-lg': EnvHelper.DEV }
        )}
      >
        <Outlet />
      </div>
    </div>
  )
}
