import { useTranslation } from 'react-i18next'

import { Banner } from '@/components/Banner'
import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Input } from '@/components/Input'
import { Separator } from '@/components/Separator'
import { Tooltip } from '@/components/Tooltip'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useActions } from '@/hooks/useActions'
import { useBlockchainActions } from '@/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'
import { TContactAddress, TContactState } from '@/types/store'

import TbPencil from '@/assets/images/tb-pencil.svg?react'
import TbPlus from '@/assets/images/tb-plus.svg?react'

type TFormData = {
  name: string
  addresses: TContactAddress[]
}

export const SaveContactModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'saveContactModal' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
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
                <ul className="max-h-56 overflow-y-auto">
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
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-y-6">
                {actionData.addresses.length <= 0 && (
                  <Banner type="error" message={t('noAddressesFound')} className="mt-2" />
                )}

                {actionState.errors.addresses && <p className="text-pink py-1">{actionState.errors.addresses}</p>}

                <Separator />

                <div className="flex justify-center">
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
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="contained"
            className="w-full"
            label={contact ? commonT('save') : t('saveContactButtonLabel')}
            disabled={isDisabled}
            type="submit"
            iconsOnEdge={false}
          />
        </div>
      </form>
    </BottomModalLayout>
  )
}
