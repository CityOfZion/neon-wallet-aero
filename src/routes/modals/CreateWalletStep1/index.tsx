import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { Loader } from '@/components/Loader'
import { MnemonicHelper } from '@/helpers/MnemonicHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useActions } from '@/hooks/useActions'
import { useModalNavigate } from '@/hooks/useModalRouter'
import { useMountUnsafe } from '@/hooks/useMountUnsafe'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'

import MdiRhombusOutline from '@/assets/images/mdi-alert-rhombus-outline.svg?react'
import MdiNumeric1Box from '@/assets/images/mdi-numeric-1-box.svg?react'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg?react'
import TbCopy from '@/assets/images/tb-copy.svg?react'
import TbPrinter from '@/assets/images/tb-printer.svg?react'

type TActionData = {
  mnemonic: string[]
}

export const CreateWalletStep1Modal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'createWalletStep1Modal' })
  const {
    actionData: { mnemonic },
    actionState,
    setData,
  } = useActions<TActionData>({ mnemonic: [] })
  const { modalNavigateWrapper, modalEraseWrapper } = useModalNavigate()

  const isDisabled = actionState.isActing || mnemonic.length === 0

  const handlePrint = () => {
    const printContent = mnemonic.join(' ')
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
      <html>
      <body>
        <pre>${printContent}</pre>
      </body>
      </html>
    `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleCopy = () => {
    try {
      UtilsHelper.copyToClipboard(mnemonic.join(' '))
    } catch (err) {
      ToastHelper.error({ message: t('message.copyError', { error: err }) })
    }
  }

  const { isMounting } = useMountUnsafe(async () => {
    const walletMnemonic = MnemonicHelper.generateMnemonic()
    setData({ mnemonic: walletMnemonic })
  }, 500)

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="flex items-center gap-4 px-3.5 pt-2 pb-4">
        <MdiNumeric1Box className="text-blue h-6 w-6" aria-hidden />
        <h3 className="text-lg">{t('subtitle')}</h3>
      </div>

      <div className="flex flex-col px-3.5 pb-5">
        <div className="border-b border-gray-100/30 pb-5">
          <p className="text-sm text-gray-100">{t('secretWordsText')}</p>
        </div>
        <p className="pt-3.5 text-sm text-gray-100">{t('writeDownText')}</p>
      </div>

      <div className="bg-asphalt mx-3.5 flex items-center gap-4 rounded py-2">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-2 px-10 py-2 text-center text-lg">
          {isMounting || mnemonic.length === 0 ? (
            <Loader />
          ) : (
            mnemonic.map((word, index) => <p key={`${word}-${index}`}>{`${index + 1}. ${word}`}</p>)
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-7 py-3">
        <Button
          variant="text-slim"
          leftIcon={<TbCopy aria-hidden className="w-4" />}
          label={t('copyButtonLabel')}
          onClick={handleCopy}
        />
        <Button
          variant="text-slim"
          leftIcon={<TbPrinter aria-hidden className="w-4" />}
          label={t('printButtonLabel')}
          onClick={handlePrint}
        />
      </div>

      <div className="mx-3.5 mt-2.5 mb-5 flex rounded-sm bg-gray-300/30">
        <div className="rounded-l-sm bg-gray-300/30 px-3 py-5">
          <MdiRhombusOutline aria-hidden className="text-pink w-6" />
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
          disabled={isDisabled}
          onClick={modalNavigateWrapper('create-wallet-2', {
            state: { mnemonic },
          })}
        />
      </div>
    </BottomModalLayout>
  )
}
