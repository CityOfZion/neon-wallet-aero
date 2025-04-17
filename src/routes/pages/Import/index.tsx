import { useTranslation } from 'react-i18next'

import { Banner } from '@/components/Banner'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Textarea'
import { useImportActions } from '@/hooks/useImportActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { ScreenLayout } from '@/layouts/ScreenLayout'
import { TBlockchainServiceKey } from '@/types/blockchain'

export const ImportPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import' })
  const { modalNavigate } = useModalNavigate()

  const submitAddress = async (value: string) => {
    modalNavigate('import-accounts-selection', { state: { value, type: 'address' } })
  }

  const submitKey = async (value: string) => {
    modalNavigate('import-accounts-selection', { state: { value, type: 'key' } })
  }

  const submitEncryptedKey = async (encryptedKey: string) => {
    modalNavigate('blockchain-selection', {
      state: {
        heading: t('title'),
        description: t('blockchainSelectionDescription'),
        onSubmit: (blockchain: TBlockchainServiceKey) => {
          modalNavigate('decrypt-key', {
            state: {
              heading: t('title'),
              description: t('decryptKeyDescription'),
              encryptedKey,
              blockchain,
              onSubmit: submitKey,
            },
          })
        },
      },
    })
  }

  const submitMnemonic = async (value: string) => {
    modalNavigate('import-accounts-selection', { state: { value, type: 'mnemonic' } })
  }

  const { actionData, actionState, handleAct, handleChange, handleSubmit } = useImportActions({
    submitByType: {
      address: submitAddress,
      key: submitKey,
      encryptedKey: submitEncryptedKey,
      mnemonic: submitMnemonic,
    },
  })

  return (
    <ScreenLayout heading={t('title')} className="text-white">
      <form className="flex flex-col" onSubmit={handleAct(handleSubmit)}>
        <h2 className="mb-8">{t('subtitle')}</h2>

        <Textarea
          autoFocus
          aria-label={t('form.valueLabel')}
          placeholder={t('form.valuePlaceholder')}
          value={actionData.value}
          containerClassName="mb-4"
          multiline={actionData.type === 'mnemonic'}
          clearable
          pastable
          required
          error={!!actionState.errors.value}
          onChange={handleChange}
        />

        {actionState.errors.value ? (
          <Banner type="error" message={actionState.errors.value} />
        ) : (
          actionState.isValid &&
          actionData.type && <Banner type="success" message={t(`successBanner.${actionData.type}`)} />
        )}

        <Button
          label={t('submitButtonLabel')}
          type="submit"
          className="mt-12"
          disabled={!actionData.value || !actionState.isValid}
          loading={actionState.isActing}
        />
      </form>
    </ScreenLayout>
  )
}
