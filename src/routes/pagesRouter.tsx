import { createHashRouter } from 'react-router-dom'

import { AppPage } from './pages/App'
import { RootPage } from './pages/Root'
import { WalletsPage } from './pages/Wallets'

export const pagesRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'app',
        element: <AppPage />,
        children: [
          {
            path: 'wallets',
            element: <WalletsPage />,
          },
        ],
      },
    ],
  },
])
