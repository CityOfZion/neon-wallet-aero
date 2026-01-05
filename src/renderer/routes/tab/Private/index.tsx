import { Fragment, useLayoutEffect } from 'react'

import { Outlet } from 'react-router-dom'

import { NetworkBanner } from '@renderer/components/NetworkBanner'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'

import { rendererApi } from '@shared/message-api/renderer'

export const PrivatePage = () => {
  const { loginSession } = useLoginSessionSelector()

  useLayoutEffect(() => {
    rendererApi.send('tab:close-all')
  }, [])

  if (!loginSession) {
    return null
  }

  return (
    <Fragment>
      <NetworkBanner />

      <Outlet />
    </Fragment>
  )
}
