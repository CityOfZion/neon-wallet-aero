import { useTranslation } from 'react-i18next'

import { Link } from '@/components/Link'

import MdOutlineAutoAwesome from '@/assets/images/md-outline-auto-awesome.svg?react'
import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

export const LoginOnboardingNewWalletStep3 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'loginOnboardingNewWalletStep3' })

  return (
    <div className="flex w-full flex-grow flex-col items-center">
      <div className="flex flex-grow flex-col items-center">
        <TbRosetteDiscountCheck className="text-blue h-25 w-25 stroke-1" aria-hidden />
        <h3 className="mt-3 text-center text-sm font-bold text-white">{t('description')}</h3>
      </div>

      <Link
        label={t('buttonContinueLabel')}
        to="/app"
        variant="card"
        className="w-full"
        rightIcon={<MdOutlineAutoAwesome aria-hidden />}
        iconsOnEdge={false}
      />
    </div>
  )
}
