import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Link } from '@renderer/components/Link'

import { ForgottenPasswordLayout } from '@renderer/layouts/ForgottenPasswordLayout'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

export const ForgottenPasswordPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'forgottenPassword' })
  return (
    <ForgottenPasswordLayout heading={t('title')}>
      <div className="flex w-full flex-grow flex-col items-center">
        <div className="flex h-full flex-col justify-center gap-8">
          <p className="text-center text-white">{t('text')}</p>
          <Banner type="warning" message={t('alertCard.text')} textClassName="py-4" iconClassName="text-orange" />
        </div>

        <Link
          to="/forgotten-password-confirm"
          label={t('links.buttonContinueLabel')}
          colorSchema="error"
          variant="outlined"
          className="flex w-full max-w-62.5 items-center justify-center"
          iconsOnEdge={false}
          rightIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
        />
      </div>
    </ForgottenPasswordLayout>
  )
}

export default ForgottenPasswordPage
