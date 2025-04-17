import { useMemo } from 'react'
import orderBy from 'lodash/orderBy'

import { Accordion } from '@/components/Accordion'
import { blockchainNames } from '@/libs/blockchainService'
import { TBlockchainServiceKey } from '@/types/blockchain'

import { ImportAccountsSelectionAccordionItem } from './ImportAccountsSelectionAccordionItem'
import { TImportAccountsSelectionFormProps } from './ImportAccountsSelectionForm'

type TProps = Pick<TImportAccountsSelectionFormProps, 'blockchainAccounts' | 'selectedAccounts' | 'onSelect'>

export const ImportAccountsSelectionAccordion = ({ blockchainAccounts, selectedAccounts, onSelect }: TProps) => {
  const blockchainKeys = useMemo(
    () =>
      orderBy(
        Object.entries(blockchainAccounts)
          .filter(([_key, accounts]) => accounts.length > 0)
          .map(([key]) => key) as TBlockchainServiceKey[],
        [blockchain => blockchainNames.indexOf(blockchain), 'order']
      ),
    [blockchainAccounts]
  )

  return (
    <Accordion.Root className="flex flex-col gap-y-3" type="multiple" defaultValue={blockchainKeys}>
      {blockchainKeys.map(blockchain => (
        <ImportAccountsSelectionAccordionItem
          key={blockchain}
          blockchainName={blockchain}
          accounts={blockchainAccounts[blockchain]!}
          selectedAccounts={selectedAccounts}
          onSelect={onSelect}
        />
      ))}
    </Accordion.Root>
  )
}
