import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdiInformationOutline from '@renderer/assets/images/mdi-information-outline.svg?react'
import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

type TFormData = {
  accountName: string
}

export const CreateAccountStep1Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createAccountStep1' })
  const { modalNavigate, modalEraseWrapper } = useModalNavigate()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TFormData>({ accountName: '' })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const accountName = event.target.value
    setData({ accountName })
    if (accountName.trim().length === 0) {
      setError('accountName', t('errors.accountNameEmpty'))
    }
  }

  const handlePressContinue = async () => {
    modalNavigate('create-account-2', {
      state: {
        accountName: actionData.accountName.trim(),
      },
    })
  }

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <h3 className="px-3.5 pb-5 text-sm text-gray-100">{t('subtitle')}</h3>
      <form className="flex w-full flex-grow flex-col justify-between" onSubmit={handleAct(handlePressContinue)}>
        <div className="flex flex-col items-center rounded px-3.5 py-2">
          <Input
            name="name"
            id="name"
            maxLength={20}
            value={actionData.accountName}
            errorMessage={actionState.errors.accountName}
            autoFocus
            placeholder={t('accountNamePlaceholder')}
            label={t('accountNameLabel')}
            onChange={handleChange}
            clearable
          />
        </div>

        <div className="mx-3.5 mt-2.5 mb-5 flex rounded-sm bg-gray-300/30">
          <div className="flex flex-col items-center justify-center rounded-l-sm bg-gray-300/30 px-3 py-5">
            <MdiInformationOutline aria-hidden className="text-blue w-6" />
          </div>

          <div className="px-5 py-2.5">
            <p className="text-xs">{t('alertText')}</p>
          </div>
        </div>

        <div className="mt-auto flex gap-2.5 px-3.5">
          <Button
            variant="card"
            label={t('cancelButtonLabel')}
            colorSchema="gray"
            type="button"
            onClick={modalEraseWrapper('bottom')}
          />
          <Button
            className="w-full"
            variant="card"
            label={t('nextButtonLabel')}
            leftIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
            iconsOnEdge={false}
            type="submit"
            disabled={actionState.isActing || !actionState.isValid}
            loading={actionState.isActing}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default CreateAccountStep1Modal
