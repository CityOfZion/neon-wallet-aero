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

import TbCheck from '@renderer/assets/images/tb-check.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import type { TModalState } from '@shared/types/modal'
import type { TContactAddress, TContactState } from '@shared/types/store'

type TFormData = {
  name: string
  addresses: TContactAddress[]
}

export const SaveContactModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'saveContact' })
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
      console.error(error)
    }
  }

  return (
    <BottomModalLayout heading={contact ? t('editContact') : t('addContact')}>
      <form className="flex flex-1 flex-col text-xs" onSubmit={handleAct(handleSubmit)}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-6">
            <Input
              name="name"
              id="name"
              label={t('nameInputLabel')}
              clearable
              value={actionData.name}
              errorMessage={actionState.errors.name}
              onChange={setDataFromEventWrapper('name')}
              placeholder={t('nameInputPlaceholder')}
              contentClassName="bg-asphalt placeholder:text-neon"
            />

            <Separator />

            <div className="flex flex-col">
              <div className="flex flex-col gap-y-2 pb-2 font-bold text-gray-100">
                <p className="uppercase">{t('addressesInputLabel')}</p>

                <ul className="flex max-h-54 flex-col gap-y-2 overflow-y-auto">
                  {actionData.addresses.map((address, index) => (
                    <li
                      key={index}
                      className="bg-asphalt flex h-8.5 w-full items-center justify-between rounded px-4 py-6"
                    >
                      <div className="flex min-w-0 flex-grow items-center gap-x-3">
                        <BlockchainIcon
                          blockchain={address.blockchain}
                          type="white"
                          className="size-4 min-h-4 min-w-4"
                        />
                        <p className="truncate text-sm font-normal text-white">{address.address}</p>
                      </div>

                      <div className="flex gap-x-1">
                        <Tooltip
                          title={t('editAddressButtonLabel')}
                          delayDuration={200}
                          contentProps={{ className: 'bg-asphalt' }}
                          arrowProps={{ className: 'fill-asphalt' }}
                        >
                          <IconButton
                            aria-label={t('editAddressButtonLabel')}
                            icon={<TbPencil aria-hidden className="text-neon size-6" />}
                            type="button"
                            onClick={() => openAddressModal(address, index)}
                            className="items-center"
                          />
                        </Tooltip>

                        <Tooltip
                          title={t('deleteAddressButtonLabel')}
                          delayDuration={200}
                          contentProps={{ className: 'bg-asphalt' }}
                          arrowProps={{ className: 'fill-asphalt' }}
                        >
                          <IconButton
                            aria-label={t('deleteAddressButtonLabel')}
                            icon={<TbTrash aria-hidden className="text-pink size-6" />}
                            type="button"
                            onClick={() => handleOpenDeleteAddressModal(address, index)}
                            className="items-center"
                          />
                        </Tooltip>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-y-6">
                {actionData.addresses.length <= 0 && (
                  <Banner
                    type="error"
                    message={t('warnings.noAddressesFound')}
                    className="mt-2"
                    textClassName="text-sm"
                  />
                )}
                {actionState.errors.addresses && <AlertErrorBanner message={actionState.errors.addresses} />}
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-y-2 pt-2">
            <Button
              type="button"
              leftIcon={<TbPlus aria-hidden />}
              label={t('addAddressButtonLabel')}
              variant="text"
              disabled={!actionData.name}
              className="w-full"
              onClick={() => openAddressModal()}
              iconsOnEdge={false}
            />

            <Button
              variant="card"
              leftIcon={<TbCheck aria-hidden />}
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

export default SaveContactModal
