"use client"

import {HTMLAttributes, JSX} from "react"
import LoadMoreList from "@components/elements/load-more-list"

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * Server action to load a page.
   */
  loadPage?: (_page: number, _filters?: Record<string, any>) => Promise<JSX.Element>
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
  /**
   * Elements to display initially.
   */
  children: JSX.Element[]
}

const SiteSearchClient = ({totalItems, loadPage, children}: Props) => {
  let pagerLoadPage
  if (loadPage) {
    pagerLoadPage = (page: number) => {
      return loadPage(page, {key: "images"})
    }
  }

  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      totalItems={totalItems}
      loadPage={pagerLoadPage}
    >
      {children}
    </LoadMoreList>
  )
}
export default SiteSearchClient
