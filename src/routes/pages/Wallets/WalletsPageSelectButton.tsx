import { Button } from '@/components/Button'

import MdChevronDown from '@/assets/images/md-keyboard-arrow-down.svg?react'

type TProps = {
  label: string
  selectedLabel: string
}

export const WalletsPageSelectButton = ({ label, selectedLabel }: TProps) => {
  return (
    <Button flat variant="text" clickableProps={{ className: 'flex-col items-start w-fit gap-1 py-1 h-fit' }}>
      <div className="flex items-center gap-1">
        <span className="text-sm">{label}</span>
        <MdChevronDown aria-hidden />
      </div>

      <span className="text-sm text-white">{selectedLabel}</span>
    </Button>
  )
}
