import type { TBSStellarName } from '@cityofzion/bs-stellar'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation } from 'react-router-dom'
import { match, P } from 'ts-pattern'

import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { Separator } from '@renderer/components/Separator'
import { TokenItem } from '@renderer/components/TokenItem'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useStellarTrustlinesQuery } from '@renderer/hooks/useStellarTrustline'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'

import type { TAccount } from '@shared/types/store'

type TLocationState = {
  stellarAccount: TAccount<TBSStellarName>
}

const StellarTrustlinesPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'stellarTrustlines' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper } = useModalNavigate()

  const location = useLocation() as Location<TLocationState>
  const { stellarAccount } = location.state

  const trustlinesQuery = useStellarTrustlinesQuery(stellarAccount)

  return (
    <ScreenLayout heading={t('title')} className="text-white">
      <div className="flex min-h-0 grow flex-col">
        {match(trustlinesQuery)
          .with({ isLoading: true }, () => <Loader />)
          .with({ data: P.when(data => !data || data.length === 0) }, () => (
            <p className="text-center text-gray-300">{t('emptyMessage')}</p>
          ))
          .otherwise(() => (
            <ul className="mb-6 flex flex-col overflow-auto">
              {trustlinesQuery.data?.map(trustline => (
                <li key={`${trustline.token.symbol || trustline.token.name}-${trustline.token.hash}`} className="group">
                  <button
                    aria-label={tCommonGeneral('edit')}
                    className="flex w-full min-w-0 cursor-pointer items-center gap-2 p-2 hover:bg-gray-700/30 focus:bg-gray-700/30 active:bg-gray-700/30"
                    onClick={modalNavigateWrapper('stellar-persist-trustline', {
                      state: {
                        stellarAccount,
                        token: trustline.token,
                        limit: trustline.limit,
                      },
                    })}
                  >
                    <TokenItem blockchain={stellarAccount.blockchain} token={trustline.token} />

                    <TbPencil aria-hidden className="size-5 text-gray-100" />
                  </button>

                  <Separator className="group-last:hidden" />
                </li>
              ))}
            </ul>
          ))}
      </div>

      <Button
        label={t('addTrustlineButtonLabel')}
        flat
        onClick={modalNavigateWrapper('stellar-persist-trustline', { state: { stellarAccount } })}
      />
    </ScreenLayout>
  )
}

export default StellarTrustlinesPage
