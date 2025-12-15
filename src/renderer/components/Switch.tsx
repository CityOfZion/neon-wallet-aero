import * as RadioSwitch from '@radix-ui/react-switch'
import type { ComponentProps } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = ComponentProps<typeof RadioSwitch.Root> & {
  labelClassName?: string
  label: string
  id: string
}

export const Switch = ({ label, disabled, id, className, labelClassName, ...props }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex items-center gap-x-1.5', className)}>
      <RadioSwitch.Root
        id={id}
        aria-label={label}
        className="bg-asphalt data-[state=checked]:bg-neon relative box-content h-5 w-9 cursor-pointer rounded-full px-0.5 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        {...props}
      >
        <RadioSwitch.Thumb className="bg-neon data-[state=checked]:bg-asphalt block size-4 translate-x-0 transform rounded-full shadow-lg transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5" />
      </RadioSwitch.Root>

      <label
        htmlFor={id}
        className={StyleHelper.mergeStyles(
          'cursor-pointer text-xs font-normal text-gray-100 select-none',
          { 'cursor-not-allowed opacity-50': disabled },
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  )
}
