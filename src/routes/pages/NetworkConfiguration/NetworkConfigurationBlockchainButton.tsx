import { Button } from '@/components/Button'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdChevronRight from '@/assets/images/md-chevron-right.svg?react'

type TProps = {
  label: string
  subLabel: string
  onClick?(): void
  className?: string
  disabled?: boolean
}

export const NetworkConfigurationBlockchainButton = ({ label, subLabel, onClick, className, disabled }: TProps) => {
  return (
    <Button
      variant="text-slim"
      aria-disabled={disabled}
      disabled={disabled}
      className={StyleHelper.mergeStyles('w-full border-b border-gray-300/30 px-1 py-2.5', className)}
      clickableProps={{ className: 'justify-between' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 items-center justify-center">
          <span className="h-1 w-1 rounded-full bg-gray-300" />
        </div>

        <span className="text-gray-100">{label}</span>
      </div>

      <div className="flex items-center gap-4">
        <p className="max-w-56 min-w-0 flex-1 truncate text-gray-300">{subLabel}</p>
        <MdChevronRight aria-hidden className="text-neon h-6 w-6" />
      </div>
    </Button>
  )
}
