import { lazy } from 'react'

import { createHashRouter } from 'react-router-dom'

import { RootPage } from './dapi/Root'

const Neo3DapiPermissionPage = lazy(() => import('./dapi/Neo3DapiPermission'))

export const dapiRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [{ path: 'neo3-dapi-permission', element: <Neo3DapiPermissionPage /> }],
  },
])
