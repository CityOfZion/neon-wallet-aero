import { Trans, useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Link } from '@renderer/components/Link'
import { Separator } from '@renderer/components/Separator'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import TbBrandDiscord from '@renderer/assets/images/tb-brand-discord.svg?react'

import { ConstantsURLHelper } from '@shared/helpers/ConstantsURLHelper'

export const LiveSupportHowItWorks = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'liveSupport.howItWorks' })

  return (
    <div className="flex w-86 max-w-86 min-w-86 flex-col rounded-l bg-gray-300/10 p-4 pt-0">
      <div className="flex h-14 max-h-14 min-h-14 items-center gap-x-2">
        <MdInfoOutline aria-hidden className="text-neon size-6" />

        <h2 className="text-sm">{t('title')}</h2>
      </div>

      <Separator className="bg-gray-300/30" />

      <p className="mt-6">
        <Trans t={t} i18nKey="description">
          start
          <strong className="font-extrabold">middle</strong>
          end
        </Trans>
      </p>

      <AlertErrorBanner
        className="bg-magenta-700/50 mt-8"
        iconClassName="self-start"
        message={
          <Trans t={t} i18nKey="takeCareAlert">
            start
            <strong className="font-extrabold">middle</strong>
            end
          </Trans>
        }
      />

      <div className="mt-12 flex w-full grow items-end">
        <Link
          label={t('discordLinkLabel')}
          to={ConstantsURLHelper.cozDiscordUrl}
          className="mx-auto mb-4"
          target="_blank"
          variant="outlined"
          wide
          iconsOnEdge={false}
          rightIcon={<TbBrandDiscord aria-hidden />}
        />
      </div>
    </div>
  )
}
