import { useTranslation } from 'react-i18next'
import { Separator } from '@radix-ui/react-context-menu'
import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { IWalletState } from '@shared/types/store'

import TbCopy from '@renderer/assets/images/tb-copy.svg?react'
import TbPrinter from '@renderer/assets/images/tb-printer.svg?react'

type TLocationState = {
  wallet: IWalletState
}

export const ExportMnemonicModal = () => {
  const { wallet } = useModalState<TLocationState>()
  const { t } = useTranslation('modals', { keyPrefix: 'exportMnemonic' })
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

  if (!loginSessionRef.current) {
    throw new Error('Login session not defined')
  }

  const handlePrint = () => {
    const printContent = walletMnemonic
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

  const { isMounting } = useMountUnsafe(async () => {
    try {
      if (!loginSessionRef.current) {
        throw new Error('Login session not defined')
      }
      const decryptedMnemonic = await EncryptionHelper.decrypt(
        wallet.encryptedMnemonic,
        loginSessionRef.current.encryptedPassword
      )
      setData({ walletMnemonic: decryptedMnemonic })
    } catch {
      setError('walletMnemonic', t('error'))
    }
  }, 500)

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="flex h-[84%] w-full flex-col items-center justify-between">
        <div className="flex w-full flex-col gap-6">
          <div className="bg-asphalt flex h-[34px] items-center justify-center rounded">{wallet.name}</div>
          <div className="text-center text-sm text-gray-100 print:hidden">{t('description')}</div>
          <div className="bg-asphalt flex min-h-[6rem] flex-col rounded p-2">
            <div className="flex items-center justify-center gap-2">
              <p className="mb-2 text-center text-sm text-white">{t('yourMnemonic')}</p>
            </div>

            <Separator />

            <div className="flex flex-wrap justify-center gap-2 px-10 py-5">
              {isMounting || walletMnemonic.length === 0 ? (
                <Loader />
              ) : (
                walletMnemonic.split(' ').map((word, index) => (
                  <span className="text-lg text-white" key={`${word}-${index}`}>
                    {word}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center gap-3 print:hidden">
            <Button
              iconsOnEdge={false}
              variant="text"
              leftIcon={<TbCopy aria-hidden={true} />}
              label={t('copyButtonLabel')}
              disabled={isDisabled}
              onClick={() => ClipboardHelper.write(walletMnemonic)}
              flat
            />

            <Button
              iconsOnEdge={false}
              variant="text"
              leftIcon={<TbPrinter aria-hidden={true} />}
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
