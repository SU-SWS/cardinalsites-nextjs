"use client";

import {TabsProvider, useTabs} from '@mui/base/useTabs';
import {useTab} from '@mui/base/useTab';
import {useTabPanel} from '@mui/base/useTabPanel';
import {TabsListProvider, useTabsList} from '@mui/base/useTabsList';
import {HTMLAttributes, useRef} from "react";
import {UseTabParameters} from "@mui/base/useTab/useTab.types";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {UseTabsParameters} from "@mui/base/useTabs/useTabs.types";

type TabsProps = HTMLAttributes<HTMLDivElement> & UseTabsParameters & {}

export const Tabs = ({orientation, children, ...props}: TabsProps) => {
  const {contextValue} = useTabs({orientation, defaultValue: 0})
  return (
    <TabsProvider value={contextValue}>
      <div {...props}>
        {children}
      </div>
    </TabsProvider>
  )
}

type TabsListProps = HTMLAttributes<HTMLDivElement> & {}

export const TabsList = ({children, ...props}: TabsListProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const {contextValue, orientation, getRootProps} = useTabsList({...props, rootRef});
  const isVertical = orientation === "vertical";
  return (
    <TabsListProvider value={contextValue}>
      <div {...getRootProps()} className={twMerge(clsx("flex", {"flex-col": isVertical}))}>
        {children}
      </div>
    </TabsListProvider>
  )
}

type TabProps = HTMLAttributes<HTMLButtonElement> & UseTabParameters & {}

export const Tab = ({className, children, ...props}: TabProps) => {
  const rootRef = useRef<HTMLButtonElement>(null);
  const {selected, getRootProps} = useTab({...props, rootRef});

  return (
    <button
      {...getRootProps()}
      className={twMerge(clsx("text-left p-3 border-b-3 border-transparent", {"border-cardinal-red": selected}), className)}
    >
      {children}
    </button>
  )
}

type TabPanelProps = HTMLAttributes<HTMLDivElement> & {}

export const TabPanel = ({children}: TabPanelProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const {getRootProps} = useTabPanel({rootRef});
  return (
    <section {...getRootProps()}>
      {children}
    </section>
  )
}