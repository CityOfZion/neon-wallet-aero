import { ReactNode } from 'react'

import { Link, TLinkProps } from '@/components/Link'

type TProps = {
  title: string
  text: ReactNode
  icon: React.JSX.Element
} & TLinkProps

export const LoginNeonAccountOnboardingLink = ({ title, text, icon, ...props }: TProps) => (
  <Link variant="card" clickableProps={{ className: 'h-auto gap-6 px-5 py-4' }} {...props} leftIcon={icon}>
    <div className="flex flex-grow flex-col gap-y-1 text-left">
      <span className="text-sm font-bold text-white uppercase">{title}</span>
      <span className="text-gray-100">{text}</span>
    </div>
  </Link>
)
