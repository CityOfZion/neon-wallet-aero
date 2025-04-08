import { createHashRouter, Navigate } from 'react-router-dom'

import { AppPage } from './pages/App'
import { Login } from './pages/Login'
import { LoginNeonAccountOnboarding } from './pages/LoginNeonAccountOnboarding'
import { LoginNeonAccountPassword } from './pages/LoginNeonAccountPassword'
import { LoginOnboardingNewWallet } from './pages/LoginOnboardingNewWallet'
import { LoginOnboardingNewWalletStep1 } from './pages/LoginOnboardingNewWalletStep1'
import { LoginOnboardingNewWalletStep2 } from './pages/LoginOnboardingNewWalletStep2'
import { LoginOnboardingNewWalletStep3 } from './pages/LoginOnboardingNewWalletStep3'
import { RootPage } from './pages/Root'
import { WalletsPage } from './pages/Wallets'

export const pagesRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'login',
        element: <Login />,
        children: [
          {
            path: 'neon-account',
            children: [
              { path: 'password', element: <LoginNeonAccountPassword /> },
              { path: 'onboarding', element: <LoginNeonAccountOnboarding /> },
              { path: '', element: <Navigate to="/login/neon-account/password" replace /> },
            ],
          },
          { path: 'hardware-wallet' },
          { path: 'address-or-key' },
          { path: '', element: <Navigate to="/login/neon-account/password" replace /> },
        ],
      },
      {
        path: 'login-onboarding-new-wallet',
        element: <LoginOnboardingNewWallet />,
        children: [
          { path: '1?', element: <LoginOnboardingNewWalletStep1 /> },
          { path: '2', element: <LoginOnboardingNewWalletStep2 /> },
          { path: '3', element: <LoginOnboardingNewWalletStep3 /> },
        ],
      },
      {
        path: 'app',
        element: <AppPage />,
        children: [
          {
            path: '',
            element: <Navigate to="/app/wallets" />,
          },
          {
            path: 'wallets',
            element: <WalletsPage />,
          },
        ],
      },
    ],
  },
])
