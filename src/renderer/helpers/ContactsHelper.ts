import type { TContact, TContactAddress, TContactEncryptedAddress } from '@shared/types/store'

import { EncryptionHelper } from './EncryptionHelper'

export class ContactsHelper {
  static async encryptContact(
    contact: TContact,
    encryptedPassword: string
  ): Promise<TContact<TContactEncryptedAddress>> {
    const addresses: TContactEncryptedAddress[] = []

    const promises = contact.addresses.map(async contactAddress => {
      const encryptedAddress = await EncryptionHelper.encrypt(contactAddress.address, encryptedPassword)
      addresses.push({ ...contactAddress, encryptedAddress })
    })

    await Promise.allSettled(promises)

    return {
      ...contact,
      addresses,
    }
  }

  static async encryptContacts(
    contacts: TContact[],
    encryptedPassword: string
  ): Promise<TContact<TContactEncryptedAddress>[]> {
    const encryptedContacts: TContact<TContactEncryptedAddress>[] = []

    const promises = contacts.map(async contact => {
      const encryptedContact = await ContactsHelper.encryptContact(contact, encryptedPassword)
      encryptedContacts.push(encryptedContact)
    })

    await Promise.allSettled(promises)

    return encryptedContacts
  }

  static async decryptContact(
    contacts: TContact<TContactEncryptedAddress>,
    encryptedPassword: string
  ): Promise<TContact> {
    const addresses: TContactAddress[] = []

    const promises = contacts.addresses.map(async contactAddress => {
      const address = await EncryptionHelper.decrypt(contactAddress.encryptedAddress, encryptedPassword)
      addresses.push({ ...contactAddress, address })
    })

    await Promise.allSettled(promises)

    return {
      ...contacts,
      addresses,
    }
  }

  static async decryptContacts(
    contacts: TContact<TContactEncryptedAddress>[],
    encryptedPassword: string
  ): Promise<TContact[]> {
    const decryptedContacts: TContact[] = []

    const promises = contacts.map(async contact => {
      const decryptedContact = await ContactsHelper.decryptContact(contact, encryptedPassword)
      decryptedContacts.push(decryptedContact)
    })

    await Promise.allSettled(promises)

    return decryptedContacts
  }
}
