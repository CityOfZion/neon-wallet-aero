import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

import { Checkbox } from '@renderer/components/Checkbox'
import { Loader } from '@renderer/components/Loader'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useNewsArticles } from '@renderer/hooks/useNewsArticles'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import { ArticleListItem } from '@renderer/routes/popup/News/ArticleListItem'

import { settingsReducerActions } from '@renderer/store/reducers/settings'

export const NewsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'news' })
  const { articles, isLoading } = useNewsArticles()
  const dispatch = useAppDispatch()
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const latestFiveArticles = articles
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked)
  }

  const handleClose = () => {
    if (dontShowAgain) {
      dispatch(settingsReducerActions.setShowNewsModal(false))
    }
  }

  const handleSelectArticle = (index: number) => {
    modalErase('bottom')
    navigate('/news', { state: { selectedIndex: index } })
  }

  return (
    <BottomModalLayout heading={t('title')} onClose={handleClose}>
      <ul className="flex flex-1 flex-col gap-y-2 pt-2">
        {match({ isLoading, hasArticles: latestFiveArticles.length > 0 })
          .with({ isLoading: true }, () => (
            <Loader className="size-10 text-gray-100" containerClassName="pb-10 h-full items-center" />
          ))

          .with({ hasArticles: false }, () => (
            <p className="flex flex-1 items-center justify-center px-6 pb-8 text-center text-sm text-gray-100">
              {t('noArticlesMessage')}
            </p>
          ))

          .otherwise(() =>
            latestFiveArticles.map((article, index) => (
              <ArticleListItem
                key={`${article.created_at}-${article.title}`}
                article={article}
                onSelect={() => handleSelectArticle(index)}
              />
            ))
          )}
      </ul>

      <div className="mt-auto flex items-center justify-center pb-3 font-normal">
        <Checkbox onCheckedChange={handleDontShowAgainChange} id="dontShowAgainCheckbox" checked={dontShowAgain} />

        <label htmlFor="dontShowAgainCheckbox" className="cursor-pointer pl-2 text-sm text-gray-100 select-none">
          {t('dontShowAgainLabel')}
        </label>
      </div>
    </BottomModalLayout>
  )
}

export default NewsModal
