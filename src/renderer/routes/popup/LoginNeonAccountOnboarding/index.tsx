import { Trans, useTranslation } from 'react-i18next'

import TbFileImport from '@renderer/assets/images/tb-file-import.svg?react'
import TbPackageExport from '@renderer/assets/images/tb-package-export.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { LoginNeonAccountOnboardingLink } from './LoginNeonAccountOnboardingLink'

export const LoginNeonAccountOnboardingPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginNeonAccountOnboarding' })

  return (
    <section>
      <h2 className="text-center text-lg text-white">{t('description')}</h2>

      <ul className="my-5 flex flex-col gap-y-2">
        <li>
          <LoginNeonAccountOnboardingLink
            to="/onboarding-login-new-wallet"
            title={t('createNewWalletLink.title')}
            icon={<TbWallet aria-hidden />}
            text={
              <Trans t={t} i18nKey="createNewWalletLink.text">
                start
                <span className="uppercase">middle</span>
                end
              </Trans>
            }
          />
        </li>

        <li>
          <LoginNeonAccountOnboardingLink
            to="/onboarding-import-wallet"
            title={t('importExternalWalletLink.title')}
            icon={<TbFileImport aria-hidden />}
            text={
              <Trans t={t} i18nKey="importExternalWalletLink.text">
                start
                <span className="uppercase">middle</span>
                end
              </Trans>
            }
          />
        </li>

        <li>
          <LoginNeonAccountOnboardingLink
            to="/onboarding-import-wallet"
            state={{ isMigration: true }}
            title={t('migrateFromNeon2Link.title')}
            icon={<TbPackageExport aria-hidden />}
            text={
              <Trans t={t} i18nKey="migrateFromNeon2Link.text">
                start
                <span className="uppercase">middle</span>
                end
              </Trans>
            }
          />
        </li>
      </ul>
    </section>
  )
}

export default LoginNeonAccountOnboardingPage
