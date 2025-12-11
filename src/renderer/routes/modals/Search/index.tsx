import { type ChangeEvent, useCallback, useMemo } from 'react'

import { search } from 'fast-fuzzy'
import { debounce, orderBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { removeStopwords } from 'stopword'
import { match, P } from 'ts-pattern'
import winkWebModel from 'wink-eng-lite-web-model'
import WinkNLP from 'wink-nlp'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Loader } from '@renderer/components/Loader'

import { AppError } from '@renderer/helpers/ErrorHelper'
import { SynonymsHelper } from '@renderer/helpers/SynonymsHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdChevronRight from '@renderer/assets/images/md-chevron-right.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import TbSearch from '@renderer/assets/images/tb-search.svg?react'

import { functionsByActionId } from './functionsByActionId'

type TActionsData = {
  isSearching: boolean
  foundActions?: TAction[]
  search: string
}

type TAction = {
  label: string
  verbs: string[]
  nonVerbs: string[]
  id: string
}

type TItem = {
  action: TAction
  verbsMatchedQuantity: number
  nonVerbsMatchedQuantity: number
}

const nlp = WinkNLP(winkWebModel)

const SearchModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'search' })
  const { t: tSearch } = useTranslation('search')
  const modalActions = useModalNavigate()
  const popupNavigate = useNavigate()

  const { actionData, setData } = useActions<TActionsData>({
    isSearching: false,
    search: '',
    foundActions: undefined,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchActions = useMemo<TAction[]>(() => tSearch('actions', { returnObjects: true }), [])

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value
    setData({ search, isSearching: true })

    if (search.trim().length === 0) {
      setData({ isSearching: false, foundActions: undefined })
      handleSearch.cancel()
      return
    }

    await handleSearch(search)
  }

  const handleClick = async (action: Omit<TAction, 'onPress'>) => {
    try {
      const func = functionsByActionId[action.id]
      if (!func) {
        ToastHelper.error({ message: t('errors.noFunction') })
        return
      }

      await func({ modalActions, popupNavigate })
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: AppError.wrap(error, t('errors.errorToExecute')).message })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(async (text: string) => {
      const doc = nlp.readDoc(text.toLowerCase())
      const tokens = doc.tokens().filter(t => t.out(nlp.its.type) === 'word')
      const verbs = tokens.filter(token => token.out(nlp.its.pos) === 'VERB').out(nlp.its.lemma as any) as string[]
      const nonVerbs = removeStopwords(
        tokens.filter(token => token.out(nlp.its.pos) !== 'VERB').out(nlp.its.lemma as any) as string[]
      )

      const verbsQuantity = verbs.length
      const nonVerbsQuantity = nonVerbs.length

      const hasVerbs = verbsQuantity > 0
      const hasNonVerbs = nonVerbsQuantity > 0

      try {
        if (!hasVerbs && !hasNonVerbs) {
          setData({ foundActions: [] })

          return
        }

        const items: TItem[] = []

        for (const action of searchActions) {
          const allVerbsSynonyms = await SynonymsHelper.getAllSynonyms(action.verbs)
          const allNonVerbsSynonyms = await SynonymsHelper.getAllSynonyms(action.nonVerbs)

          const lowerCaseLabels = action.label.toLowerCase().split(' ')
          const allVerbs = [...lowerCaseLabels, ...action.verbs, ...allVerbsSynonyms]
          const allNonVerbs = [...lowerCaseLabels, ...action.nonVerbs, ...allNonVerbsSynonyms]

          const filteredVerbs = verbs.filter(
            verb =>
              allVerbs.some(value => value.startsWith(verb)) || search(verb, allVerbs, { threshold: 0.8 }).length > 0
          )

          const filteredNonVerbs = nonVerbs.filter(
            nonVerb =>
              allNonVerbs.some(value => value.startsWith(nonVerb)) ||
              search(nonVerb, allNonVerbs, { threshold: 0.8 }).length > 0
          )

          const verbsMatchedQuantity = filteredVerbs.length
          const nonVerbsMatchedQuantity = filteredNonVerbs.length

          const hasVerbsMatchedQuantity = verbsMatchedQuantity > 0
          const hasNonVerbsMatchedQuantity = nonVerbsMatchedQuantity > 0

          const item = {
            action: {
              ...action,
              onPress: async () => await handleClick(action),
            },
            verbsMatchedQuantity,
            nonVerbsMatchedQuantity,
          }

          if (hasVerbs && hasNonVerbs) {
            if (hasVerbsMatchedQuantity || hasNonVerbsMatchedQuantity) items.push(item)
          } else if (hasVerbs) {
            if (hasVerbsMatchedQuantity) items.push(item)
          } else if (hasNonVerbs && hasNonVerbsMatchedQuantity) items.push(item)
        }

        setData({
          foundActions: orderBy(items, ['verbsMatchedQuantity', 'nonVerbsMatchedQuantity'], ['desc', 'desc']).map(
            ({ action }) => action
          ),
        })
      } catch {
        setData({ foundActions: [] })
      } finally {
        setData({ isSearching: false })
      }
    }, 1500),
    []
  )

  return (
    <BottomModalLayout heading={t('title')}>
      <Input
        leftIcon={<TbSearch aria-hidden className="text-neon size-6" />}
        onChange={handleChange}
        value={actionData.search}
        clearable
        autoFocus
        maxLength={200}
      />

      {match(actionData)
        .with({ isSearching: true }, () => (
          <Loader containerClassName="grow items-center" className="size-8 text-gray-300" />
        ))
        .with({ foundActions: P.when(value => value === undefined || value.length === 0) }, ({ foundActions }) => (
          <div className="flex grow items-center justify-center gap-2.5">
            <TbSearch aria-hidden className="size-8 text-gray-300" />
            <h2 className="text-xl text-gray-300">
              {foundActions === undefined ? t('idleResultDescription') : t('emptyResultDescription')}
            </h2>
          </div>
        ))
        .otherwise(({ foundActions }) => (
          <div className="flex min-h-0 grow flex-col gap-y-2 pt-2">
            <p className="px-2 py-2.5 text-sm text-gray-100">{t('resultDescription')}</p>
            <ul className="flex min-h-0 grow flex-col overflow-auto">
              {foundActions!.map((action, index) => (
                <li key={`search-action-${index}`}>
                  <Button
                    label={action.label}
                    variant="text"
                    colorSchema="white"
                    className="w-full"
                    textClassName="text-left"
                    leftIcon={<TbHelp aria-hidden className="text-blue size-5" />}
                    rightIcon={<MdChevronRight aria-hidden className="size-5 text-white" />}
                    onClick={() => handleClick(action)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
    </BottomModalLayout>
  )
}

export default SearchModal
