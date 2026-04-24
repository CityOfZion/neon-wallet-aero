import { StringHelper } from '@renderer/helpers/StringHelper'

import { TransactionActivityListTooltip } from './TransactionActivityListTooltip'

type TProps = {
  address: string
  addressName?: string
}

export const TransactionActivityListEventColumnDataAddress = ({ address, addressName }: TProps) => {
  let tooltipLabel = address

  if (addressName) tooltipLabel += ` (${addressName})`

  const textLabel = addressName ? StringHelper.truncate(addressName, 10) : StringHelper.truncateMiddle(address, 8)

  return (
    <TransactionActivityListTooltip data={tooltipLabel}>
      <span className="inline-block">{textLabel}</span>
    </TransactionActivityListTooltip>
  )
}
