import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'
import { Button } from '@renderer/components/Button'
import { Loader } from '@renderer/components/Loader'
import { Separator } from '@renderer/components/Separator'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import TbPrinter from '@renderer/assets/images/tb-printer.svg?react'

import { EncryptionHelper } from '@shared/helpers/EncryptionHelper'
import type { TModalState } from '@shared/types/modal'

export const ExportKeyModal = () => {
  const { account } = useModalState<TModalState<'export-key'>>()
  const { loginSessionRef } = useLoginSessionSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'exportKey' })

  const {
    actionData: { decryptedKey },
    actionState,
    setData,
    setError,
  } = useActions({
    decryptedKey: '',
  })

  const isDisabled = actionState.isActing || decryptedKey.length === 0

  const handlePrint = () => {
    const printContent = decryptedKey
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
      const decryptedKey = await EncryptionHelper.decrypt(
        account.encryptedKey,
        loginSessionRef.current?.encryptedPassword
      )

      setData({ decryptedKey: decryptedKey })
    } catch {
      setError('decryptedKey', t('error'))
    }
  }, 500)

  return (
    <BottomModalLayout heading={t('title')} className="overflow-y-auto">
      <div className="mb-5 flex w-full flex-col items-center justify-between">
        <div className="bg-asphalt flex h-8 w-full items-center justify-center rounded">
          {StringHelper.truncateMiddle(account.name, 45)}
        </div>

        <p className="pt-4 text-center text-sm text-gray-100 print:hidden">{t('subtitle')}</p>
        <div className="mt-8 flex justify-center rounded-md">
          <div className="rounded">
            <QRCodeSVG id="QRCode" aria-label={decryptedKey} size={174} value={decryptedKey} includeMargin />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="bg-asphalt flex w-full flex-col rounded px-3 py-2.5 text-sm">
          <div className="mb-2.5 flex items-center justify-center gap-x-2">
            <div className="text-sm">{t('keyDetailsTitle')}</div>
          </div>

          <Separator />

          <div className="flex flex-col px-3 pt-6 pb-4">
            {isMounting || decryptedKey === '' ? (
              <Loader className="size-8" />
            ) : (
              <span className="text-wrap break-all">{decryptedKey}</span>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex justify-center gap-3 print:hidden">
          <Button
            variant="text"
            leftIcon={<MdContentCopy aria-hidden />}
            label={t('copyButtonLabel')}
            onClick={ClipboardHelper.write.bind(null, decryptedKey)}
            clickableProps={{ className: 'px-4' }}
            flat
            disabled={isDisabled}
          />

          <Button
            variant="text"
            leftIcon={<TbPrinter aria-hidden />}
            label={t('printButtonLabel')}
            clickableProps={{ className: 'px-4' }}
            flat
            disabled={isDisabled}
            onClick={() => handlePrint()}
          />
        </div>

        <Banner
          className="mt-5 print:hidden"
          type="warningOrange"
          textClassName="py-4 print:hidden"
          message={t('warningDescription')}
        />
      </div>
    </BottomModalLayout>
  )
}

export default ExportKeyModal
