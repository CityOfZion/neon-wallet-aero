import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  name: string
  url: string
  isValidating: boolean
  isValid: boolean
}

const MAX_NAME_LENGTH = 10

export const SaveCustomNetworkModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'saveCustomNetwork' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { blockchain, network } = useModalState<TModalState<'save-custom-network'>>()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const dispatch = useAppDispatch()

  const { actionData, actionState, setData, setDataFromEventWrapper, setError, clearErrors, handleAct } =
    useActions<TActionsData>({
      name: network?.name || '',
      url: network?.url || '',
      isValidating: false,
      isValid: !!network,
    })

  const trimmedName = actionData.name.trim()
  const isNameEmpty = trimmedName.length === 0
  const isNameTooLong = trimmedName.length > MAX_NAME_LENGTH
  const isDisabled = isNameEmpty || isNameTooLong || !actionData.isValid || actionData.isValidating

  const handleUrlBlur = async () => {
    setData({ isValid: false })

    if (!UtilsHelper.validateURL(actionData.url)) {
      setError('url', t('errors.invalidURL'))
      return
    }

    setData({ isValidating: true })

    try {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

      await service.pingNetwork(actionData.url)

      clearErrors('url')
      setData({ isValid: true })
    } catch {
      setError('url', t('errors.notConnect'))
    } finally {
      setData({ isValidating: false })
    }
  }

  const handleDelete = () => {
    if (!network) return

    dispatch(settingsReducerActions.deleteCustomNetwork({ blockchain, network }))

    modalNavigate(-1)
  }

  const handleSubmit = (data: TActionsData) => {
    if (isNameEmpty) {
      setError('name', t('errors.nameIsRequired'))
      return
    }

    if (isNameTooLong) {
      setError('name', t('errors.nameIsTooLong'))
      return
    }

    dispatch(
      settingsReducerActions.saveCustomNetwork({
        blockchain,
        network: {
          id: network?.id || UtilsHelper.uuid(),
          name: trimmedName,
          url: data.url,
          type: 'custom',
        },
      })
    )

    modalNavigate(-1)
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <form className="flex flex-1 flex-col" onSubmit={handleAct(handleSubmit)}>
        <div className="flex flex-1 flex-col gap-y-6">
          <Input
            id="name"
            name="name"
            contentClassName="bg-asphalt"
            maxLength={MAX_NAME_LENGTH}
            label={t('nameLabel')}
            placeholder={t('namePlaceholder')}
            value={actionData.name}
            errorMessage={actionState.errors.name}
            onChange={setDataFromEventWrapper('name')}
            autoFocus
          />

          <Input
            id="url"
            name="url"
            contentClassName="bg-asphalt"
            label={t('urlLabel')}
            placeholder={t('urlPlaceholder')}
            hint={t('urlHint')}
            pastable
            maxLength={200}
            value={actionData.url}
            loading={actionData.isValidating}
            errorMessage={actionState.errors.url}
            onChange={setDataFromEventWrapper('url')}
            onBlur={handleUrlBlur}
            disabled={actionData.isValidating}
          />

          {actionData.isValid && <Banner type="success" textClassName="text-sm" message={t('successUrl')} />}
        </div>

        {network && (
          <Button
            className="mb-3"
            type="button"
            label={t('deleteButtonLabel')}
            variant="outlined"
            colorSchema="error"
            leftIcon={<TbTrash aria-hidden />}
            iconsOnEdge={false}
            onClick={handleDelete}
          />
        )}

        <div className="flex flex-col gap-y-5">
          <Separator className="mt-2" />

          <div className="flex gap-x-3">
            <Button
              className="w-30"
              type="button"
              label={tCommonGeneral('cancel')}
              variant="card"
              colorSchema="gray"
              onClick={modalNavigateWrapper(-1)}
            />

            <Button
              className="w-full"
              type="submit"
              label={tCommonGeneral('save')}
              variant="card"
              leftIcon={<TbCheck aria-hidden />}
              iconsOnEdge={false}
              disabled={isDisabled}
            />
          </div>
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default SaveCustomNetworkModal
