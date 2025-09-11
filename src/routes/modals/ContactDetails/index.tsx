import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Button } from '@/components/Button'
import { Separator } from '@/components/Separator'
import { StringHelper } from '@/helpers/StringHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useContactsSelector } from '@/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@/hooks/useModalRouter'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'
import { TModalState } from '@/types/modal'

import TbCopy from '@/assets/images/tb-copy.svg?react'
import TbPencil from '@/assets/images/tb-pencil.svg?react'

export const ContactDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'contactDetailsModal' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { contactId } = useModalState<TModalState<'contact-details'>>()
  const { modalNavigateWrapper } = useModalNavigate()

  const { contacts } = useContactsSelector()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleCopyAddress = (address: string) => {
    UtilsHelper.copyToClipboard(address)
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
        <div
          className={StyleHelper.mergeStyles(
            'flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-300/30 text-xs text-gray-100'
          )}
        >
          <p className="text-2xl">{StringHelper.getInitials(contact.name)}</p>
        </div>
        <p className="text-center text-lg">{contact.name}</p>

        <Button
          leftIcon={<TbPencil aria-hidden className="text-neon" />}
          label={commonT('edit')}
          variant="outlined"
          colorSchema="neon"
          onClick={modalNavigateWrapper('save-contact', { state: { contact } })}
          flat
        />

        <Separator />

        <div className="flex min-h-0 w-full flex-grow flex-col space-y-4">
          <p className="text-center text-sm tracking-wide text-gray-400 uppercase">{t('walletAddresses')}</p>

          <ul className="space-y-3 overflow-y-auto">
            {contact.addresses.map((addressItem, index) => {
              const { blockchain, address } = addressItem

              return (
                <li key={index} className="flex items-center gap-3 rounded bg-gray-800/50 p-3">
                  <div className="flex-shrink-0">
                    <BlockchainIcon blockchain={blockchain} className="h-6 w-6" />
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
                        <TbCopy aria-hidden className="h-5 w-5" />
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
