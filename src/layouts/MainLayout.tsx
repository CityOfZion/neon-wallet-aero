import { ComponentProps, useRef } from 'react'

import { EnvHelper } from '@/helpers/EnvHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useRemoveOverflowShift } from '@/hooks/useRemoveOverflowShift'

type TProps = ComponentProps<'div'>

export const MainLayout = ({ children, ...props }: TProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useRemoveOverflowShift(ref)

  return (
    <div
      className={StyleHelper.mergeStyles('flex h-full w-full items-center justify-center bg-gray-950', {
        'h-screen w-screen': EnvHelper.DEV,
      })}
    >
      <div
        ref={ref}
        className={StyleHelper.mergeStyles(
          'flex max-h-[37.5rem] min-h-[37.5rem] max-w-[25rem] min-w-[25rem] flex-col overflow-auto bg-gray-900 px-5 py-3.5',
          { 'rounded-lg': EnvHelper.DEV }
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
