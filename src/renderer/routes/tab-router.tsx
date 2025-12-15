import { lazy } from 'react'

import { createHashRouter } from 'react-router-dom'

import { RootPage } from './tab/Root'

const BuyAndSellTokensPage = lazy(() => import('./tab/BuyAndSellTokens'))

export const tabRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [{ path: 'buy-and-sell-tokens', element: <BuyAndSellTokensPage /> }],
  },
])
