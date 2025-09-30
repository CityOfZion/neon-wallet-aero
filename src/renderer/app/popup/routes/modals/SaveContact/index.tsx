import { useTranslation } from 'react-i18next'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Banner } from '@renderer/components/Banner'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'
import { TContactAddress, TContactState } from '@shared/types/store'

import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

type TFormData = {
  name: string
  addresses: TContactAddress[]
}

export const SaveContactModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'saveContactModal' })
  const { contact, addresses } = useModalState<TModalState<'save-contact'>>()
  const { modalNavigate } = useModalNavigate()
  const { saveContacts } = useBlockchainActions()

  const { actionData, actionState, handleAct, setData, setDataFromEventWrapper, setError } = useActions<TFormData>({
    name: contact?.name ?? '',
    addresses: contact?.addresses ?? addresses ?? [],
  })

  const isDisabled = actionData.addresses.length <= 0 || !actionState.isValid || actionState.isActing

  const openAddressModal = (address?: TContactAddress, editIndex?: number) => {
    modalNavigate('contact-address-form', {
      state: {
        name: actionData.name,
        initialAddress: address,
        onSaveAddress: (newAddress: TContactAddress) => {
          setData(({ addresses }) => ({
            addresses:
              typeof editIndex === 'number'
                ? addresses.map((addr, idx) => (idx === editIndex ? newAddress : addr))
                : [...addresses, newAddress],
          }))
        },
      },
    })
  }

  const handleOpenDeleteAddressModal = (address: TContactAddress, addressIndex: number) => {
    modalNavigate('delete-contact-address', {
      state: {
        name: actionData.name,
        address: address.address,
        onDelete: () => {
          setData(prev => ({ addresses: prev.addresses.filter((_, idx) => idx !== addressIndex) }))

          if (actionData.addresses.length <= 1) {
            setError('addresses', t('warnings.emptyContactList'))
          }

          modalNavigate(-1)
        },
      },
    })
  }

  const handleSubmit = async (data: TFormData) => {
    if (isDisabled) return

    const nameTrimmed = data.name.trim()

    if (!nameTrimmed.length) {
      setError('name', t('errors.invalidName'))
      return
    }

    const contactData: TContactState = {
      name: nameTrimmed,
      addresses: data.addresses,
      id: contact?.id ?? UtilsHelper.uuid(),
    }

    try {
      await saveContacts([contactData])
      modalNavigate(-1)
    } catch (error) {
      console.error('Failed to save contact:', error)
    }
  }

  return (
    <BottomModalLayout heading={contact ? t('editContact') : t('addContact')}>
      <form className="flex flex-1 flex-col text-xs" onSubmit={handleAct(handleSubmit)}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-6">
            <Input
              label={t('nameInputLabel')}
              clearable
              value={actionData.name}
              errorMessage={actionState.errors.name}
              onChange={setDataFromEventWrapper('name')}
              placeholder={t('nameInputPlaceholder')}
            />

            <div className="flex flex-col">
              <div className="flex flex-col gap-y-2 pb-2 font-bold text-gray-100">
                <p className="uppercase">{t('addressesInputLabel')}</p>
                <ul className="max-h-54 overflow-y-auto">
                  {actionData.addresses.map((address, index) => (
                    <li
                      key={index}
                      className="bg-asphalt mb-5 flex h-8.5 w-full items-center justify-between rounded pr-2 pl-3"
                    >
                      <div className="flex min-w-0 flex-grow items-center gap-x-3">
                        <BlockchainIcon
                          blockchain={address.blockchain}
                          type="white"
                          className="h-3 min-h-3 w-3 min-w-3"
                        />
                        <p className="truncate">{address.address}</p>
                      </div>
                      <Tooltip
                        title={t('editContact')}
                        delayDuration={200}
                        contentProps={{ className: 'bg-asphalt' }}
                        arrowProps={{ className: 'fill-asphalt' }}
                      >
                        <IconButton
                          aria-label={t('editContact')}
                          icon={<TbPencil aria-hidden className="text-blue h-5 w-5" />}
                          type="button"
                          onClick={() => openAddressModal(address, index)}
                          className="items-center"
                        />
                      </Tooltip>
                      <Tooltip
                        title={t('deleteContact')}
                        delayDuration={200}
                        contentProps={{ className: 'bg-asphalt' }}
                        arrowProps={{ className: 'fill-asphalt' }}
                      >
                        <IconButton
                          aria-label={t('deleteContact')}
                          icon={<TbTrash aria-hidden={true} className="text-pink h-5 w-5" />}
                          type="button"
                          onClick={() => handleOpenDeleteAddressModal(address, index)}
                          className="items-center"
                        />
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-y-6">
                {actionData.addresses.length <= 0 && (
                  <Banner type="error" message={t('warnings.noAddressesFound')} className="mt-2" />
                )}

                {actionState.errors.addresses && <AlertErrorBanner message={actionState.errors.addresses} />}

                <Separator />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <Button
              type="button"
              leftIcon={<TbPlus aria-hidden />}
              label={t('addAddressButtonLabel')}
              variant="outlined"
              disabled={!actionData.name}
              className="w-full"
              onClick={() => openAddressModal()}
              iconsOnEdge={false}
            />

            <Button
              variant="contained"
              className="w-full"
              label={t('saveContactButtonLabel')}
              disabled={isDisabled}
              type="submit"
              iconsOnEdge={false}
            />
          </div>
        </div>
      </form>
    </BottomModalLayout>
  )
}
