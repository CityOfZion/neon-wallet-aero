import { lazy } from 'react'

import { createHashRouter } from 'react-router-dom'

import PrivatePage from './popup/Private'
import { RootPage } from './tab/Root'

const BuyAndSellTokensPage = lazy(() => import('./tab/BuyAndSellTokens'))
const LiveSupportPage = lazy(() => import('./tab/LiveSupport'))
const ConnectHardwareWalletPage = lazy(() => import('./tab/ConnectHardwareWallet'))

export const tabRouter = createHashRouter([
  {
    element: <RootPage />,
    children: [
      { path: 'connect-hardware-wallet', element: <ConnectHardwareWalletPage /> },
      { path: 'live-support', element: <LiveSupportPage /> },
      {
        element: <PrivatePage />,
        children: [{ path: 'buy-and-sell-tokens', element: <BuyAndSellTokensPage /> }],
      },
    ],
  },
])
