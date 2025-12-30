import { lazy } from 'react'

import { createHashRouter } from 'react-router-dom'

import PrivatePage from './popup/Private'
import { RootPage } from './tab/Root'

const BuyAndSellTokensPage = lazy(() => import('./tab/BuyAndSellTokens'))
const ConnectHardwareWalletPage = lazy(() => import('./tab/ConnectHardwareWallet'))

export const tabRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { element: <PrivatePage />, children: [{ path: 'buy-and-sell-tokens', element: <BuyAndSellTokensPage /> }] },

      { path: 'connect-hardware-wallet', element: <ConnectHardwareWalletPage /> },
    ],
  },
])
