import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { StyleHelper } from '@/helpers/StyleHelper'

const Root = TabsPrimitive.Root

const List = forwardRef<ComponentRef<typeof TabsPrimitive.List>, ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, children, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={StyleHelper.mergeStyles('flex items-center justify-center gap-1.5', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  )
)

const Trigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={StyleHelper.mergeStyles(
      'text-neon data-[state=active]:text-asphalt not-disabled:hover:text-asphalt cursor-pointer rounded-full bg-gray-700/60 px-3.5 py-2 text-xs leading-3 font-semibold whitespace-nowrap transition-all not-disabled:hover:bg-gray-200 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-200',
      className
    )}
    {...props}
  />
))

const Content = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={StyleHelper.mergeStyles('mt-6 focus-visible:outline-none', className)}
    {...props}
  />
))

export const Tabs = { Content, List, Root, Trigger }
