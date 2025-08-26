import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation } from 'react-router-dom'

import { DownloadQRCodePasswordButton } from '@/components/DownloadQRCodePasswordButton'
import { Link } from '@/components/Link'

import MdOutlineAutoAwesome from '@/assets/images/md-outline-auto-awesome.svg?react'
import TbRosetteDiscountCheck from '@/assets/images/tb-rosette-discount-check.svg?react'

type TLocationState = {
  password: string
}

export const OnboardingImportWalletStep5 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step5' })
  const { state } = useLocation() as Location<TLocationState>

  return (
    <Fragment>
      <div className="flex flex-grow flex-col items-center justify-start gap-2.5">
        <p className="text-sm text-white">{t('title')}</p>

        <TbRosetteDiscountCheck aria-hidden={true} className="text-blue mt-3 h-[6.25rem] w-[6.25rem] stroke-1" />
      </div>

      <div className="flex flex-col gap-4">
        <DownloadQRCodePasswordButton password={state.password} />
        <Link
          to="/app/wallets"
          label={t('openWalletButtonLabel')}
          rightIcon={<MdOutlineAutoAwesome aria-hidden />}
          variant="contained"
          className="w-full"
          iconsOnEdge={false}
        />
      </div>
    </Fragment>
  )
}
