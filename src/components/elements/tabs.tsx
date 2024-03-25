"use client";

import {AriaTabListOptions, Key, useTab, useTabList, useTabPanel} from 'react-aria';
import {Item, TabListState, useTabListState} from 'react-stately';
import {JSX, useRef} from "react";
import {TabListStateOptions} from "@react-stately/tabs";
import {Node} from "@react-types/shared/src/collections";
import {AriaTabPanelProps} from "@react-types/tabs";
import {clsx} from "clsx";
import {useRouter, useSearchParams} from "next/navigation";
import {useIsClient, useWindowSize} from "usehooks-ts";

type Props = AriaTabListOptions<JSX.Element> & TabListStateOptions<JSX.Element> & {
  paramId?: string
  tabs: { id: string, title: string, contents: JSX.Element | string }[]
}

const Tabs = ({tabs, orientation = "horizontal", ...props}: Props) => {
  if (!props['aria-label'] && !props['aria-labelledby']) console.warn('Tabs missing appropriate aria labelling');

  const isClient = useIsClient();
  const {width: windowWidth = 0} = useWindowSize({debounceDelay: 200})
  const adjustedOrientation = windowWidth < 550 ? "vertical" : windowWidth >= 992 ? orientation : "horizontal"

  if (isClient) return (
    <TabsWrapper {...props} isDisabled={tabs.length === 1} orientation={adjustedOrientation}>
      {tabs.map(tab =>
        <Item key={`tab-${tab.id}`} title={tab.title}>
          {tab.contents}
        </Item>
      )}
    </TabsWrapper>
  )

  // Server rendering only prints the tabs. We also want to display at least the first tab panel on the server and
  // allow the client to rehydrate.
  return (
    <div className={clsx("flex", {"flex-col gap-5": orientation !== "vertical"})}>
      <div className={clsx("flex", {"flex-col w-1/3": orientation === "vertical"})}>
        {tabs.map((item, i) => (
          <div
            key={item.id}
            className={clsx('text-left p-5', {
              'border-l-3': orientation === "vertical",
              'border-b-3': orientation !== "vertical",
              'border-cardinal-red': i === 0,
              'border-transparent': i !== 0,
            })}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div>
        {tabs[0]?.contents}
      </div>
    </div>
  )
}

const TabsWrapper = ({paramId = 'tab', ...props}: AriaTabListOptions<JSX.Element> & TabListStateOptions<JSX.Element> & {
  paramId?: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const defaultSelectedKey = paramId ? (searchParams.get(paramId) || undefined) : undefined

  const onSelectionChange = (key: Key) => {
    const params = new URLSearchParams(searchParams);
    key === state.collection.getFirstKey() ? params.delete(paramId) : params.set(paramId, `${key}`)
    router.replace(`?${params.toString()}`, {scroll: false})
  }

  let state = useTabListState({...props, onSelectionChange, defaultSelectedKey});
  let ref = useRef<HTMLDivElement>(null);
  let {tabListProps} = useTabList(props, state, ref);

  return (
    <div className={clsx("flex flex-col", {"lg:flex-row gap-5": props.orientation === "vertical"})}>
      <div {...tabListProps} ref={ref} className={clsx("flex", {"flex-col w-1/3": props.orientation === "vertical"})}>
        {[...state.collection].map(item => (
          <Tab key={item.key} item={item} state={state} orientation={props.orientation}/>
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state}/>
    </div>
  );
}


const Tab = ({item, state, orientation}: {
  item: Node<JSX.Element>,
  state: TabListState<JSX.Element>,
  orientation?: AriaTabListOptions<JSX.Element>["orientation"]
}) => {
  let {key, rendered} = item;
  let ref = useRef<HTMLButtonElement>(null);
  let {tabProps} = useTab({key}, state, ref);
  const isActive = tabProps['aria-selected']
  return (
    <button
      {...tabProps}
      ref={ref}
      className={clsx('text-left p-5', {
        'border-l-3': orientation === "vertical",
        'border-b-3': orientation !== "vertical",
        'border-cardinal-red': isActive,
        'border-transparent': !isActive
      })}
    >
      {rendered}
    </button>
  );
}

const TabPanel = ({state, ...props}: { state: TabListState<JSX.Element> } & AriaTabPanelProps) => {
  let ref = useRef<HTMLDivElement>(null);
  let {tabPanelProps} = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
}
export default Tabs;
