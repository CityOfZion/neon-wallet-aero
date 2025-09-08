import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cloneDeep } from 'lodash'

import { ContactsList } from '@/components/ContactsList'
import { Input } from '@/components/Input'
import { useContactsSelector } from '@/hooks/useContactSelector'
import { ScreenLayout } from '@/layouts/ScreenLayout'
import { TContactState } from '@/types/store'

export const ContactsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'contacts' })
  const { contacts } = useContactsSelector()
  const [search, setSearch] = useState<string | null>(null)
  const hasAlreadySelectedContact = useRef(false)

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

    const groupedContactsByFirstLetterMap = new Map<string, TContactState[]>()

    sortedContacts.forEach(contact => {
      if (!contact.name) return

      const key = contact.name[0].toUpperCase()

      const lastContacts = groupedContactsByFirstLetterMap.get(key) ?? []

      groupedContactsByFirstLetterMap.set(key, [...lastContacts, contact])
    })

    return Array.from(groupedContactsByFirstLetterMap.entries())
  }, [contacts, search])

  useEffect(() => {
    if (hasAlreadySelectedContact.current) return

    hasAlreadySelectedContact.current = true
  }, [hasAlreadySelectedContact, groupedContactsByFirstLetter])

  return (
    <ScreenLayout heading={t('title')} className="text-white">
      <div className="flex flex-grow flex-col gap-y-4">
        <Input
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
