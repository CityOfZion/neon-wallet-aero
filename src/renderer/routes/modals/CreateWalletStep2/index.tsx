import { useMemo } from 'react'

import { shuffle } from 'lodash'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdiInformationOutline from '@renderer/assets/images/mdi-information-outline.svg?react'
import MdiNumeric2Box from '@renderer/assets/images/mdi-numeric-2-box.svg?react'
import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

import type { TModalState } from '@shared/types/modal'

type TActionData = {
  pressedWordsIndex: number[]
}

export const CreateWalletStep2Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createWalletStep2' })
  const { mnemonic } = useModalState<TModalState<'create-wallet-2'>>()
  const { modalNavigate, modalEraseWrapper } = useModalNavigate()

  const shuffledWords = useMemo(() => shuffle(mnemonic), [mnemonic])

  const {
    actionData: { pressedWordsIndex },
    actionState,
    setData,
  } = useActions<TActionData>({
    pressedWordsIndex: [],
  })

  const isDisabled = shuffledWords.length === 0 || shuffledWords.length !== mnemonic.length || actionState.isActing

  const wordWasAlreadyPressed = (wordIndex: number) => pressedWordsIndex.some(pressedWord => pressedWord === wordIndex)

  const handlePressWord = (wordIndex: number) => {
    const isWordPressed = wordWasAlreadyPressed(wordIndex)

    setData(prevState => ({
      pressedWordsIndex: isWordPressed
        ? prevState.pressedWordsIndex.filter(state => state !== wordIndex)
        : [...prevState.pressedWordsIndex, wordIndex],
    }))
  }

  const handlePressContinue = async () => {
    const mountedPressedWords = pressedWordsIndex.map(wordIndex => shuffledWords[wordIndex]).join(' ')
    const mountedWords = mnemonic.join(' ')

    if (mountedPressedWords !== mountedWords) {
      setData({ pressedWordsIndex: [] })
      ToastHelper.error({ message: t('errors.wordsNotMatch') })
      return
    }

    modalNavigate('create-wallet-3', {
      state: {
        mnemonic,
      },
    })
  }

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="flex items-center gap-4 px-3.5 pt-2 pb-4">
        <MdiNumeric2Box className="text-blue h-6 w-6" aria-hidden />
        <h3 className="text-lg">{t('subtitle')}</h3>
      </div>

      <div className="px-3.5 pb-5 text-sm text-gray-100">
        <Trans t={t} i18nKey="selectWordsText">
          start
          <span className="font-bold text-white">middle</span>
          end
        </Trans>
      </div>

      <div className="flex flex-col items-center rounded px-3.5 py-2">
        <div className="grid w-full grid-cols-3 items-center justify-center gap-2 text-center text-lg">
          {shuffledWords.map((item, index) => {
            const isWordPressed = wordWasAlreadyPressed(index)
            return (
              <Button
                className={StyleHelper.mergeStyles({
                  'rounded-sm bg-gray-100': isWordPressed,
                })}
                onClick={handlePressWord.bind(null, index)}
                label={item}
                colorSchema={isWordPressed ? 'asphalt' : 'neon'}
                variant={isWordPressed ? 'text' : 'outlined'}
                aria-selected={isWordPressed}
                key={`${item}-${index}`}
              />
            )
          })}
        </div>
      </div>

      <div className="mx-3.5 mt-2.5 mb-5 flex rounded-sm bg-gray-300/30">
        <div className="rounded-l-sm bg-gray-300/30 px-3 py-5">
          <MdiInformationOutline aria-hidden className="w-6 text-gray-100" />
        </div>
        <div className="px-5 py-2.5">
          <p className="text-xs">{t('alertText')}</p>
        </div>
      </div>

      <div className="mt-auto flex gap-2.5 px-3.5">
        <Button
          variant="card"
          label={t('cancelButtonLabel')}
          colorSchema="gray"
          onClick={modalEraseWrapper('bottom')}
        />
        <Button
          className="w-full"
          variant="card"
          label={t('nextButtonLabel')}
          rightIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
          iconsOnEdge={false}
          onClick={handlePressContinue}
          disabled={isDisabled}
        />
      </div>
    </BottomModalLayout>
  )
}

export default CreateWalletStep2Modal
