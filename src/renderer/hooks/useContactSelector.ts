import { useEffect, useRef, useState } from 'react'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { ContactsHelper } from '@renderer/helpers/ContactsHelper'

import type { TContactAddress, TContactState } from '@shared/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useAppSelector } from './useRedux'

export const useContactsSelector = () => {
  const { value: encryptedContacts } = useAppSelector(state => state.contact.data)
  const { loginSession } = useLoginSessionSelector()

  const [contacts, setContacts] = useState<TContactState[]>([])
  const contactsRef = useRef<TContactState[]>(contacts)

  useEffect(() => {
    async function handle() {
      if (!encryptedContacts || !loginSession?.encryptedPassword) return
      const decryptedContacts = await ContactsHelper.decryptContacts(encryptedContacts, loginSession.encryptedPassword)
      contactsRef.current = decryptedContacts
      setContacts(decryptedContacts)
    }

    handle()
  }, [encryptedContacts, loginSession?.encryptedPassword])

  return {
    contacts,
    contactsRef,
  }
}

export const useContactByAddressSelector = (contactAddress?: TContactAddress) => {
  const { contacts } = useContactsSelector()

  const contact = contactAddress
    ? contacts.find(contact => contact.addresses.some(AccountHelper.predicate(contactAddress)))
    : undefined

  return { contact }
}
