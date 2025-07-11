import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/IconButton'
import { StyleHelper } from '@/helpers/StyleHelper'

import { ScreenLayout } from './ScreenLayout'

import NeonWalletFullImage from '@/assets/images/neon-wallet-full.svg?react'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg?react'

type TProps = {
  heading: string
  children?: ReactNode
  contentClassName?: string
  withBackButton?: boolean
}

export const ForgottenPasswordLayout = ({
  heading,
  contentClassName,
  children,
  withBackButton = true,
  ...props
}: TProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <ScreenLayout contentClassName={StyleHelper.mergeStyles('items-center', contentClassName)} {...props}>
      {withBackButton && (
        <IconButton
          icon={<TbArrowLeft aria-hidden={true} />}
          className="absolute top-5 left-5"
          size="md"
          onClick={handleBack}
        />
      )}

      <NeonWalletFullImage className="mt-16 h-11" />
      <h1 className="mt-4 text-center text-lg text-white">{heading}</h1>

      {children}
    </ScreenLayout>
  )
}
