import { Fragment } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'
import { DISCORD_LINK } from '@shared/constants/links'
import { match } from 'ts-pattern'

import { BuyAndSellTokensAboutButton } from './BuyAndSellTokensAboutButton'
import { EBuyAndSellTokensTab } from '.'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

type TProps = {
  tab: EBuyAndSellTokensTab
}

export const BuyAndSellTokensHowItWorks = ({ tab }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.howItWorks' })

  return (
    <div className="flex min-h-0 w-80 max-w-80 min-w-80 flex-col overflow-y-auto rounded-l bg-gray-300/10 p-4 pt-0">
      <div className="flex h-14 max-h-14 min-h-14 items-center gap-x-2">
        <MdInfoOutline aria-hidden={true} className="text-neon size-6" />

        <h2 className="text-sm">{t('title')}</h2>
      </div>

      <Separator className="bg-gray-300/30" />

      <p className="my-7 font-bold">{t('description')}</p>

      <Separator containerClassName="mb-6" className="bg-gray-300/30" />

      {match(tab)
        .with(EBuyAndSellTokensTab.BUY_TOKENS, () => (
          <Fragment>
            <p>
              <Trans t={t} i18nKey="processBuyTokens.text">
                start
                <strong className="block font-bold">middle</strong>
                <em className="italic">end</em>
              </Trans>
            </p>

            <BuyAndSellTokensAboutButton className="mt-1" />

            <p className="mt-6">
              <Trans t={t} i18nKey="processBuyTokens.kyc">
                start
                <span className="font-bold">middle</span>
                end
              </Trans>
            </p>

            <AlertErrorBanner
              className="bg-magenta-700/50 mt-6"
              iconClassName="self-start"
              message={t('processBuyTokens.alert')}
            />
          </Fragment>
        ))
        .with(EBuyAndSellTokensTab.SELL_TOKENS, () => (
          <Fragment>
            <p>
              <Trans t={t} i18nKey="processSellTokens.text">
                start
                <strong className="block font-bold">middle</strong>
                <em className="italic">end</em>
              </Trans>
            </p>

            <BuyAndSellTokensAboutButton className="mt-1" />

            <p className="mt-6">
              <Trans t={t} i18nKey="processSellTokens.kyc">
                start
                <span className="font-bold">middle</span>
                end
              </Trans>
            </p>

            <AlertErrorBanner
              className="bg-magenta-700/50 mt-6"
              iconClassName="self-start"
              message={
                <Trans t={t} i18nKey="processSellTokens.alert">
                  start
                  <span className="uppercase">middle</span>
                  end
                </Trans>
              }
            />
          </Fragment>
        ))
        .otherwise(() => null)}

      <p className="mt-6">{t('observation')}</p>

      <div className="mt-12 flex w-full flex-grow items-end">
        <Link
          label={t('helpButtonLabel')}
          to={DISCORD_LINK}
          target="_blank"
          className="mx-auto mb-5"
          variant="outlined"
          flat
          wide
          iconsOnEdge={false}
          rightIcon={<TbExternalLink aria-hidden={true} />}
        />
      </div>
    </div>
  )
}
