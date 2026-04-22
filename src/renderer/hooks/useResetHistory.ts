import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

export const useResetHistory = () => {
  const navigate = useNavigate()

  const resetHistory = useCallback(
    (path: string) => {
      const idx = (window.history.state as { idx?: number })?.idx ?? 0

      const clearAndNavigate = () => {
        // Replace the entry at idx=0 with the target path, clearing back history
        navigate(path, { replace: true })
        // Push from idx=0 to truncate all forward entries, leaving
        // [path(back), path(current)] so neither direction escapes to unwanted pages
        navigate(path)
      }

      if (idx === 0) {
        clearAndNavigate()
        return
      }

      const handlePopState = () => {
        window.removeEventListener('popstate', handlePopState)
        clearAndNavigate()
      }

      window.addEventListener('popstate', handlePopState)
      window.history.go(-idx)
    },
    [navigate]
  )

  return { resetHistory }
}
