import { RefObject, useLayoutEffect, useRef } from 'react'

export const useRemoveOverflowShift = (ref: RefObject<HTMLElement | null>) => {
  const initialPaddingRight = useRef<number>(undefined)

  useLayoutEffect(() => {
    const getInitialPaddingRight = () => {
      if (!ref.current) return
      const computedStyle = window.getComputedStyle(ref.current)
      initialPaddingRight.current = parseFloat(computedStyle.paddingRight)
    }

    const trigger = () => {
      if (!ref.current || !initialPaddingRight.current) return
      const hasOverflow = ref.current.scrollHeight > ref.current.clientHeight

      if (hasOverflow) {
        const scrollBarWidth = ref.current.offsetWidth - ref.current.clientWidth
        ref.current.style.paddingRight = initialPaddingRight.current - scrollBarWidth + 'px'
      } else {
        ref.current.style.paddingRight = initialPaddingRight.current + 'px'
      }
    }

    if (ref.current) {
      new ResizeObserver(trigger).observe(ref.current)
    }

    getInitialPaddingRight()
    trigger()
  }, [ref])
}
