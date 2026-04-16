import { useState } from 'react'

import type { ComponentProps, ReactEventHandler } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { Loader } from './Loader'

type TProps = ComponentProps<'img'> & {
  containerClassName?: string
  src: string
  alt: string
  fallbackSrc: string
}

export const ImageWithFallback = ({ fallbackSrc, className, containerClassName, ...props }: TProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleError: ReactEventHandler<HTMLImageElement> = event => {
    event.currentTarget.onerror = null

    if (fallbackSrc) {
      event.currentTarget.src = fallbackSrc
    }
  }

  return (
    <div className={StyleHelper.mergeStyles('size-4', containerClassName)}>
      {isLoading && <Loader className="size-full text-gray-600" />}

      <img
        {...props}
        className={StyleHelper.mergeStyles(
          { hidden: isLoading },
          'pointer-events-none size-full object-contain select-none',
          className
        )}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
