import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Button } from '@renderer/components/Button'
import { Radio } from '@renderer/components/Radio'
import { Select } from '@renderer/components/Select'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalState } from '@renderer/hooks/useModalRouter'
import { useWalletsByBlockchainsSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdCircle from '@renderer/assets/images/md-circle.svg?react'

import type { TModalState } from '@shared/types/modal'
import type { IAccountState, IWalletState } from '@shared/types/store'

export const AccountSelectionByBlockchainModal = () => {
  const { description, submitButtonLabel, blockchain, selectedWallet, selectedAccount, onSelect } =
    useModalState<TModalState<'account-selection-by-blockchain'>>()

  const { t } = useTranslation('modals', { keyPrefix: 'accountSelectionByBlockchain' })

  const { walletsByBlockchains } = useWalletsByBlockchainsSelector(['neo3'])

  const [selectedAccountInternal, setSelectedAccountInternal] = useState<IAccountState | undefined>(selectedAccount)
  const [selectedWalletInternal, setSelectedWalletInternal] = useState<IWalletState>(selectedWallet)

  const accountsByBlockchainWallet = useMemo(
    () => selectedWalletInternal.accounts.filter(account => account.blockchain === blockchain),
    [blockchain, selectedWalletInternal]
  )

  const handleSelect = () => {
    if (!selectedAccountInternal) return
    onSelect(selectedAccountInternal, selectedWalletInternal)
  }

  const onSelectWallet = (walletId: string) => {
    const wallet = walletsByBlockchains.find(({ id }) => id === walletId)
    if (wallet) {
      setSelectedWalletInternal(wallet)
    }
  }

  const onSelectAccount = (accountId: string) => {
    const account = accountsByBlockchainWallet.find(({ id }) => id === accountId)
    if (account) {
      setSelectedAccountInternal(account)
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <p className="mb-6 text-center text-lg">{description ?? t('description')}</p>
      <div className="flex items-center">
        <Select.Root value={selectedWalletInternal.id} onValueChange={onSelectWallet}>
          <Select.Trigger className="bg-asphalt w-full rounded py-2">
            <Select.Value className="text-sm text-white" placeholder={t('selectWalletPlaceholder')}>
              {selectedWalletInternal.name}
            </Select.Value>

            <Select.Icon className="text-neon" />
          </Select.Trigger>

          <Select.Content>
            {walletsByBlockchains.map(wallet => (
              <Select.Item
                key={wallet.id}
                value={wallet.id}
                className="cursor-pointer px-2.5 py-3.5 text-sm text-white hover:bg-gray-300/15"
              >
                <Select.ItemText>{wallet.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <Accordion.Root className="mt-7 flex w-full items-center" type="multiple">
        <Accordion.Item value="accounts" className="w-full">
          <Accordion.Trigger className="bg-asphalt rounded border-none">
            <div className="flex items-center gap-x-2.5">
              <MdCircle
                className={StyleHelper.mergeStyles(
                  'text-lemon size-3',
                  selectedAccountInternal && selectedAccountInternal.skin.type === 'color'
                    ? `text-${selectedAccountInternal.skin.id}`
                    : ''
                )}
              />
              {t('accountsSelectionLabel')}
            </div>
          </Accordion.Trigger>
          <Accordion.Content className="mt-2.5 px-0">
            <Radio.Group
              value={selectedAccountInternal?.id}
              className="h-full min-h-0 overflow-y-auto rounded"
              onValueChange={onSelectAccount}
            >
              {accountsByBlockchainWallet.map(account => (
                <Radio.Item key={account.id} value={account.id} className="my-2 h-15 w-full">
                  <div>
                    <div className="flex min-w-0 items-center gap-5">
                      <BlockchainIcon
                        blockchain={account.blockchain}
                        className="mt-2 h-4 min-h-4 w-4 min-w-4 text-gray-100"
                      />
                      <p className="truncate text-sm text-white">{account.name}</p>
                    </div>

                    <p className="mt-0.5 ml-9 truncate text-xs text-gray-400">
                      {StringHelper.truncateMiddle(account.address, 10)}
                    </p>
                  </div>

                  <Radio.Indicator />
                </Radio.Item>
              ))}
            </Radio.Group>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <Button
        className="mt-auto w-full"
        variant="card"
        label={submitButtonLabel ?? t('submitButtonLabel')}
        iconsOnEdge={false}
        onClick={handleSelect}
      />
    </BottomModalLayout>
  )
}

export default AccountSelectionByBlockchainModal
