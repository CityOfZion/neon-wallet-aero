import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { IconButton } from '@renderer/components/IconButton'

import { useActions } from '@renderer/hooks/useActions'
import { useInfiniteScroll } from '@renderer/hooks/useInfiniteScroll'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useNewsArticles } from '@renderer/hooks/useNewsArticles'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import type { TSortOrder } from './FullArticlesList'
import { FullArticlesList } from './FullArticlesList'
import { ViewArticle } from './ViewArticle'

type TLocationState = {
  selectedIndex?: number
}

type TActionsData = {
  sortOrder: TSortOrder
  selectedIndex: number | null
}

export const NewsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'news' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { state } = useLocation() as Location<TLocationState>
  const { modalNavigateWrapper } = useModalNavigate()

  const { articles, isLoading, fetchNextPage, hasNextPage, isFetching } = useNewsArticles()

  const { handleScroll, ref } = useInfiniteScroll<HTMLDivElement>(() => {
    fetchNextPage()
  })

  const {
    actionData: { sortOrder, selectedIndex },
    setData,
  } = useActions<TActionsData>({
    sortOrder: 'desc',
    selectedIndex: state?.selectedIndex ?? null,
  })

  const sortedArticles = [...articles].toSorted((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  const handlePreviousArticle = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setData({ selectedIndex: selectedIndex - 1 })
    }
  }

  const handleNextArticle = () => {
    if (selectedIndex !== null && selectedIndex < sortedArticles.length - 1) {
      setData({ selectedIndex: selectedIndex + 1 })
    }
  }

  const isFetchingAllForAsc = sortOrder === 'asc' && (hasNextPage ?? false)

  useEffect(() => {
    if (isFetchingAllForAsc && !isFetching) {
      fetchNextPage()
    }
  }, [isFetchingAllForAsc, isFetching, fetchNextPage])

  return (
    <ScreenLayout
      heading={t('title')}
      ref={ref}
      onScroll={handleScroll}
      rightComponent={
        <IconButton
          aria-label={tCommon('menuIconButtonAriaLabel')}
          className="mb-0.5"
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
      withBackButton={false}
    >
      {selectedIndex !== null ? (
        <ViewArticle
          article={sortedArticles[selectedIndex]}
          onBack={() => setData({ selectedIndex: null })}
          onPrevious={handlePreviousArticle}
          onNext={handleNextArticle}
          isLastArticle={selectedIndex === sortedArticles.length - 1}
        />
      ) : (
        <FullArticlesList
          articles={sortedArticles}
          isArticlesListLoading={isLoading}
          sortOrder={sortOrder}
          onSortOrderChange={sortOrder => setData({ sortOrder })}
          onSelectArticle={index => setData({ selectedIndex: index })}
        />
      )}
    </ScreenLayout>
  )
}

export default NewsPage
