import { StyleHelper } from '@/helpers/StyleHelper'

import TbLoader2 from '@/assets/images/tb-loader-2.svg?react'

type TProps = {
  containerClassName?: string
  className?: string
}

export const Loader = ({ containerClassName, className }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex w-full justify-center', containerClassName)}>
      <TbLoader2 aria-hidden={true} className={StyleHelper.mergeStyles('h-6 w-6 animate-spin', className)} />
    </div>
  )
}
