import { useLayoutEffect, useRef } from 'react'

export const useRemoveOverflowShift = <T extends HTMLElement = HTMLElement>(isFocused?: boolean) => {
  const initialPaddingRight = useRef<number>(undefined)
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    if (isFocused === false || !ref.current) return

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

    const computedStyle = window.getComputedStyle(ref.current)
    initialPaddingRight.current = parseFloat(computedStyle.paddingRight)

    const observer = new MutationObserver(trigger)
    observer.observe(ref.current, { attributes: true, childList: true, subtree: true })

    trigger()

    return () => {
      observer.disconnect()
    }
  }, [isFocused])

  return { ref }
}
