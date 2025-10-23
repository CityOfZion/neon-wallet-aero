import { useRef, useTransition } from 'react'

type TCallback<T extends any[] = any[]> = (...args: T) => void | Promise<void>

export function usePressOnce(): [boolean, <T extends any[]>(callback: TCallback<T>) => (...args: T) => void]
export function usePressOnce<T extends any[]>(rootCallback: TCallback<T>): [boolean, () => (...args: T) => void]
export function usePressOnce<T extends any[] = any[]>(rootCallback?: TCallback<T>): any {
  const isPressingRef = useRef(false)
  const [isPressing, startPressing] = useTransition()

  const handlePress = <A extends any[] = T>(childrenCallback?: TCallback<A>) => {
    return (...args: A) => {
      if (isPressingRef.current) return

      startPressing(async () => {
        isPressingRef.current = true

        try {
          if (rootCallback) {
            await rootCallback(...(args as unknown as T))
          } else if (childrenCallback) {
            await childrenCallback(...args)
          }
        } finally {
          isPressingRef.current = false
        }
      })
    }
  }

  return [isPressing, handlePress] as const
}
