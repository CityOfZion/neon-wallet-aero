import type { TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'
import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { Checkbox } from '@renderer/components/Checkbox'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useAccountUtils } from '@renderer/hooks/useAccountUtils'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'

import type { TImportAccountsSelectionFormProps } from './ImportAccountsSelectionForm'

type TProps = {
  blockchainName: TBlockchainServiceKey
  accounts: TBSAccount<TBlockchainServiceKey>[]
} & Pick<TImportAccountsSelectionFormProps, 'selectedAccounts' | 'onSelect'>

export const ImportAccountsSelectionAccordionItem = ({
  blockchainName,
  accounts,
  selectedAccounts,
  onSelect,
}: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importAccountsSelection.accordionItem' })
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { doesAccountExist } = useAccountUtils()

  const handleCheckedChange = (isChecked: boolean, account: TBSAccount<TBlockchainServiceKey>) => {
    onSelect(isChecked ? [...selectedAccounts, account] : selectedAccounts.filter(AccountHelper.predicateNot(account)))
  }

  return (
    <Accordion.Item value={blockchainName} className="bg-asphalt rounded">
      <Accordion.Trigger className="flex grow items-center gap-x-2 border-none px-4">
        <h3 className="flex grow items-center gap-x-2 text-sm text-white">
          <BlockchainIcon blockchain={blockchainName} />

          {tCommonBlockchain(blockchainName)}
        </h3>

        <p className="text-1xs text-right text-gray-300 uppercase">
          {t('accountsSizeLabel', { size: accounts.length })}
        </p>
      </Accordion.Trigger>

      <Accordion.Content asChild>
        <Separator containerClassName="px-4" />

        <ul className="flex flex-col gap-y-3 px-4 py-3">
          {accounts.map(account => {
            const isDisabled = doesAccountExist(account)

            const onCheckedChange = (isChecked: boolean) => {
              if (isDisabled) return

              handleCheckedChange(isChecked, account)
            }

            return (
              <li
                key={AccountHelper.buildAccountKey(account)}
                className="flex w-full items-center justify-between gap-x-2 text-sm text-white"
              >
                <div className="flex w-full max-w-[86%] flex-col gap-y-0.5">
                  <p className={StyleHelper.mergeStyles('block min-w-0 truncate', { 'text-gray-300': isDisabled })}>
                    {account.address}
                  </p>

                  {account.bipPath && <p className="block min-w-0 truncate text-xs text-gray-300">{account.bipPath}</p>}
                </div>

                <Tooltip title={isDisabled ? t('accountAlreadyExistsLabel') : ''} delayDuration={0}>
                  <Checkbox
                    aria-label={account.address}
                    checked={selectedAccounts.some(AccountHelper.predicate(account))}
                    disabled={isDisabled}
                    onCheckedChange={onCheckedChange}
                  />
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  )
}
