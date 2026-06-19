import { Fragment, useMemo, useState } from 'react'

import { cloneDeep } from 'lodash'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Banner } from '@renderer/components/Banner'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'
import { Tabs } from '@renderer/components/Tabs'
import { Tooltip } from '@renderer/components/Tooltip'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountsWithWalletSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useContactsSelector } from '@renderer/hooks/useContactSelector'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useNameService } from '@renderer/hooks/useNameService'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'
import type { TAccount, TContact } from '@shared/types/store'

type TTab = 'enter-address' | 'my-accounts' | 'my-contacts'

type TActionsData = {
  address?: string
  account?: TAccount
  contactAddress?: string
}

export const AccountReceiveSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountReceiveSelection' })
  const { handleChangeAddress, handleChangeAccount, accountTypes, blockchain, selectedAccount, selectedAddress } =
    useModalState<TModalState<'account-receive-selection'>>()

  const { modalErase } = useModalNavigate()
  const { accountsWithWallet } = useAccountsWithWalletSelector()
  const { walletsRef } = useWalletsSelector()
  const { contacts } = useContactsSelector()

  const {
    isNameService,
    isValidAddressOrDomainAddress,
    isValidatingAddressOrDomainAddress,
    validateAddressOrNS,
    validatedAddress,
  } = useNameService()

  const { actionData, setData, reset } = useActions<TActionsData>({
    address: selectedAddress || '',
    account: selectedAccount || undefined,
    contactAddress: undefined,
  })

  const [search, setSearch] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<TTab>(selectedAccount ? 'my-accounts' : 'enter-address')

  const isDisabled = match(selectedTab)
    .with(
      'enter-address',
      () => !actionData.address || isValidatingAddressOrDomainAddress || (blockchain && !isValidAddressOrDomainAddress)
    )
    .with('my-accounts', () => !actionData.account)
    .with('my-contacts', () => !actionData.contactAddress)
    .otherwise(() => true)

  const handleTabChange = (tab: TTab) => {
    reset()
    setSelectedTab(tab)
  }

  const handleInputAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fixedValue = StringHelper.removeSpecialCharacters(event.target.value, { allowSpaces: false, allowDots: true })

    setData({ address: fixedValue })
    validateAddressOrNS(fixedValue, blockchain)
  }

  const handleSelectMyAccount = (accountSelected: TAccount) => {
    setData({ account: accountSelected })
  }

  const handleSelectContactAccount = (address: string) => {
    setData({ contactAddress: address })
  }

  const handleSubmit = () => {
    if (isDisabled) return

    if (selectedTab === 'enter-address') {
      handleChangeAddress(actionData.address!)
    } else if (selectedTab === 'my-accounts') {
      handleChangeAccount(actionData.account!)
    } else if (selectedTab === 'my-contacts') {
      handleChangeAddress(actionData.contactAddress!)
    }

    modalErase('bottom')
  }

  const filteredAccounts = useMemo(() => {
    let filtered = accountsWithWallet

    if (accountTypes) {
      filtered = filtered.filter(account => accountTypes.includes(account.type))
    }

    if (blockchain) {
      filtered = filtered.filter(account => account.blockchain === blockchain)
    }

    return filtered
  }, [accountsWithWallet, blockchain, accountTypes])

  const groupedContactsByFirstLetter = useMemo(() => {
    let filteredContacts = cloneDeep(contacts).filter(contact =>
      contact.addresses.some(addr => addr.blockchain === blockchain)
    )

    const newSearch = search?.toLowerCase()?.trim()

    if (newSearch)
      filteredContacts = filteredContacts.filter(contact =>
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
  }, [blockchain, contacts, search])

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-clip pb-4">
      <div className="relative flex h-full flex-col items-center justify-between">
        <div className="flex size-full flex-col gap-4 text-sm text-white">
          <Tabs.Root
            className="flex h-full flex-col"
            value={selectedTab}
            defaultValue="enter-address"
            onValueChange={tab => handleTabChange(tab as TTab)}
          >
            <Tabs.List>
              <Tabs.Trigger className="bg-gray-300/15" value="enter-address">
                {t('enterAddressLabel')}
              </Tabs.Trigger>
              <Tabs.Trigger className="bg-gray-300/15" value="my-accounts" disabled={!blockchain}>
                {t('myAccountsLabel')}
              </Tabs.Trigger>
              <Tabs.Trigger className="bg-gray-300/15" value="my-contacts" disabled={!blockchain}>
                {t('myContactsLabel')}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="enter-address" className="min-h-0 overflow-y-auto">
              <Input
                value={actionData.address}
                onChange={handleInputAddressChange}
                name="address"
                id="address"
                className="placeholder:text-neon w-full"
                placeholder={t('enterRecipientAddressPlaceholder')}
                clearable
                pastable
                containerClassName="p-1"
                loading={isValidatingAddressOrDomainAddress}
                error={isValidAddressOrDomainAddress === false}
              />
              {isNameService && <p className="pt-3 text-gray-300">{validatedAddress}</p>}

              {isValidAddressOrDomainAddress !== undefined && (
                <div className="pt-3">
                  {!isValidAddressOrDomainAddress ? (
                    <Banner message={t('messages.invalidAddress')} type="error" />
                  ) : (
                    <Banner
                      message={isNameService ? t('messages.nsComplete') : t('messages.addressComplete')}
                      type="success"
                    />
                  )}
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="my-accounts" className="max-h-92 min-h-0 overflow-y-auto">
              {match(filteredAccounts.length)
                .with(0, () => <p className="py-2.5 text-center text-xs text-gray-100">{t('noAccountsFound')}</p>)
                .otherwise(() =>
                  filteredAccounts.map((account, index) => {
                    const wallet = walletsRef.current?.find(wallet => wallet.id === account.idWallet)
                    const isSelected = actionData.account?.id === account.id

                    return (
                      <Button
                        key={`account-button-${account.id}`}
                        onClick={() => handleSelectMyAccount(account)}
                        variant="text"
                        disabled={isSelected}
                        className="w-full disabled:bg-gray-900/50"
                        clickableProps={{ className: 'px-0 pr-3 relative' }}
                      >
                        <div
                          className={StyleHelper.mergeStyles('flex size-full flex-col justify-end pl-3', {
                            'after:bg-neon after:absolute after:top-0 after:left-0 after:h-full after:w-1.5':
                              isSelected,
                          })}
                        >
                          <div className="flex h-full items-center justify-between gap-2.5 text-sm">
                            <div className="flex w-full items-center">
                              <BlockchainIcon className="min-size-6 mr-3.5 size-6" blockchain={account.blockchain} />

                              <p className="text-white">{StringHelper.truncateMiddle(account.address, 8)}</p>
                            </div>

                            <span className="w-full truncate text-left text-gray-100 uppercase">
                              {`${account.name} | ${wallet?.name}`}
                            </span>
                          </div>

                          {index + 1 !== filteredAccounts.length && <Separator />}
                        </div>
                      </Button>
                    )
                  })
                )}
            </Tabs.Content>
            <Tabs.Content value="my-contacts" className="max-h-92 min-h-0 overflow-y-auto">
              <Input
                name="search-contact"
                id="search-contact"
                aria-label={t('searchContactsLabel')}
                clearable
                placeholder={t('searchContactsPlaceholder')}
                onChange={event => setSearch(event.target.value)}
              />

              {groupedContactsByFirstLetter.length > 0 ? (
                <ul className="flex min-h-0 w-full grow basis-0 flex-col gap-y-5 overflow-y-auto pt-3 text-sm">
                  {groupedContactsByFirstLetter.map(([letter, letterContacts]) => (
                    <li key={`letter-${letter}`}>
                      <div className="text-blue my-3.5 flex h-6 items-center pl-4 font-bold">{letter}</div>

                      <Separator />

                      {letterContacts.map((contact, index) => {
                        const addressesForBlockchain = contact.addresses.filter(addr => addr.blockchain === blockchain)

                        return (
                          <Fragment key={`contact-list-item-${contact.id}-${index}`}>
                            {addressesForBlockchain.map((address, addressIndex) => {
                              const isSelected = actionData.contactAddress === address.address

                              return (
                                <Fragment key={`address-${address.address}-${addressIndex}`}>
                                  <Button
                                    variant="text"
                                    colorSchema="white"
                                    disabled={isSelected}
                                    onClick={() => handleSelectContactAccount(address.address)}
                                    className={StyleHelper.mergeStyles(
                                      'hover:border-neon flex h-12 w-full items-center justify-between border-l-4 border-transparent py-4 pl-0',
                                      {
                                        'border-neon bg-gray-900/50': isSelected,
                                      }
                                    )}
                                  >
                                    <div className="flex w-full items-center">
                                      <BlockchainIcon className="min-size-6 size-6" blockchain={address.blockchain} />

                                      <Tooltip title={contact.name}>
                                        <p className="ml-3.5 max-w-40 truncate text-sm">{contact.name}</p>
                                      </Tooltip>
                                    </div>

                                    <p className="w-full text-right text-sm text-gray-100">
                                      {StringHelper.truncateMiddle(address.address, 8)}
                                    </p>
                                  </Button>

                                  {index !== addressesForBlockchain.length - 1 && (
                                    <Separator containerClassName="pl-11" />
                                  )}
                                </Fragment>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex grow items-center justify-center pt-3">
                  <p className="text-gray-400">{t('noContactsFound')}</p>
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <Button
          className="absolute right-2 bottom-0 left-2"
          variant="card"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {t('useThisAddressButtonLabel')}
        </Button>
      </div>
    </BottomModalLayout>
  )
}

export default AccountReceiveSelectionModal
