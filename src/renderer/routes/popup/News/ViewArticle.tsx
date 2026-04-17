import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '@renderer/components/Button'

import { DateHelper } from '@renderer/helpers/DateHelper'

import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'
import TbArrowRight from '@renderer/assets/images/tb-arrow-right.svg?react'

import type { TNewsArticle } from '@shared/types/query'

type TProps = {
  article: TNewsArticle
  isLastArticle: boolean
  onBack: () => void
  onPrevious?: () => void
  onNext?: () => void
}

export const ViewArticle = ({ article, isLastArticle, onBack, onPrevious, onNext }: TProps) => {
  const { language } = useLanguageSelector()
  const formattedDate = DateHelper.formatLocalized(new Date(article.created_at), { language, format: 'PP' })

  const { t } = useTranslation('pages', { keyPrefix: 'news.viewArticle' })

  return (
    <Fragment>
      <div className="flex w-full items-center justify-between">
        <Button
          variant="text-slim"
          onClick={onBack}
          colorSchema="gray"
          leftIcon={<TbArrowLeft aria-hidden />}
          label={t('backToNewsButtonLabel')}
        />

        <div className="flex items-center gap-1">
          {isLastArticle ? (
            <Button
              variant="text-slim"
              label={t('previousArticleButtonLabel')}
              colorSchema="gray"
              leftIcon={<TbArrowLeft aria-hidden />}
              onClick={onPrevious}
            />
          ) : (
            <Button
              variant="text-slim"
              label={t('nextArticleButtonLabel')}
              rightIcon={<TbArrowRight aria-hidden />}
              onClick={onNext}
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-y-2.5 pb-8">
        <div className="flex w-full items-center justify-between text-base">
          <p className="text-blue">{formattedDate}</p>
          <p className="text-gray-100">COZ</p>
        </div>

        <h1 className="py-3 text-2xl break-all">{article.title}</h1>

        {article.previewImage && (
          <img src={article.previewImage} alt={article.title} className="my-3 max-w-full rounded-lg" />
        )}

        <div className="markdown-body w-full flex-1 overflow-y-auto text-xs">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {article.body}
          </Markdown>
        </div>
      </div>
    </Fragment>
  )
}
