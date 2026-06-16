"use client"

import {useCallback, useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {
  Tabs as BaseTabs,
  type TabsRootProps,
  type TabsListProps,
  type TabsTabProps,
  type TabsPanelProps,
  type TabsRoot,
  type TabsTab,
} from "@base-ui/react/tabs"
import {useScreen} from "usehooks-ts"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"

type TabsProps = TabsRootProps & {
  className?: string
  queryKey?: string
}

const TabsInner = ({
  orientation,
  queryKey,
  onValueChange,
  defaultValue,
  value,
  className,
  children,
  ...props
}: TabsProps) => {
  const screen = useScreen({initializeWithValue: false})
  const isVertical = (screen && screen.width < 768) || orientation === "vertical"
  const router = useRouter()
  const searchParams = useSearchParams()

  const queryValue = queryKey ? (searchParams.get(queryKey) ?? undefined) : undefined

  // When queryKey is set, manage controlled state initialized from the URL (or defaultValue).
  // This avoids "changing defaultValue of an uncontrolled component" since queryValue changes
  // on every tab click as the URL updates.
  const [activeTab, setActiveTab] = useState<TabsTab.Value | undefined>(
    queryKey ? queryValue || defaultValue : defaultValue
  )

  const handleValueChange = useCallback(
    (newValue: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => {
      if (queryKey && newValue) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(queryKey)
        if (newValue !== defaultValue) params.set(queryKey, String(newValue))
        router.replace(`?${params.toString()}`, {scroll: false})
        setActiveTab(newValue)
      }
      onValueChange?.(newValue, eventDetails)
    },
    [queryKey, onValueChange, router, searchParams, defaultValue]
  )

  return (
    <BaseTabs.Root
      {...props}
      className={twMerge("centered flex gap-5", clsx({"flex-col": !isVertical}), className)}
      value={activeTab}
      orientation={isVertical ? "vertical" : "horizontal"}
      onValueChange={handleValueChange}
    >
      {children}
    </BaseTabs.Root>
  )
}

export const Tabs = (props: TabsProps) => {
  return <TabsInner {...props} />
}

type ListProps = TabsListProps & {
  className?: string
}

export const TabsList = ({className, children, ...props}: ListProps) => {
  return (
    <BaseTabs.List {...props} className={twMerge("flex data-[orientation=vertical]:flex-col", className)}>
      {children}
    </BaseTabs.List>
  )
}

type TabProps = TabsTabProps & {
  className?: string
}

export const Tab = ({className, children, ...props}: TabProps) => {
  return (
    <BaseTabs.Tab
      {...props}
      className={twMerge(
        "w-fit border-transparent p-5 aria-selected:border-lagunita-dark data-[orientation=horizontal]:border-b-3 data-[orientation=vertical]:border-l-3 hocus:underline",
        clsx({
          "bg-black-10": props.disabled,
        }),
        className
      )}
    >
      {children}
    </BaseTabs.Tab>
  )
}

type TabPanelProps = TabsPanelProps & {
  className?: string
}

export const TabPanel = ({className, children, ...props}: TabPanelProps) => {
  return <BaseTabs.Panel {...props}>{children}</BaseTabs.Panel>
}
