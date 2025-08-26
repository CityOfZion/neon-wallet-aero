import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'

import TbPlusIcon from '@/assets/images/tb-plus.svg?react'

export function DappConnectionsEmptyState() {
  const { t } = useTranslation('components', { keyPrefix: 'dappConnections.emptyState' })

  return (
    <section
      aria-labelledby="dapp-connections-empty-title"
      className="bg-dark-grey mx-auto my-5 flex w-full flex-col items-center justify-center rounded-sm p-6"
    >
      <h2 id="dapp-connections-empty-title" className="mb-6 text-center text-lg font-normal text-gray-100">
        {t('title')}
      </h2>

      <Button
        label={t('connectButtonLabel')}
        leftIcon={<TbPlusIcon className="h-5 w-5" aria-hidden />}
        iconsOnEdge={false}
        variant="outlined"
        colorSchema="neon"
      />
    </section>
  )
}
