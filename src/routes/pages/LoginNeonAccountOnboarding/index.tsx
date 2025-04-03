import { Trans, useTranslation } from 'react-i18next'

import { LoginNeonAccountOnboardingLink } from './LoginNeonAccountOnboardingLink'

import TbFileImport from '@/assets/images/tb-file-import.svg?react'
import TbPackageExport from '@/assets/images/tb-package-export.svg?react'
import TbWallet from '@/assets/images/tb-wallet.svg?react'

export const LoginNeonAccountOnboarding = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginNeonAccountOnboarding' })

  return (
    <section>
      <h2 className="text-center text-lg text-white">{t('description')}</h2>

      <ul className="mt-5 flex flex-col gap-y-2">
        <li>
          <LoginNeonAccountOnboardingLink
            to="/login-onboarding-new-wallet"
            title={t('createNewWalletLink.title')}
            icon={<TbWallet aria-hidden={true} />}
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
            to="#"
            title={t('importExternalWalletLink.title')}
            icon={<TbFileImport aria-hidden={true} />}
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
            to="#"
            state={{ isMigration: true }}
            title={t('migrateFromNeon2Link.title')}
            icon={<TbPackageExport aria-hidden={true} />}
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
