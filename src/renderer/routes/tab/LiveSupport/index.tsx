import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Separator } from '@renderer/components/Separator'
import { Skeleton } from '@renderer/components/Skeleton'

import { CrispHelper } from '@renderer/helpers/CrispHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { usePageTitle } from '@renderer/hooks/usePageTitle'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import { LiveSupportHowItWorks } from '@renderer/routes/tab/LiveSupport/LiveSupportHowItWorks'

import TbMessage from '@renderer/assets/images/tb-message.svg?react'

export default () => {
  const { t } = useTranslation('pages', { keyPrefix: 'liveSupport' })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = async () => {
    await UtilsHelper.sleep(4000)

    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  usePageTitle(t('title'))

  return (
    <ScreenLayout
      heading={t('title')}
      headerClassName="mb-6 mt-2"
      contentClassName="flex-row"
      withBack={false}
      icon={<TbMessage aria-hidden />}
    >
      <div className="flex h-fit min-h-full w-full pb-8">
        <LiveSupportHowItWorks />

        <Separator className="h-full" containerClassName="w-px bg-gray-300/30" />

        <div className="relative h-auto min-h-fit w-full rounded-r bg-gray-300/20 p-4">
          {isLoading && (
            <Skeleton.Root loading items={<Skeleton.Item className="h-popup-h-screen mx-auto w-87.5 rounded" />} />
          )}

          {hasError && <p className="mx-auto mt-2 text-center text-lg text-gray-100">{t('error')}</p>}

          <iframe
            title={t('title')}
            className={StyleHelper.mergeStyles('mx-auto rounded', { hidden: isLoading || hasError })}
            src={CrispHelper.url}
            allow="clipboard-read; clipboard-write"
            width={350}
            height={600}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      </div>
    </ScreenLayout>
  )
}
