import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

import { PrivatePage } from './pages/Private'
import { RootPage } from './pages/Root'

const BackupAndRestorePage = lazy(() => import('./pages/BackupAndRestore'))
const BackupAndRestoreBackupStep1Page = lazy(() => import('./pages/BackupAndRestoreBackupStep1'))
const BackupAndRestoreBackupStep2Page = lazy(() => import('./pages/BackupAndRestoreBackupStep2'))
const BackupAndRestoreRestoreStep1Page = lazy(() => import('./pages/BackupAndRestoreRestoreStep1'))
const BackupAndRestoreRestoreStep2Page = lazy(() => import('./pages/BackupAndRestoreRestoreStep2'))
const BackupAndRestoreRestoreStep3Page = lazy(() => import('./pages/BackupAndRestoreRestoreStep3'))
const ChangePasswordPage = lazy(() => import('./pages/ChangePassword'))
const ChangePasswordStep1Page = lazy(() => import('./pages/ChangePasswordStep1'))
const ChangePasswordStep2Page = lazy(() => import('./pages/ChangePasswordStep2'))
const ChangePasswordStep3Page = lazy(() => import('./pages/ChangePasswordStep3'))
const ContactsPage = lazy(() => import('./pages/Contacts'))
const ForgottenPasswordPage = lazy(() => import('./pages/ForgottenPassword'))
const ForgottenPasswordConfirmPage = lazy(() => import('./pages/ForgottenPasswordConfirm'))
const ForgottenPasswordSuccessPage = lazy(() => import('./pages/ForgottenPasswordSuccess'))
const ImportPage = lazy(() => import('./pages/Import'))
const LanguagePage = lazy(() => import('./pages/Language'))
const LoginPage = lazy(() => import('./pages/Login'))
const LoginKeyPage = lazy(() => import('./pages/LoginKey'))
const LoginNeonAccountOnboardingPage = lazy(() => import('./pages/LoginNeonAccountOnboarding'))
const LoginNeonAccountPasswordPage = lazy(() => import('./pages/LoginNeonAccountPassword'))
const MigrateFromNeon2Page = lazy(() => import('./pages/MigrateFromNeon2'))
const MigrateFromNeon2Step2Page = lazy(() => import('./pages/MigrateromNeon2Step2'))
const NetworkConfigurationPage = lazy(() => import('./pages/NetworkConfiguration'))
const OnboardingImportWalletPage = lazy(() => import('./pages/OnboardingImportWallet'))
const OnboardingImportWalletStep1Page = lazy(() => import('./pages/OnboardingImportWalletStep1'))
const OnboardingImportWalletStep2Page = lazy(() => import('./pages/OnboardingImportWalletStep2'))
const OnboardingImportWalletStep3Page = lazy(() => import('./pages/OnboardingImportWalletStep3'))
const OnboardingImportWalletStep4Page = lazy(() => import('./pages/OnboardingImportWalletStep4'))
const OnboardingImportWalletStep5Page = lazy(() => import('./pages/OnboardingImportWalletStep5'))
const OnboardingLoginNewWalletPage = lazy(() => import('./pages/OnboardingLoginNewWallet'))
const OnboardingLoginNewWalletStep1Page = lazy(() => import('./pages/OnboardingLoginNewWalletStep1'))
const OnboardingLoginNewWalletStep2Page = lazy(() => import('./pages/OnboardingLoginNewWalletStep2'))
const OnboardingLoginNewWalletStep3Page = lazy(() => import('./pages/OnboardingLoginNewWalletStep3'))
const SendPage = lazy(() => import('./pages/Send'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const SwapPage = lazy(() => import('./pages/Swap'))
const WalletsPage = lazy(() => import('./pages/Wallets'))
const HelpPage = lazy(() => import('./pages/Help'))
const Neo3NeoXBridgePage = lazy(() => import('./pages/Neo3NeoXBridge'))

export const pagesRouter = createHashRouter([
  {
    element: <RootPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
        children: [
          {
            path: 'neon-account',
            children: [
              { path: 'password', element: <LoginNeonAccountPasswordPage /> },
              { path: 'onboarding', element: <LoginNeonAccountOnboardingPage /> },
              { path: '', element: <Navigate to="/login/neon-account/password" replace /> },
            ],
          },
          { path: 'hardware-wallet' },
          { path: 'address-or-key', element: <LoginKeyPage /> },
          { path: '', element: <Navigate to="/login/neon-account/password" replace /> },
        ],
      },
      { path: 'forgotten-password', element: <ForgottenPasswordPage /> },
      {
        path: 'forgotten-password-confirm',
        element: <ForgottenPasswordConfirmPage />,
      },
      {
        path: 'forgotten-password-success',
        element: <ForgottenPasswordSuccessPage />,
      },
      {
        path: 'onboarding-login-new-wallet',
        element: <OnboardingLoginNewWalletPage />,
        children: [
          { path: '1?', element: <OnboardingLoginNewWalletStep1Page /> },
          { path: '2', element: <OnboardingLoginNewWalletStep2Page /> },
          { path: '3', element: <OnboardingLoginNewWalletStep3Page /> },
        ],
      },
      {
        path: 'onboarding-import-wallet',
        element: <OnboardingImportWalletPage />,
        children: [
          { path: '1?', element: <OnboardingImportWalletStep1Page /> },
          { path: '2', element: <OnboardingImportWalletStep2Page /> },
          { path: '3', element: <OnboardingImportWalletStep3Page /> },
          { path: '4', element: <OnboardingImportWalletStep4Page /> },
          { path: '5', element: <OnboardingImportWalletStep5Page /> },
        ],
      },
      {
        element: <PrivatePage />,
        children: [
          {
            path: 'wallets?',
            element: <WalletsPage />,
          },
          {
            path: 'import',
            element: <ImportPage />,
          },
          { path: 'help', element: <HelpPage /> },
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
                      { path: '1?', element: <BackupAndRestoreBackupStep1Page /> },
                      { path: '2', element: <BackupAndRestoreBackupStep2Page /> },
                      { path: '', element: <Navigate to="settings/backup-and-restore/backup/1" replace /> },
                    ],
                  },
                  {
                    path: 'restore',
                    children: [
                      { path: '1?', element: <BackupAndRestoreRestoreStep1Page /> },
                      { path: '2', element: <BackupAndRestoreRestoreStep2Page /> },
                      { path: '3', element: <BackupAndRestoreRestoreStep3Page /> },
                    ],
                  },
                  { path: '', element: <Navigate to="settings/backup-and-restore/backup/1" replace /> },
                ],
              },
              {
                path: 'change-password',
                element: <ChangePasswordPage />,
                children: [
                  { path: '1?', element: <ChangePasswordStep1Page /> },
                  { path: '2', element: <ChangePasswordStep2Page /> },
                  { path: '3', element: <ChangePasswordStep3Page /> },
                ],
              },
              {
                path: 'migrate-from-neon2',
                children: [
                  { path: '1?', element: <MigrateFromNeon2Page /> },
                  { path: '2', element: <MigrateFromNeon2Step2Page /> },
                ],
              },
              {
                path: 'network-configuration',
                element: <NetworkConfigurationPage />,
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
          {
            path: 'swap',
            element: <SwapPage />,
          },
          {
            path: 'neo3-neox-bridge',
            element: <Neo3NeoXBridgePage />,
          },
        ],
      },
    ],
  },
])
