import { forwardRef } from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import FiCheck from '@renderer/assets/images/fi-check.svg?react'

type TProps = Omit<RadixCheckbox.CheckboxProps, 'onCheckedChange'> & {
  onCheckedChange?(checked: boolean): void
}

export const Checkbox = forwardRef<HTMLButtonElement, TProps>(({ className, onCheckedChange, ...props }, ref) => {
  const handleCheckedChange = (value: RadixCheckbox.CheckedState) => {
    if (value === 'indeterminate') onCheckedChange?.(false)
    else onCheckedChange?.(value)
  }

  return (
    <RadixCheckbox.Root
      ref={ref}
      className={StyleHelper.mergeStyles(
        'flex max-h-[1.125rem] min-h-[1.125rem] max-w-[1.125rem] min-w-[1.125rem] cursor-pointer items-center justify-center rounded-sm border-2',
        {
          'cursor-not-allowed border-gray-300 aria-[checked="false"]:bg-transparent aria-[checked="true"]:bg-gray-300':
            props.disabled,
          'border-neon aria-[checked="true"]:bg-neon aria-[checked="false"]:bg-transparent': !props.disabled,
        },
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <RadixCheckbox.Indicator>
        <FiCheck aria-hidden className="stroke-asphalt h-full w-full stroke-2" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
})
