import { createContext, forwardRef, useContext, useId } from 'react'

import * as RadixSwitch from '@radix-ui/react-switch'
import type { ComponentProps, ComponentPropsWithoutRef, ComponentRef } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

const SwitchContext = createContext<{ id?: string }>({})

const useSwitch = () => useContext(SwitchContext)

type TRootProps = ComponentProps<'div'> & {
  id?: string
}

const Root = ({ id, className, ...props }: TRootProps) => {
  const generatedId = useId()

  return (
    <SwitchContext.Provider value={{ id: id || generatedId }}>
      <div className={StyleHelper.mergeStyles('flex items-center gap-x-1.5', className)} {...props} />
    </SwitchContext.Provider>
  )
}

const Control = forwardRef<ComponentRef<typeof RadixSwitch.Root>, ComponentPropsWithoutRef<typeof RadixSwitch.Root>>(
  ({ className, ...props }, ref) => {
    const { id } = useSwitch()

    return (
      <RadixSwitch.Root
        {...props}
        id={id}
        ref={ref}
        className={StyleHelper.mergeStyles(
          'bg-asphalt data-[state=checked]:bg-neon relative box-content h-5 w-9 cursor-pointer rounded-full px-0.5 shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        <RadixSwitch.Thumb className="bg-neon data-[state=checked]:bg-asphalt block size-4 translate-x-0 transform rounded-full shadow-lg transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5" />
      </RadixSwitch.Root>
    )
  }
)

const Label = ({ className, ...props }: ComponentProps<'label'>) => {
  const { id } = useSwitch()

  return (
    <label
      htmlFor={id}
      className={StyleHelper.mergeStyles('cursor-pointer text-xs font-normal text-gray-100 select-none', className)}
      {...props}
    />
  )
}

export const Switch = { Root, Control, Label }
