import { Separator } from '@radix-ui/react-context-menu'
import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbPrinter from '@renderer/assets/images/tb-printer.svg?react'

import type { TModalState } from '@shared/types/modal'

export const ExportMnemonicModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportMnemonic' })
  const { wallet } = useModalState<TModalState<'export-mnemonic'>>()
  const { editWallet } = useBlockchainActions()

  const { loginSessionRef } = useLoginSessionSelector()

  const {
    actionData: { walletMnemonic },
    actionState,
    setData,
    setError,
  } = useActions({
    walletMnemonic: '',
  })

  const isDisabled = actionState.isActing || walletMnemonic.length === 0

  const handlePrint = () => {
    const printContent = walletMnemonic
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<html lang="en" translate="no">
  <body>
    <pre>${printContent}</pre>
  </body>
</html>`)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const { isMounting } = useMountUnsafe(async () => {
    try {
      const decryptedMnemonic = await EncryptionHelper.decrypt(
        wallet.encryptedMnemonic,
        loginSessionRef.current?.encryptedPassword
      )

      await editWallet({ wallet, data: { backupStatus: 'successful' } })

      setData({ walletMnemonic: decryptedMnemonic })
    } catch {
      setError('walletMnemonic', t('error'))
    }
  }, 500)

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="flex h-[84%] w-full flex-col items-center justify-between">
        <div className="flex w-full flex-col gap-6 pb-8">
          <div className="bg-asphalt flex h-8.5 items-center justify-center rounded">{wallet.name}</div>
          <div className="text-center text-sm text-gray-100 print:hidden">{t('description')}</div>
          <div className="bg-asphalt flex min-h-24 flex-col rounded p-2">
            <div className="flex items-center justify-center gap-2">
              <p className="mb-2 text-center text-sm text-white">{t('yourMnemonic')}</p>
            </div>

            <Separator />

            <div className="flex flex-wrap justify-center gap-2 px-10 py-5">
              {isMounting || walletMnemonic.length === 0 ? (
                <Loader className="size-8" />
              ) : (
                walletMnemonic.split(' ').map((word, index) => (
                  <span className="text-lg text-white" key={`${word}-${index}`}>
                    {index + 1}. {word}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center gap-3 print:hidden">
            <Button
              iconsOnEdge={false}
              variant="text"
              leftIcon={<MdContentCopy aria-hidden />}
              label={t('copyButtonLabel')}
              disabled={isDisabled}
              onClick={ClipboardHelper.write.bind(null, walletMnemonic)}
              flat
            />

            <Button
              iconsOnEdge={false}
              variant="text"
              leftIcon={<TbPrinter aria-hidden />}
              label={t('printButtonLabel')}
              flat
              disabled={isDisabled}
              onClick={() => handlePrint()}
            />
          </div>
          <Banner type="error" message={t('warning')} className="print:hidden" />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default ExportMnemonicModal
