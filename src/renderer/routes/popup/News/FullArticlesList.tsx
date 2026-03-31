import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Checkbox } from '@renderer/components/Checkbox'
import { Loader } from '@renderer/components/Loader'
import { Select } from '@renderer/components/Select'
import { Separator } from '@renderer/components/Separator'

import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useShowNewsModalSelector } from '@renderer/hooks/useSettingsSelector'

import { settingsReducerActions } from '@renderer/store/reducers/settings'
import type { TNewsArticle } from '@shared/types/query'

import { ArticleListItem } from './ArticleListItem'

export type TSortOrder = 'desc' | 'asc'

type TProps = {
  articles: TNewsArticle[]
  isArticlesListLoading: boolean
  sortOrder: TSortOrder
  onSortOrderChange: (order: TSortOrder) => void
  onSelectArticle: (index: number) => void
}

type TGroupedArticles = {
  year: number
  items: { article: TNewsArticle; index: number }[]
}[]

export const FullArticlesList = ({
  articles,
  isArticlesListLoading,
  sortOrder,
  onSortOrderChange,
  onSelectArticle,
}: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'news' })
  const { showNewsModal } = useShowNewsModalSelector()
  const dispatch = useAppDispatch()

  const [shouldShowModalOnLogin, setShouldShowModalOnLogin] = useState(showNewsModal)

  const groupedArticles = articles
    .map((article, index) => ({ article, index }))
    .reduce<TGroupedArticles>((groups, { article, index }) => {
      const year = new Date(article.created_at).getFullYear()

      const existing = groups.find(group => group.year === year)

      if (existing) {
        existing.items.push({ article, index })
      } else {
        groups.push({ year, items: [{ article, index }] })
      }
      return groups
    }, [])

  const handleShouldShowModalOnLoginChange = (checked: boolean) => {
    setShouldShowModalOnLogin(checked)
    dispatch(settingsReducerActions.setShowNewsModal(checked))
  }

  return (
    <Fragment>
      <div className="flex w-full items-center justify-between pt-4">
        <Select.Root value={sortOrder} onValueChange={value => onSortOrderChange(value as TSortOrder)}>
          <Select.Trigger className="w-fit bg-gray-800">
            <Select.Value />
            <Select.Icon className="text-neon" />
          </Select.Trigger>

          <Select.Content className="bg-gray-700">
            <Select.Item value="desc">
              <Select.ItemText>{t('sortDateDescending')}</Select.ItemText>
            </Select.Item>

            <Select.Item value="asc">
              <Select.ItemText>{t('sortDateAscending')}</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <div className="flex items-center justify-center font-normal">
          <label htmlFor="showModalOnLoginCheckbox" className="cursor-pointer pr-2 text-sm text-gray-100 select-none">
            {t('showModalOnLoginLabel')}
          </label>
          <Checkbox
            onCheckedChange={handleShouldShowModalOnLoginChange}
            id="showModalOnLoginCheckbox"
            checked={shouldShowModalOnLogin}
          />
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-y-4 py-2">
        {match({ isArticlesListLoading, hasArticles: groupedArticles.length > 0 })
          .with({ isArticlesListLoading: true }, () => (
            <Loader className="size-10 text-gray-100" containerClassName="pb-12 h-full items-center" />
          ))
          .with({ hasArticles: false }, () => (
            <p className="flex flex-1 items-center justify-center px-6 pb-12 text-center text-sm text-gray-100">
              {t('noArticlesMessage')}
            </p>
          ))
          .otherwise(() => (
            <div className="flex flex-col gap-y-4 py-4">
              {groupedArticles.map(group => (
                <div key={group.year}>
                  <p className="py-2 text-sm font-medium text-white">{group.year}</p>
                  <Separator />
                  <ul className="flex flex-col gap-y-3">
                    {group.items.map(({ article, index }) => (
                      <ArticleListItem
                        key={`${article.id}`}
                        article={article}
                        onSelect={() => onSelectArticle(index)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
      </div>
    </Fragment>
  )
}
