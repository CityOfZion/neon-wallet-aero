import { useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Separator } from '@renderer/components/Separator'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import SumsubLogo from '@renderer/assets/images/sumsub-logo.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import UnlimitLogo from '@renderer/assets/images/unlimit-logo.svg?react'

import { BuyAndSellTokensAboutListItem } from './BuyAndSellTokensAboutListItem'

export const BuyAndSellTokensAboutModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensAbout' })

  return (
    <SideModalLayout heading={t('title')} icon={<TbHelp aria-hidden />}>
      <div className="flex flex-col gap-y-6">
        <Separator className="bg-gray-300/30" />

        <ul className="flex w-full flex-col gap-y-6">
          <BuyAndSellTokensAboutListItem
            text={t('sumbsubText')}
            linkLabel={t('sumbsubLinkLabel')}
            link={BuyAndSellTokensHelper.sumsubTermsAndConditionsUrl}
            image={<SumsubLogo aria-hidden />}
          />

          <BuyAndSellTokensAboutListItem
            text={t('unlimitText')}
            linkLabel={t('unlimitLinkLabel')}
            link={BuyAndSellTokensHelper.unlimitUseTermsUrl}
            image={<UnlimitLogo aria-hidden />}
          />
        </ul>

        <p className="text-sm">{t('description')}</p>

        <AlertErrorBanner className="bg-magenta-700/50 text-sm" message={t('alertLabel')} />
      </div>
    </SideModalLayout>
  )
}

export default BuyAndSellTokensAboutModal
