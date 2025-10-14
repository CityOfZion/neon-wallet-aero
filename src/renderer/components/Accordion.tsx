import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import * as RadixAccordion from '@radix-ui/react-accordion'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import MdExpandMore from '@renderer/assets/images/md-expand-more.svg?react'

const Root = RadixAccordion.Root

type TTriggerProps = ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> & { iconClassName?: string }

const Trigger = forwardRef<ComponentRef<typeof RadixAccordion.Trigger>, TTriggerProps>(
  ({ className, iconClassName, children, ...props }, ref) => (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        ref={ref}
        className={StyleHelper.mergeStyles(
          'flex flex-1 cursor-pointer items-center justify-between border-b border-gray-100/50 px-2.5 py-2.5 text-sm font-medium transition-all [&[data-state=open]>.accordion-trigger-icon]:rotate-180',
          className
        )}
        {...props}
      >
        {children}

        <MdExpandMore
          aria-hidden={true}
          className={StyleHelper.mergeStyles(
            'accordion-trigger-icon h-6 w-6 shrink-0 text-gray-100 transition-transform duration-200',
            iconClassName
          )}
        />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
)

const Content = forwardRef<
  ComponentRef<typeof RadixAccordion.Content>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content ref={ref} className="overflow-hidden text-sm" {...props}>
    <div className={StyleHelper.mergeStyles('pt-0 pb-0', className)}>{children}</div>
  </RadixAccordion.Content>
))

const Item = forwardRef<ComponentRef<typeof RadixAccordion.Item>, ComponentPropsWithoutRef<typeof RadixAccordion.Item>>(
  ({ className, ...props }, ref) => (
    <RadixAccordion.Item ref={ref} className={StyleHelper.mergeStyles('group', className)} {...props} />
  )
)

export const Accordion = { Root, Trigger, Content, Item }
