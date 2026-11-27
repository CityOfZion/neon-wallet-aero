import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useDebounceFunction } from '@renderer/hooks/useDebounceFunction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import { AppError } from '@shared/helpers/ErrorHelper'
import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  name: string
  url: string
  isValidating: boolean
  isValid: boolean
}

const NAME_MAX_LENGTH = 10

export const SaveCustomNetworkModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'saveCustomNetwork' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { blockchain, network } = useModalState<TModalState<'save-custom-network'>>()
  const { modalNavigate, modalNavigateWrapper } = useModalNavigate()
  const dispatch = useAppDispatch()
  const debounce = useDebounceFunction()

  const { actionData, actionState, setData, setDataFromEventWrapper, setError, clearErrors, handleAct } =
    useActions<TActionsData>({
      name: network?.name || '',
      url: network?.url || '',
      isValidating: false,
      isValid: false,
    })

  const trimmedName = actionData.name.trim()
  const isNameEmpty = trimmedName.length === 0
  const isNameTooLong = trimmedName.length > NAME_MAX_LENGTH

  const handleUrlChange = (url: string) => {
    url = StringHelper.normalizeText(url)

    const isValidating = !!url

    clearErrors('url')
    setData({ url, isValid: false, isValidating })

    debounce(async () => {
      if (!isValidating) return

      if (!UtilsHelper.validateURL(url)) {
        setError('url', t('errors.invalidURL'))
        setData({ isValidating: false })

        return
      }

      try {
        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

        await service.pingNetwork(url)

        setData({ isValid: true })
      } catch (error) {
        setError('url', AppError.wrap(error, t('errors.notConnect')).message)
      } finally {
        setData({ isValidating: false })
      }
    })
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

  useEffect(() => {
    if (network) handleUrlChange(network.url)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  return (
    <BottomModalLayout heading={t('title')}>
      <form className="flex flex-1 flex-col" onSubmit={handleAct(handleSubmit)}>
        <div className="flex flex-1 flex-col gap-y-4">
          <Input
            label={t('nameLabel')}
            placeholder={t('namePlaceholder')}
            id="name"
            name="name"
            contentClassName="bg-asphalt"
            value={actionData.name}
            maxLength={NAME_MAX_LENGTH}
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
            onChange={event => handleUrlChange(event.target.value)}
          />

          {actionData.isValid && <Banner type="success" textClassName="text-sm" message={t('successUrl')} />}
        </div>

        {network && (
          <Button
            label={t('deleteNetworkButtonLabel')}
            type="button"
            className="mt-5"
            variant="outlined"
            colorSchema="error"
            iconsOnEdge={false}
            leftIcon={<TbTrash aria-hidden />}
            onClick={handleDelete}
          />
        )}

        <div className="mt-5 flex flex-col gap-y-5">
          <Separator />

          <div className="flex gap-x-3">
            <Button
              label={tCommonGeneral('cancel')}
              type="button"
              className="w-30"
              variant="card"
              colorSchema="gray"
              onClick={modalNavigateWrapper(-1)}
            />

            <Button
              label={tCommonGeneral('save')}
              type="submit"
              className="w-full"
              variant="card"
              iconsOnEdge={false}
              disabled={!actionData.isValid}
              leftIcon={<TbCheck aria-hidden />}
            />
          </div>
        </div>
      </form>
    </BottomModalLayout>
  )
}

export default SaveCustomNetworkModal
