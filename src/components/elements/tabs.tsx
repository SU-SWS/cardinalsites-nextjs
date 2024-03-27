"use client";

import {TabsProvider, useTabs} from '@mui/base/useTabs';
import {useTab} from '@mui/base/useTab';
import {useTabPanel} from '@mui/base/useTabPanel';
import {TabsListProvider, useTabsList} from '@mui/base/useTabsList';
import {HTMLAttributes, ReactNode, SyntheticEvent, useRef} from "react";
import {UseTabParameters} from "@mui/base/useTab/useTab.types";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {UseTabsParameters} from "@mui/base/useTabs/useTabs.types";
import {UseTabsListParameters} from "@mui/base/useTabsList/useTabsList.types";
import {UseTabPanelParameters} from "@mui/base/useTabPanel/useTabPanel.types";
import {useRouter, useSearchParams} from "next/navigation";

// View the API for all the tab components here: https://mui.com/base-ui/react-tabs/hooks-api/.
type TabsProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The query parameter in the URL for sharing or reloading.
   */
  paramId?: string
  /**
   * Default tab for initial rendering.
   */
  defaultTab?: UseTabsParameters["defaultValue"]
  /**
   * Which direction the tabs are displayed.
   */
  orientation?: UseTabsParameters["orientation"]
}

export const Tabs = ({paramId = 'tab', orientation, defaultTab, children, ...props}: TabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const onChange = (_e: SyntheticEvent | null, value: number | string | null) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(paramId, `${value}`) : params.delete(paramId);
    router.replace(`?${params.toString()}`, {scroll: false})
  }
  const paramValue = searchParams.get(paramId)
  const initialTab = defaultTab || (paramValue && parseInt(paramValue))

  const {contextValue} = useTabs({orientation, defaultValue: initialTab || 0, onChange, selectionFollowsFocus: true})

  return (
    <TabsProvider value={contextValue}>
      <div {...props}>
        {children}
      </div>
    </TabsProvider>
  )
}

type TabsListProps = Omit<UseTabsListParameters, "rootRef"> & {
  /**
   * <Tab> components.
   */
  children: ReactNode
  /**
   * Classes for the tab list.
   */
  className?: HTMLAttributes<HTMLDivElement>["className"]
  /**
   * Attributes for the tab list.
   */
  containerProps?: Omit<HTMLAttributes<HTMLDivElement>, "className">
}

export const TabsList = ({containerProps, className, children, ...props}: TabsListProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const {contextValue, orientation, getRootProps} = useTabsList({...props, rootRef});
  const isVertical = orientation === "vertical";
  return (
    <TabsListProvider value={contextValue}>
      <div
        {...getRootProps()}
        {...containerProps}
        className={twMerge(clsx("flex", {"flex-col": isVertical}), className)}
      >
        {children}
      </div>
    </TabsListProvider>
  )
}

type TabProps = UseTabParameters & {
  /**
   * React node or string for the tab.
   */
  children: ReactNode
  /**
   * Classes for the button element.
   */
  className?: HTMLAttributes<HTMLDivElement>["className"]
  /**
   * Extra attributes for the button element.
   */
  buttonProps?: HTMLAttributes<HTMLButtonElement>
}

export const Tab = ({buttonProps, className, children, ...props}: TabProps) => {
  const rootRef = useRef<HTMLButtonElement>(null);
  const {selected, getRootProps} = useTab({...props, rootRef});

  return (
    <button
      {...getRootProps()}
      {...buttonProps}
      className={twMerge(clsx("text-left p-3 border-b-3 border-transparent", {"border-cardinal-red": selected}), className)}
    >
      {children}
    </button>
  )
}

type TabPanelProps = UseTabPanelParameters & {
  /**
   * Panel contents.
   */
  children: ReactNode
  /**
   * Classes for the panel.
   */
  className?: HTMLAttributes<HTMLDivElement>["className"]
  /**
   * Extra attributes for the panel.
   */
  panelProps?: HTMLAttributes<HTMLElement>
}

export const TabPanel = ({panelProps, className, children}: TabPanelProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const {getRootProps} = useTabPanel({rootRef});
  return (
    <section {...getRootProps()} {...panelProps} role="tabpanel" className={className}>
      {children}
    </section>
  )
}