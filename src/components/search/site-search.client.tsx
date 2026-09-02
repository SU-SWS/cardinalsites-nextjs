"use client"

import {HTMLAttributes, JSX} from "react"
import LoadMoreList from "@components/elements/load-more-list"
import {Maybe} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import {ViewFilter} from "@lib/gql/gql-views"

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * Server action to load a page.
   */
  loadPage?: ViewDisplayProps["loadPage"]
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
    pagerLoadPage = (page?: Maybe<number>, filter?: ViewFilter) => {
      return loadPage(page, filter)
    }
  }

  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled mb-40"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-20 last:pb-0 pt-20 first:pt-0",
      }}
      totalItems={totalItems}
      loadPage={pagerLoadPage}
    >
      {children}
    </LoadMoreList>
  )
}
export default SiteSearchClient
