import { createHashRouter } from 'react-router-dom'

import { BuyAndSellTokensPage } from './pages/BuyAndSellTokens'
import { RootPage } from './pages/Root'

export const pagesRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [{ path: 'buy-and-sell-tokens', element: <BuyAndSellTokensPage /> }],
  },
])
