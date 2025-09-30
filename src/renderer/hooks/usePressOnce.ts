import { useRef, useState } from 'react'

export const usePressOnce = (callback: (() => void) | (() => Promise<void>)) => {
  const [isPressing, setIsPressing] = useState(false)
  const isPressingRef = useRef(false)

  const handlePress = () => async () => {
    if (isPressing || isPressingRef.current) return

    setIsPressing(true)
    isPressingRef.current = true

    try {
      await callback()
    } finally {
      setIsPressing(false)
      isPressingRef.current = false
    }
  }

  return { isPressing, isPressingRef, handlePress }
}
