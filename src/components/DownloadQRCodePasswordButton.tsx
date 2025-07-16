import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { Button, TButtonProps } from './Button'

import TbDownload from '@/assets/images/tb-download.svg?react'

type TProps = {
  onDownload?: () => Promise<void>
  password: string
} & TButtonProps

export const DownloadQRCodePasswordButton = ({
  label,
  variant,
  rightIcon,
  onDownload,
  loading,
  password,
  ...props
}: TProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'general' })

  const handleDownload = async () => {
    await UtilsHelper.downloadSVGToPng('QRCode')

    if (onDownload) await onDownload()
  }

  return (
    <>
      {password && <QRCodeSVG id="QRCode" size={172} value={password} includeMargin className="hidden" />}
      <Button
        label={label ? label : t('downloadQRCodePassword')}
        rightIcon={rightIcon ? rightIcon : <TbDownload aria-hidden={true} />}
        variant={variant ? variant : 'outlined'}
        className={props.className}
        iconsOnEdge={false}
        loading={loading}
        onClick={handleDownload}
      />
    </>
  )
}
