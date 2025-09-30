import { RefObject, useEffect, useLayoutEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

type TUseVirtualizerOptions = Parameters<typeof useVirtualizer>[0]

type TUseVirtualizationOptions = Omit<TUseVirtualizerOptions, 'getScrollElement'> & {
  contentRef: RefObject<HTMLElement | null>
  getScrollElement?: TUseVirtualizerOptions['getScrollElement']
}

type TUseInfiniteScrollVirtualizationOptions = {
  virtualizer: ReturnType<typeof useVirtualization>
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  data: any[]
}

export const useVirtualization = ({ contentRef, getScrollElement, ...options }: TUseVirtualizationOptions) => {
  const [paddingStart, setPaddingStart] = useState(0)
  const VERTICAL_SECTION_GAP = 16

  const virtualizer = useVirtualizer({
    paddingStart,
    getScrollElement: getScrollElement || (() => document.getElementById('screen-layout-container')),
    ...options,
  })

  const totalSize = virtualizer.getTotalSize()

  useEffect(() => {
    virtualizer._willUpdate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (getScrollElement) return

    const scrollContentElement = document.getElementById('screen-layout-content')
    if (!scrollContentElement) return

    scrollContentElement.style.minHeight = `${totalSize}px`
    scrollContentElement.style.position = 'relative'

    return () => {
      scrollContentElement.style.minHeight = ''
      scrollContentElement.style.position = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSize])

  useLayoutEffect(() => {
    if (!virtualizer.scrollElement || !contentRef.current || paddingStart) return
    const scrollElementRect = virtualizer.scrollElement!.getBoundingClientRect()
    const contentRect = contentRef.current!.getBoundingClientRect()

    setPaddingStart(
      contentRect.top - scrollElementRect.top + virtualizer.scrollElement.scrollTop - VERTICAL_SECTION_GAP
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSize, contentRef, virtualizer.scrollElement])

  return virtualizer
}

export const useInfiniteScrollVirtualization = ({
  virtualizer,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  data,
}: TUseInfiniteScrollVirtualizationOptions) => {
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem) {
      return
    }

    if (lastItem.index >= data.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, fetchNextPage, data.length, isFetchingNextPage, virtualizer.getVirtualItems()])
}
