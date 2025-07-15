import { useEffect, useRef, useState } from 'react'

import { ContactsHelper } from '@/helpers/ContactsHelper'
import { TBlockchainServiceKey } from '@/types/blockchain'
import { TContactState } from '@/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { createAppSelector, useAppSelector } from './useRedux'

export const useContactsSelector = () => {
  const { value } = useAppSelector(state => state.contact.data)
  const { loginSession } = useLoginSessionSelector()
  const [contacts, setContacts] = useState<TContactState[]>([])
  const contactsRef = useRef<TContactState[]>(contacts)

  const handleContacts = async () => {
    if (!value || !loginSession?.encryptedPassword) return

    const newContacts = await ContactsHelper.decryptContacts(value, loginSession.encryptedPassword)

    contactsRef.current = newContacts

    setContacts(newContacts)
  }

  useEffect(() => {
    handleContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, loginSession?.encryptedPassword])

  return {
    contacts,
    contactsRef,
  }
}

const hasContactsByBlockchainSelector = (blockchain?: TBlockchainServiceKey) =>
  createAppSelector([state => state.contact.data], data => {
    if (!blockchain) return false

    return new Set(data.flatMap(contact => contact.addresses.map(address => address.blockchain))).has(blockchain)
  })

export const useHasContactsByBlockchain = (blockchain?: TBlockchainServiceKey) => {
  const { value: hasContactsByBlockchain } = useAppSelector(hasContactsByBlockchainSelector(blockchain))

  return { hasContactsByBlockchain }
}
