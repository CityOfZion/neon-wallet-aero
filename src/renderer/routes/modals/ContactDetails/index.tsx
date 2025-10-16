import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useContactsSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import { contactReducerActions } from '@renderer/store/reducers/contact'
import type { TModalState } from '@shared/types/modal'
import type { TContactState } from '@shared/types/store'

export const ContactDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'contactDetails' })
  const { contactId } = useModalState<TModalState<'contact-details'>>()
  const { modalNavigate, modalErase, modalNavigateWrapper } = useModalNavigate()
  const dispatch = useAppDispatch()

  const { contacts } = useContactsSelector()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleCopyAddress = (address: string) => {
    UtilsHelper.copyToClipboard(address)
  }

  const handleOpenDeleteContactModal = () => {
    if (!contact) return

    modalNavigate('delete-contact', {
      state: {
        name: contact.name,
        onDelete: () => handleDeleteContact(contact),
      },
    })
  }

  const handleDeleteContact = (contact: TContactState) => {
    dispatch(contactReducerActions.deleteContact(contact.id))
    modalErase('bottom')
  }

  if (!contact) {
    return (
      <BottomModalLayout heading={t('title')}>
        <div className="flex items-center justify-center p-4">
          <p className="text-gray-400">{t('contactNotFound')}</p>
        </div>
      </BottomModalLayout>
    )
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="flex min-h-0 flex-grow flex-col items-center gap-4 pt-2">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-300/30 text-xs text-gray-100">
          <p className="text-2xl">{StringHelper.getInitials(contact.name)}</p>
        </div>
        <p className="max-w-sm truncate text-center text-lg">{contact.name}</p>

        <div className="flex w-full justify-center gap-4">
          <Button
            leftIcon={<TbPencil aria-hidden className="text-neon" />}
            label={t('editContactButtonLabel')}
            variant="outlined"
            colorSchema="neon"
            onClick={modalNavigateWrapper('save-contact', { state: { contact } })}
            flat
          />

          <Button
            leftIcon={<TbTrash aria-hidden className="text-pink" />}
            label={t('deleteContactButtonLabel')}
            variant="outlined"
            colorSchema="error"
            flat
            onClick={handleOpenDeleteContactModal}
          />
        </div>

        <Separator />

        <div className="flex min-h-0 w-full flex-grow flex-col space-y-4">
          <p className="text-center text-sm tracking-wide text-gray-400 uppercase">{t('walletAddresses')}</p>

          <ul className="max-h-60 space-y-3 overflow-y-auto">
            {contact.addresses.map((addressItem, index) => {
              const { blockchain, address } = addressItem

              return (
                <li key={index} className="flex items-center gap-3 rounded bg-gray-800/50 p-3">
                  <div className="flex-shrink-0">
                    <BlockchainIcon blockchain={blockchain} className="h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" />
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-grow">
                        <p className="mb-1 text-sm text-gray-300 capitalize">{blockchain}</p>

                        <p className="truncate text-sm text-white">{StringHelper.truncateMiddle(address, 34)}</p>
                      </div>

                      <Button
                        variant="text-slim"
                        onClick={() => handleCopyAddress(address)}
                        className="flex-shrink-0 p-2"
                        title={t('copyAddressButtonLabel')}
                      >
                        <MdContentCopy aria-hidden className="h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default ContactDetailsModal
