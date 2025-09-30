import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

type TProps = { className?: string }

export const ActionStepSeparator = ({ className }: TProps) => (
  <div className="relative z-10">
    <TbArrowLeft
      aria-hidden={true}
      className={StyleHelper.mergeStyles(
        'absolute top-1 left-1/2 box-content h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-[270deg] rounded-full border-8 border-gray-900 bg-gray-800 p-1',
        className
      )}
    />
  </div>
)
