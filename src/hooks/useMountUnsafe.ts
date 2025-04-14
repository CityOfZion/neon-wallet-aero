import { useEffect, useRef, useState } from 'react'

type TOnEffect = () => void | Promise<void> | (() => void | Promise<void>)

export const useMountUnsafe = (onEffect: TOnEffect, delay = 0) => {
  const [isMounting, setIsMounting] = useState(true)

  const numberOfRenders = useRef(0)
  const onUnmountEffectRef = useRef<ReturnType<TOnEffect>>(undefined)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    numberOfRenders.current += 1

    // StrictMode make the effect to run twice, and we want to run the effect only once on the first render
    if (numberOfRenders.current <= 1) {
      timeoutRef.current = setTimeout(() => {
        try {
          onUnmountEffectRef.current = onEffect()
        } finally {
          setIsMounting(false)
        }
      }, delay)
    }

    return () => {
      // StrictMode make the effect to run twice, and we don't want to unmount the effect on the first render because it's not the real unmount
      if (numberOfRenders.current > 1) {
        clearTimeout(timeoutRef.current)

        if (onUnmountEffectRef.current && typeof onUnmountEffectRef.current === 'function') onUnmountEffectRef.current()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isMounting }
}
