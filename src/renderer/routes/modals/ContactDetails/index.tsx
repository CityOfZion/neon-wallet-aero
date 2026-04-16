import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Separator } from '@renderer/components/Separator'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useContactsSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbPencil from '@renderer/assets/images/tb-pencil.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'

import { contactReducerActions } from '@renderer/store/reducers/contact'
import type { TModalState } from '@shared/types/modal'
import type { TContact } from '@shared/types/store'

export const ContactDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'contactDetails' })
  const { contactId } = useModalState<TModalState<'contact-details'>>()
  const { modalNavigate, modalErase, modalNavigateWrapper } = useModalNavigate()
  const dispatch = useAppDispatch()

  const { contacts } = useContactsSelector()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleOpenDeleteContactModal = () => {
    if (!contact) return

    modalNavigate('delete-contact', {
      state: {
        name: contact.name,
        onDelete: () => handleDeleteContact(contact),
      },
    })
  }

  const handleDeleteContact = (contact: TContact) => {
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
      <div className="flex min-h-0 flex-grow flex-col items-center gap-6 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex size-21 shrink-0 items-center justify-center rounded-full bg-gray-300/15 text-xs text-gray-100">
            <p className="text-2xl">{StringHelper.getInitials(contact.name)}</p>
          </div>

          <p className="max-w-sm truncate text-center text-lg">{contact.name}</p>
        </div>

        <div className="flex w-full justify-center gap-4">
          <Button
            leftIcon={<TbTrash aria-hidden className="text-pink" />}
            label={t('deleteContactButtonLabel')}
            variant="card"
            colorSchema="error"
            onClick={handleOpenDeleteContactModal}
          />
          <Button
            leftIcon={<TbPencil aria-hidden className="text-neon" />}
            iconsOnEdge={false}
            label={t('editContactButtonLabel')}
            variant="outlined"
            colorSchema="neon"
            onClick={modalNavigateWrapper('save-contact', { state: { contact } })}
            className="w-56.5"
          />
        </div>

        <Separator />

        <div className="flex min-h-0 w-full flex-grow flex-col space-y-4">
          <p className="text-xs font-bold text-gray-100 uppercase">{t('walletAddresses')}</p>
          <ul className="max-h-60 space-y-2.5 overflow-y-auto">
            {contact.addresses.map((addressItem, index) => {
              const { blockchain, address } = addressItem

              return (
                <li key={index} className="bg-asphalt flex items-start gap-3 rounded px-4 py-3">
                  <div className="flex-shrink-0">
                    <BlockchainIcon blockchain={blockchain} className="min-size-4 max-size-4 mt-1 size-4" />
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-grow">
                        <p className="mb-1 text-sm text-gray-100 capitalize">{blockchain}</p>

                        <p className="truncate text-sm">{StringHelper.truncateMiddle(address, 34)}</p>
                      </div>

                      <Button
                        variant="text-slim"
                        onClick={ClipboardHelper.write.bind(null, address)}
                        className="flex-shrink-0"
                        title={t('copyAddressButtonLabel')}
                      >
                        <MdContentCopy aria-hidden className="min-size-5 max-size-5 size-5" />
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
