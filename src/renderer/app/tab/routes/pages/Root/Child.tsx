import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import { NetworkBanner } from '@renderer/components/NetworkBanner'
import { useBeforeTabLogin } from '@renderer/hooks/useBeforeTabLogin'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeTabLogin()

  return (
    <Fragment>
      <NetworkBanner />

      <Outlet />
    </Fragment>
  )
}
