import type { TButtonProps } from '@renderer/components/Button'
import { Button } from '@renderer/components/Button'

import MdChevronDown from '@renderer/assets/images/md-keyboard-arrow-down.svg?react'

type TProps = {
  label: string
  selectedLabel: string
} & TButtonProps

export const WalletsPageSelectButton = ({ label, selectedLabel, ...props }: TProps) => {
  return (
    <Button
      {...props}
      flat
      variant="text"
      clickableProps={{ className: 'flex-col items-start w-fit gap-1 pb-1 pt-0 h-fit' }}
    >
      <div className="flex items-center gap-1">
        <span className="text-sm">{label}</span>
        <MdChevronDown aria-hidden />
      </div>

      <span className="w-32 max-w-32 min-w-32 truncate text-left text-sm text-white">{selectedLabel}</span>
    </Button>
  )
}
