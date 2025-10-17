import { lazy } from 'react'

import { createHashRouter, Navigate } from 'react-router-dom'

import { PrivatePage } from './popup/Private'
import { ReleaseNotesPage } from './popup/ReleaseNotes'
import { RootPage } from './popup/Root'

const BackupAndRestorePage = lazy(() => import('./popup/BackupAndRestore'))
const BackupAndRestoreBackupStep1Page = lazy(() => import('./popup/BackupAndRestoreBackupStep1'))
const BackupAndRestoreBackupStep2Page = lazy(() => import('./popup/BackupAndRestoreBackupStep2'))
const BackupAndRestoreRestoreStep1Page = lazy(() => import('./popup/BackupAndRestoreRestoreStep1'))
const BackupAndRestoreRestoreStep2Page = lazy(() => import('./popup/BackupAndRestoreRestoreStep2'))
const BackupAndRestoreRestoreStep3Page = lazy(() => import('./popup/BackupAndRestoreRestoreStep3'))
const ChangePasswordPage = lazy(() => import('./popup/ChangePassword'))
const ChangePasswordStep1Page = lazy(() => import('./popup/ChangePasswordStep1'))
const ChangePasswordStep2Page = lazy(() => import('./popup/ChangePasswordStep2'))
const ChangePasswordStep3Page = lazy(() => import('./popup/ChangePasswordStep3'))
const ContactsPage = lazy(() => import('./popup/Contacts'))
const ForgottenPasswordPage = lazy(() => import('./popup/ForgottenPassword'))
const ForgottenPasswordConfirmPage = lazy(() => import('./popup/ForgottenPasswordConfirm'))
const ForgottenPasswordSuccessPage = lazy(() => import('./popup/ForgottenPasswordSuccess'))
const ImportPage = lazy(() => import('./popup/Import'))
const LanguagePage = lazy(() => import('./popup/Language'))
const LoginPage = lazy(() => import('./popup/Login'))
const LoginKeyPage = lazy(() => import('./popup/LoginKey'))
const LoginNeonAccountOnboardingPage = lazy(() => import('./popup/LoginNeonAccountOnboarding'))
const LoginNeonAccountPasswordPage = lazy(() => import('./popup/LoginNeonAccountPassword'))
const MigrateFromNeon2Page = lazy(() => import('./popup/MigrateFromNeon2'))
const MigrateFromNeon2Step2Page = lazy(() => import('./popup/MigrateromNeon2Step2'))
const NetworkConfigurationPage = lazy(() => import('./popup/NetworkConfiguration'))
const OnboardingImportWalletPage = lazy(() => import('./popup/OnboardingImportWallet'))
const OnboardingImportWalletStep1Page = lazy(() => import('./popup/OnboardingImportWalletStep1'))
const OnboardingImportWalletStep2Page = lazy(() => import('./popup/OnboardingImportWalletStep2'))
const OnboardingImportWalletStep3Page = lazy(() => import('./popup/OnboardingImportWalletStep3'))
const OnboardingImportWalletStep4Page = lazy(() => import('./popup/OnboardingImportWalletStep4'))
const OnboardingImportWalletStep5Page = lazy(() => import('./popup/OnboardingImportWalletStep5'))
const OnboardingLoginNewWalletPage = lazy(() => import('./popup/OnboardingLoginNewWallet'))
const OnboardingLoginNewWalletStep1Page = lazy(() => import('./popup/OnboardingLoginNewWalletStep1'))
const OnboardingLoginNewWalletStep2Page = lazy(() => import('./popup/OnboardingLoginNewWalletStep2'))
const OnboardingLoginNewWalletStep3Page = lazy(() => import('./popup/OnboardingLoginNewWalletStep3'))
const SendPage = lazy(() => import('./popup/Send'))
const SettingsPage = lazy(() => import('./popup/Settings'))
const SwapPage = lazy(() => import('./popup/Swap'))
const WalletsPage = lazy(() => import('./popup/Wallets'))
const HelpPage = lazy(() => import('./popup/Help'))
const Neo3NeoXBridgePage = lazy(() => import('./popup/Neo3NeoXBridge'))

export const popupRouter = createHashRouter([
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
                path: 'release-notes',
                element: <ReleaseNotesPage />,
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
