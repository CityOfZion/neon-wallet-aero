import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useLoginSessionSelector } from '@/hooks/useAuthSelector'
import { useBeforeLogin } from '@/hooks/useBeforeLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()

  const navigate = useNavigate()
  const { loginSession, loginSessionRef } = useLoginSessionSelector()
  const { pathname, search } = useLocation()
  const [nextUrl, setNextUrl] = useState('')

  const isPopup = window.location.pathname === '/src/popup.html'

  useEffect(() => {
    if (!loginSession || pathname !== '/splash' || !nextUrl) return

    navigate(isPopup ? '/app/wallets' : nextUrl, { replace: true })
    setNextUrl('')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginSession, pathname, nextUrl, isPopup])

  useEffect(() => {
    const handle = async () => {
      setNextUrl(`${pathname}${search}`)
      navigate('/splash', { replace: true })

      await UtilsHelper.sleep(2000)

      if (loginSessionRef.current) return

      navigate('/login', { replace: true })
    }

    handle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Outlet />
}
