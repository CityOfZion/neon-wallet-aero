import { forwardRef } from 'react'

import * as RadixCheckbox from '@radix-ui/react-checkbox'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import FiCheck from '@renderer/assets/images/fi-check.svg?react'

type TProps = Omit<RadixCheckbox.CheckboxProps, 'onCheckedChange'> & {
  onCheckedChange?(checked: boolean): void
}

export const Checkbox = forwardRef<HTMLButtonElement, TProps>(
  ({ className, disabled, onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = (value: RadixCheckbox.CheckedState) => {
      if (value === 'indeterminate') onCheckedChange?.(false)
      else onCheckedChange?.(value)
    }

    return (
      <RadixCheckbox.Root
        ref={ref}
        className={StyleHelper.mergeStyles(
          'min-size-5 max-size-5 flex size-5 cursor-pointer items-center justify-center rounded-sm border-2 aria-[checked="false"]:bg-transparent',
          {
            'cursor-not-allowed border-gray-300 aria-[checked="true"]:bg-gray-300': disabled,
            'border-neon aria-[checked="true"]:bg-neon': !disabled,
          },
          className
        )}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <RadixCheckbox.Indicator>
          <FiCheck aria-hidden className="stroke-asphalt size-full stroke-2" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    )
  }
)
