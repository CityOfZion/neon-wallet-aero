import { useEffect, useMemo, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'

import { ContactsList } from '@renderer/components/ContactsList'
import { IconButton } from '@renderer/components/IconButton'
import { Input } from '@renderer/components/Input'
import { Tooltip } from '@renderer/components/Tooltip'

import { useContactsSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'

import type { TContact } from '@shared/types/store'

export const ContactsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { contacts } = useContactsSelector()
  const [search, setSearch] = useState<string | null>(null)
  const hasAlreadySelectedContact = useRef(false)
  const { modalNavigateWrapper } = useModalNavigate()

  const groupedContactsByFirstLetter = useMemo(() => {
    let filteredContacts = cloneDeep(contacts)

    const newSearch = search?.toLowerCase()?.trim()

    if (newSearch)
      filteredContacts = contacts.filter(contact =>
        contact.name
          .toLowerCase()
          .trim()
          .includes(newSearch as string)
      )

    const sortedContacts = filteredContacts.sort((a, b) => a.name[0].localeCompare(b.name[0]))

    const groupedContactsByFirstLetterMap = new Map<string, TContact[]>()

    sortedContacts.forEach(contact => {
      if (!contact.name) return

      const key = contact.name[0].toUpperCase()

      const lastContacts = groupedContactsByFirstLetterMap.get(key) || []

      groupedContactsByFirstLetterMap.set(key, [...lastContacts, contact])
    })

    return Array.from(groupedContactsByFirstLetterMap.entries())
  }, [contacts, search])

  useEffect(() => {
    if (hasAlreadySelectedContact.current) return

    hasAlreadySelectedContact.current = true
  }, [hasAlreadySelectedContact, groupedContactsByFirstLetter])

  return (
    <ScreenLayout
      heading={t('title')}
      className="text-white"
      rightComponent={
        <IconButton
          aria-label={tCommon('menuIconButtonAriaLabel')}
          className="mb-0.5"
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
      leftComponent={
        <Tooltip title={t('addContactButtonLabel')} delayDuration={200}>
          <IconButton
            icon={<TbPlus aria-hidden className="text-neon" />}
            aria-label={t('addContactButtonLabel')}
            onClick={modalNavigateWrapper('save-contact')}
          />
        </Tooltip>
      }
    >
      <div className="flex flex-grow flex-col gap-y-6">
        <Input
          name="search-contact"
          id="search-contact"
          aria-label={t('searchContactsLabel')}
          clearable
          placeholder={t('searchContactsPlaceholder')}
          onChange={event => setSearch(event.target.value)}
        />

        <ContactsList groupedContacts={groupedContactsByFirstLetter} />
      </div>
    </ScreenLayout>
  )
}

export default ContactsPage
