import { useTranslation } from 'react-i18next'

import { Link } from '@/components/Link'
import { ForgottenPasswordLayout } from '@/layouts/ForgottenPasswordLayout'

import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

export const ForgottenPasswordSuccess = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'forgottenPasswordSuccess' })

  return (
    <ForgottenPasswordLayout heading={t('title')} withBackButton={false}>
      <div className="flex flex-grow flex-col items-center gap-y-8 text-center">
        <TbRosetteDiscountCheck
          className="bg-asphalt text-blue mt-8 h-25 w-25 rounded-full stroke-1 p-1.5"
          aria-hidden
        />
        <p className="text-white">{t('text')}</p>
        <p className="flex-grow text-sm text-gray-300">{t('description')}</p>

        <Link
          to="/app"
          label={t('goToWelcomeLinkLabel')}
          colorSchema="neon"
          variant="contained"
          className="mx-auto w-full max-w-62.5"
        />
      </div>
    </ForgottenPasswordLayout>
  )
}
