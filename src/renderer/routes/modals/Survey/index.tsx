import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'
import { Textarea } from '@renderer/components/Textarea'

import { StoreReviewHelper } from '@renderer/helpers/StoreReviewHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbFilledThumbDown from '@renderer/assets/images/tb-filled-thumb-down.svg?react'
import TbFilledThumbUp from '@renderer/assets/images/tb-filled-thumb-up.svg?react'
import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'
import TbThumbDown from '@renderer/assets/images/tb-thumb-down.svg?react'
import TbThumbUp from '@renderer/assets/images/tb-thumb-up.svg?react'

type TActionsData = {
  rating?: 'up' | 'down'
  description?: string
  negativeFeedbackSubmitted: boolean
}

export const SurveyModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'survey' })
  const { modalErase, modalEraseWrapper } = useModalNavigate()

  const { actionData, actionState, setData, setDataFromEventWrapper, handleAct } = useActions<TActionsData>({
    rating: undefined,
    description: '',
    negativeFeedbackSubmitted: false,
  })

  const handlePressThumbsUp = () => {
    setData({ rating: 'up' })
    StoreReviewHelper.openReview()
    modalErase('bottom')
  }

  const handleSubmitFeedback = async () => {
    if (actionData.rating === 'down') {
      // TODO: handle negative feedback when backend is ready

      setData({ negativeFeedbackSubmitted: true })
    }
  }

  const isDisabled = !actionData.description || actionState.isActing

  return (
    <BottomModalLayout heading={actionData.negativeFeedbackSubmitted ? t('titleFeedbackSubmitted') : t('title')}>
      {actionData.negativeFeedbackSubmitted ? (
        <div className="flex flex-1 flex-col items-center gap-y-6">
          <TbRosetteDiscountCheck className="text-blue mt-4 size-24" aria-hidden />
          <p className="text-center text-sm">{t('descriptionFeedbackSubmitted')}</p>
          <Button
            label={t('closeButtonLabel')}
            variant="card"
            className="mt-auto w-full"
            onClick={modalEraseWrapper('bottom')}
          />
        </div>
      ) : (
        <Fragment>
          <p className="my-6 text-sm">{t('description')}</p>
          <div className="mb-6 flex justify-center gap-x-8">
            <IconButton
              aria-label={t('likeButtonLabel')}
              icon={
                actionData.rating === 'up' ? (
                  <TbFilledThumbUp aria-hidden className="text-neon size-10" />
                ) : (
                  <TbThumbUp
                    aria-hidden
                    className={StyleHelper.mergeStyles('size-10', {
                      'text-gray-400': actionData.rating === 'down',
                      'text-neon': actionData.rating !== 'down',
                    })}
                  />
                )
              }
              onClick={handlePressThumbsUp}
            />
            <IconButton
              aria-label={t('dislikeButtonLabel')}
              icon={
                actionData.rating === 'down' ? (
                  <TbFilledThumbDown aria-hidden className="text-pink size-10" />
                ) : (
                  <TbThumbDown
                    aria-hidden
                    className={StyleHelper.mergeStyles('size-10', {
                      'text-gray-400': actionData.rating === 'up',
                      'text-pink': actionData.rating !== 'up',
                    })}
                  />
                )
              }
              onClick={() => setData({ rating: 'down' })}
            />
          </div>

          {actionData.rating === 'down' ? (
            <form onSubmit={handleAct(handleSubmitFeedback)} className="flex flex-1 flex-col">
              <Textarea
                id="details"
                multiline
                label={t('detailsInputLabel')}
                placeholder={t('detailsInputPlaceholder')}
                value={actionData.description}
                onChange={setDataFromEventWrapper('description')}
                className="max-h-40 min-h-40 overflow-y-auto"
              />
              <Button
                type="submit"
                label={t('submitButtonLabel')}
                variant="card"
                className="mt-auto w-full"
                disabled={isDisabled}
                loading={actionState.isActing}
              />
            </form>
          ) : (
            <Button
              label={t('notNowButtonLabel')}
              variant="text"
              className="mb-6 w-fit self-center"
              colorSchema="gray"
              onClick={modalEraseWrapper('bottom')}
            />
          )}
        </Fragment>
      )}
    </BottomModalLayout>
  )
}

export default SurveyModal
