import { Fragment } from 'react'

import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { BlockchainSelect } from '@renderer/components/BlockchainSelect'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNameService } from '@renderer/hooks/useNameService'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TModalState } from '@shared/types/modal'

type TActionData = {
  address: string
  blockchain?: TBlockchainServiceKey
}

export const ContactAddressFormModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'contactAddressFormModal' })
  const { name, initialAddress, onSaveAddress } = useModalState<TModalState<'contact-address-form'>>()
  const { modalNavigate } = useModalNavigate()

  const {
    isNameService,
    isValidAddressOrDomainAddress,
    isValidatingAddressOrDomainAddress,
    validateAddressOrNS,
    validatedAddress,
  } = useNameService()

  const { actionData, setData, handleAct } = useActions<TActionData>({
    address: initialAddress?.address || '',
    blockchain: initialAddress?.blockchain,
  })

  const isEditing = !!initialAddress

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const fixedValue = UtilsHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true })
    setData({ address: fixedValue })
    validateAddressOrNS(fixedValue, actionData.blockchain)
  }

  const handleSelectBlockchain = (blockchain: TBlockchainServiceKey) => {
    setData({ blockchain })

    const { address } = actionData

    if (address) validateAddressOrNS(address, blockchain)
  }

  const handleSubmit = ({ blockchain, address }: TActionData) => {
    if (!blockchain || !address) return

    onSaveAddress({ blockchain, address })

    modalNavigate(-1)
  }

  return (
    <BottomModalLayout heading={isEditing ? t('editAddress') : t('addAddress')}>
      <form className="flex h-full flex-col justify-between" onSubmit={handleAct(handleSubmit)}>
        <div className="flex flex-col gap-y-6 text-sm">
          <div>
            <p className="pb-2 text-xs font-bold text-gray-100 uppercase">{t('name')}</p>
            {StringHelper.truncateMiddle(name, 35)}
          </div>
          <Separator />

          <div className="flex flex-col gap-y-2">
            <p className="text-xs font-bold text-gray-100 uppercase">{t('blockchain')}</p>

            <BlockchainSelect value={actionData.blockchain} onSelect={handleSelectBlockchain} />
          </div>

          <Input
            label={t('addressOrDomain')}
            value={actionData.address}
            onChange={handleChange}
            clearable
            pastable
            loading={isValidatingAddressOrDomainAddress}
            disabled={!actionData.blockchain}
            error={isValidAddressOrDomainAddress === false}
          />

          {isNameService && <p className="text-gray-300">{validatedAddress}</p>}

          {isValidAddressOrDomainAddress !== undefined && (
            <Fragment>
              {!isValidAddressOrDomainAddress ? (
                <Banner message={t('messages.invalidAddress')} type="error" />
              ) : (
                <Banner
                  message={isNameService ? t('messages.nnsComplete') : t('messages.addressComplete')}
                  type="success"
                />
              )}
            </Fragment>
          )}
        </div>

        <Button
          label={isEditing ? t('updateAddressButtonLabel') : t('saveAddressButtonLabel')}
          className="w-full"
          type="submit"
          disabled={!isValidAddressOrDomainAddress || isValidatingAddressOrDomainAddress}
        />
      </form>
    </BottomModalLayout>
  )
}

export default ContactAddressFormModal
