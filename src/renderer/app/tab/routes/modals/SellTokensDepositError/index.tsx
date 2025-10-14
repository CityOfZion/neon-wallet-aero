import { useTranslation } from 'react-i18next'
import { Separator } from '@renderer/components/Separator'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { SideModalLayout } from '@renderer/layouts/SideModalLayout'
import { TModalState } from '@shared/types/modal'

import MdCancel from '@renderer/assets/images/md-cancel.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'

export const SellTokensDepositErrorModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositError' })
  const { errorMessage } = useModalState<TModalState<'sell-tokens-deposit-error'>>()

  return (
    <SideModalLayout heading={t('title')} icon={<TbStepInto aria-hidden={true} />}>
      <div className="flex min-h-0 flex-grow flex-col items-center">
        <Separator className="bg-gray-300/30" />

        <div className="bg-asphalt mt-8 flex size-28 items-center rounded-full p-2">
          <MdCancel aria-hidden={true} className="text-pink size-24" />
        </div>

        <p className="mt-6 text-lg text-white">{t('subtitle')}</p>

        <section className="flex w-full min-w-0 flex-grow flex-col text-gray-100">
          <h3 className="text-md mt-2 px-14 text-center leading-5">{t('text')}</h3>

          <div className="mt-6 flex w-full flex-col gap-y-2 text-xs">
            <p className="font-bold uppercase">{t('errorMessageLabel')}</p>
            <p className="bg-asphalt max-h-48 w-full overflow-y-auto rounded p-3 break-words whitespace-pre-wrap">
              {errorMessage || t('unknownError')}
            </p>
          </div>
        </section>
      </div>
    </SideModalLayout>
  )
}
