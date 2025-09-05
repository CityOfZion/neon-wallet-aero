import { createHashRouter, Navigate } from 'react-router-dom'

import { AppPage } from './pages/App'
import { BackupAndRestorePage } from './pages/BackupAndRestore'
import { BackupStep1 } from './pages/BackupAndRestore/BackupStep1'
import { BackupStep2 } from './pages/BackupAndRestore/BackupStep2'
import { ChangePasswordPage } from './pages/ChangePassword'
import { ChangePasswordStep1 } from './pages/ChangePassword/ChangePasswordStep1'
import { ChangePasswordStep2 } from './pages/ChangePassword/ChangePasswordStep2'
import { ChangePasswordStep3 } from './pages/ChangePassword/ChangePasswordStep3'
import { ContactsPage } from './pages/Contacts'
import { ForgottenPassword } from './pages/ForgottenPassword'
import { ForgottenPasswordConfirm } from './pages/ForgottenPasswordConfirm'
import { ForgottenPasswordSuccess } from './pages/ForgottenPasswordSuccess'
import { ImportPage } from './pages/Import'
import { LanguagePage } from './pages/Language'
import { Login } from './pages/Login'
import { LoginKey } from './pages/LoginKey'
import { LoginNeonAccountOnboarding } from './pages/LoginNeonAccountOnboarding'
import { LoginNeonAccountPassword } from './pages/LoginNeonAccountPassword'
import { MigrateFromNeon2 } from './pages/MigrateFromNeon2'
import { MigrateFromNeon2Step2 } from './pages/MigrateromNeon2Step2'
import { OnboardingImportWallet } from './pages/OnboardingImportWallet'
import { OnboardingImportWalletStep1 } from './pages/OnboardingImportWalletStep1'
import { OnboardingImportWalletStep2 } from './pages/OnboardingImportWalletStep2'
import { OnboardingImportWalletStep3 } from './pages/OnboardingImportWalletStep3'
import { OnboardingImportWalletStep4 } from './pages/OnboardingImportWalletStep4'
import { OnboardingImportWalletStep5 } from './pages/OnboardingImportWalletStep5'
import { OnboardingLoginNewWallet } from './pages/OnboardingLoginNewWallet'
import { OnboardingLoginNewWalletStep1 } from './pages/OnboardingLoginNewWalletStep1'
import { OnboardingLoginNewWalletStep2 } from './pages/OnboardingLoginNewWalletStep2'
import { OnboardingLoginNewWalletStep3 } from './pages/OnboardingLoginNewWalletStep3'
import { RestoreBackupStep1 } from './pages/RestoreBackupStep1'
import { RestoreBackupStep2 } from './pages/RestoreBackupStep2'
import { RestoreBackupStep3 } from './pages/RestoreBackupStep3'
import { RootPage } from './pages/Root'
import { SendPage } from './pages/Send'
import { SettingsPage } from './pages/Settings'
import { SplashScreen } from './pages/SplashScreen'
import { WalletsPage } from './pages/Wallets'

export const pagesRouter = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: '/splash',
        element: <SplashScreen />,
      },
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
          { path: 'address-or-key', element: <LoginKey /> },
          { path: '', element: <Navigate to="/login/neon-account/password" replace /> },
        ],
      },
      { path: 'forgotten-password', element: <ForgottenPassword /> },
      {
        path: 'forgotten-password-confirm',
        element: <ForgottenPasswordConfirm />,
      },
      {
        path: 'forgotten-password-success',
        element: <ForgottenPasswordSuccess />,
      },
      {
        path: 'onboarding-login-new-wallet',
        element: <OnboardingLoginNewWallet />,
        children: [
          { path: '1?', element: <OnboardingLoginNewWalletStep1 /> },
          { path: '2', element: <OnboardingLoginNewWalletStep2 /> },
          { path: '3', element: <OnboardingLoginNewWalletStep3 /> },
        ],
      },
      {
        path: 'onboarding-import-wallet',
        element: <OnboardingImportWallet />,
        children: [
          { path: '1?', element: <OnboardingImportWalletStep1 /> },
          { path: '2', element: <OnboardingImportWalletStep2 /> },
          { path: '3', element: <OnboardingImportWalletStep3 /> },
          { path: '4', element: <OnboardingImportWalletStep4 /> },
          { path: '5', element: <OnboardingImportWalletStep5 /> },
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
          {
            path: 'import',
            element: <ImportPage />,
          },
          {
            path: 'settings',
            children: [
              { path: '', element: <SettingsPage /> },
              {
                path: 'language',
                element: <LanguagePage />,
              },
              {
                path: 'backup-and-restore',
                element: <BackupAndRestorePage />,
                children: [
                  {
                    path: 'backup?',
                    children: [
                      { path: '1?', element: <BackupStep1 /> },
                      { path: '2', element: <BackupStep2 /> },
                      { path: '', element: <Navigate to="/app/settings/backup-and-restore/backup/1" replace /> },
                    ],
                  },
                  {
                    path: 'restore',
                    children: [
                      { path: '1?', element: <RestoreBackupStep1 /> },
                      { path: '2', element: <RestoreBackupStep2 /> },
                      { path: '3', element: <RestoreBackupStep3 /> },
                    ],
                  },
                  { path: '', element: <Navigate to="/app/settings/backup-and-restore/backup/1" replace /> },
                ],
              },
              {
                path: 'change-password',
                element: <ChangePasswordPage />,
                children: [
                  { path: '1?', element: <ChangePasswordStep1 /> },
                  { path: '2', element: <ChangePasswordStep2 /> },
                  { path: '3', element: <ChangePasswordStep3 /> },
                ],
              },
              {
                path: 'migrate-from-neon2',
                children: [
                  { path: '1?', element: <MigrateFromNeon2 /> },
                  { path: '2', element: <MigrateFromNeon2Step2 /> },
                ],
              },
            ],
          },
          {
            path: 'send',
            element: <SendPage />,
          },
          {
            path: 'contacts',
            element: <ContactsPage />,
          },
        ],
      },
    ],
  },
])
