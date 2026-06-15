import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { DashedSeparator } from '@renderer/components/DashedSeparator'
import { Separator } from '@renderer/components/Separator'

import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNeo3VoteGetVoteDetailsByAddress } from '@renderer/hooks/useNeo3Vote'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

import type { TModalState } from '@shared/types/modal'

export const Neo3VoteSuccessModal = () => {
  const { candidate, neo3Account } = useModalState<TModalState<'neo3-vote-success'>>()
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteSuccess' })
  const { modalEraseWrapper } = useModalNavigate()

  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address)

  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance || 0

  return (
    <BottomModalLayout heading={t('title')} withBack={false}>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col items-center gap-y-6">
          <TbRosetteDiscountCheck aria-hidden className="text-blue size-21 stroke-1" />
          <p className="text-xl">{t('subtitle')}</p>
        </div>

        <DashedSeparator />

        <p className="-mb-2 text-gray-100 uppercase">{t('votingDetailsLabel')}</p>

        <ul className="flex w-full flex-col gap-y-2 rounded bg-gray-900/50 p-4 text-xs break-all">
          <li className="flex flex-col">
            <p className="text-blue">{t('accountNameLabel')}</p>
            <p className="mt-0.5">{neo3Account.name}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <p className="text-blue">{t('addressLabel')}</p>
            <p className="mt-0.5">{neo3Account.address}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <p className="text-blue">{t('candidateLabel')}</p>
            <p className="mt-0.5">{candidate.name}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <p className="text-blue">{t('hashLabel')}</p>
            <p className="mt-0.5">{candidate.hash}</p>
            <Separator containerClassName="mt-2" />
          </li>
          <li className="flex flex-col">
            <p className="text-blue">{t('votesLabel')}</p>
            <p className="mt-0.5">
              {neoAmount} {BSNeo3Constants.NEO_TOKEN.symbol}
            </p>
          </li>
        </ul>

        <Button
          label={t('returnButtonLabel')}
          variant="card"
          leftIcon={<TbArrowLeft aria-hidden />}
          iconsOnEdge={false}
          onClick={modalEraseWrapper('bottom')}
        />
      </div>
    </BottomModalLayout>
  )
}

export default Neo3VoteSuccessModal
