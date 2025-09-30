import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBeforeLogin } from '@renderer/hooks/useBeforeLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()

  const navigate = useNavigate()
  const { loginSessionRef } = useLoginSessionSelector()

  useEffect(() => {
    const handle = async () => {
      navigate('/splash', { replace: true })
      await UtilsHelper.sleep(2000)

      if (loginSessionRef.current) {
        navigate('/app/wallets', { replace: true })
        return
      }

      navigate('/login', { replace: true })
    }

    handle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Outlet />
}
