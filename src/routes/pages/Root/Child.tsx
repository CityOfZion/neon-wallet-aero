import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { EnvHelper } from '@/helpers/EnvHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useBeforeLogin } from '@/hooks/useBeforeLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()
  const navigate = useNavigate()

  useEffect(() => {
    const handle = async () => {
      navigate('/splash', { replace: true })

      await UtilsHelper.sleep(2000)

      navigate('/login/neon-account/password', { replace: true })
    }

    handle()
  }, [navigate])

  return (
    <div
      className={StyleHelper.mergeStyles('flex h-full w-full items-center justify-center bg-gray-950', {
        'h-screen w-screen': EnvHelper.DEV,
      })}
    >
      <div
        id="popup-root"
        className={StyleHelper.mergeStyles('h-popup-h-screen w-popup-w-screen relative overflow-hidden', {
          'rounded-lg': EnvHelper.DEV,
        })}
      >
        <Outlet />
      </div>
    </div>
  )
}
