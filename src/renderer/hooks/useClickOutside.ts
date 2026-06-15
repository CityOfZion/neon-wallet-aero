import { useEffect } from 'react'

import type { RefObject } from 'react'

type TOptions = {
  enabled?: boolean
}

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  options?: TOptions
) => {
  const { enabled = true } = options ?? {}

  useEffect(() => {
    if (!enabled) return

    let hadFixedElementOnPointerDown = false

    const handlePointerDown = () => {
      hadFixedElementOnPointerDown =
        !!document.querySelector('[data-radix-popper-content-wrapper]') || !!document.querySelector('[data-toast-item]')
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (hadFixedElementOnPointerDown) return

      const target = event.target as Element

      if (ref.current && !ref.current.contains(target)) {
        callback()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [enabled, ref, callback])
}
