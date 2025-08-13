import { TContactEncryptedAddress, TContactState } from '@/types/store'

import { EncryptionHelper } from './EncryptionHelper'

export class ContactsHelper {
  static async encryptContact(
    contact: TContactState,
    encryptedPassword: string
  ): Promise<TContactState<TContactEncryptedAddress>> {
    const resolvedAddresses = await Promise.all(
      contact.addresses.map(async ({ address, ...contactAddress }) => {
        let encryptedAddress = ''

        try {
          encryptedAddress = await EncryptionHelper.encrypt(address, encryptedPassword)
        } catch (error) {
          console.error(error)
        }

        return { ...contactAddress, encryptedAddress }
      })
    )
    const addresses = resolvedAddresses.filter(({ encryptedAddress }) => !!encryptedAddress)

    return {
      ...contact,
      addresses,
    }
  }

  static async encryptContacts(
    contacts: TContactState[],
    encryptedPassword: string
  ): Promise<TContactState<TContactEncryptedAddress>[]> {
    const resolvedContacts = await Promise.all(
      contacts.map(contact => {
        try {
          return ContactsHelper.encryptContact(contact, encryptedPassword)
        } catch (error) {
          console.error(error)

          return null
        }
      })
    )

    return resolvedContacts.filter<TContactState<TContactEncryptedAddress>>(contact => !!contact)
  }

  static async decryptContacts(
    contacts: TContactState<TContactEncryptedAddress>[],
    encryptedPassword: string
  ): Promise<TContactState[]> {
    return await Promise.all(
      contacts.map(async ({ addresses, ...contact }) => {
        const resolvedAddresses = await Promise.all(
          addresses.map(async ({ encryptedAddress, ...contactAddress }) => {
            let address = ''

            try {
              address = await EncryptionHelper.decrypt(encryptedAddress, encryptedPassword)
            } catch (error) {
              console.error(error)
            }

            return { ...contactAddress, address }
          })
        )
        const addressesList = resolvedAddresses.filter(({ address }) => !!address)

        return { ...contact, addresses: addressesList }
      })
    )
  }
}
