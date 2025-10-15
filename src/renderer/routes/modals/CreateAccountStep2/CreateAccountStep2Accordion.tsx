import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'
import { Separator } from '@renderer/components/Separator'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import type { IWalletState } from '@shared/types/store'

type TProps = {
  selectedWallet?: IWalletState
  onSelect(wallet: IWalletState): void
}

export const CreateAccountStep2Accordion = ({ selectedWallet, onSelect }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'createAccountStep2Modal.accordionItem' })
  const { wallets } = useWalletsSelector()

  const filteredWallets = useMemo<IWalletState[]>(() => {
    return wallets.filter(wallet => !wallet.accounts.some(account => account.type === 'watch'))
  }, [wallets])

  const walletsId = useMemo(() => filteredWallets.map(wallet => wallet.id), [filteredWallets])
  return (
    <Accordion.Root className="flex flex-col gap-y-3" type="multiple" defaultValue={walletsId}>
      <Accordion.Item value={selectedWallet?.id ?? 'not-selected'} className="bg-asphalt rounded">
        <Accordion.Trigger className="flex flex-grow items-center gap-x-2 border-none px-4">
          <h3 className="flex flex-grow items-center gap-x-2 text-sm text-white">
            {selectedWallet?.name ?? t('defaultWalletLabel')}
          </h3>
        </Accordion.Trigger>

        <Accordion.Content asChild>
          <Separator containerClassName="px-4" />

          <ul className="flex flex-col">
            {wallets.length > 0 ? (
              wallets
                .filter(wallet => !wallet.accounts.some(account => account.type === 'watch'))
                .map(item => {
                  const isDisabled = selectedWallet?.id === item.id

                  return (
                    <li key={item.id} className="flex w-full items-center text-sm text-white">
                      <button
                        className={StyleHelper.mergeStyles('flex w-full flex-col gap-y-0.5 px-4 py-3 text-left', {
                          'cursor-pointer': !isDisabled,
                        })}
                        onClick={() => !isDisabled && onSelect(item)}
                        disabled={isDisabled}
                      >
                        <p
                          className={StyleHelper.mergeStyles('block min-w-0 truncate', { 'text-gray-300': isDisabled })}
                        >
                          {item.name}
                        </p>
                      </button>
                    </li>
                  )
                })
            ) : (
              <li className="text-sm text-gray-300">{t('noWalletSelectable')}</li>
            )}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
