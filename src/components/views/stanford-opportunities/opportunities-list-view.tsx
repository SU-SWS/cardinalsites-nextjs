import {NodeStanfordOpportunity} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import StanfordOpportunityListItem from "@components/nodes/list-item/stanford-opportunity/stanford-opportunity-list-item"
import PagedList from "@components/elements/paged-list"
import {getTermFilterGroups} from "@lib/gql/gql-queries"
import FilteredListViewClient from "@components/views/filtered-list-view/filtered-list-view.client"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import {Suspense} from "react"

type Props = ViewDisplayProps<NodeStanfordOpportunity>

const OpportunitiesListView = async ({items, headingLevel, totalItems, loadPage, filtered}: Props) => {
  if (filtered) {
    const filters = await getTermFilterGroups(FilterVocabs.Opportunities)

    return (
      <FilteredListViewClient
        ulProps={{className: "list-unstyled mb-40"}}
        liProps={{
          className: "border-b border-black-20 last-of-type:border-0 pb-20 last:pb-0 pt-20 first:pt-0",
        }}
        totalItems={totalItems}
        loadPage={loadPage}
        filters={filters}
        filterKey="filters"
      >
        {items.map(item => (
          <StanfordOpportunityListItem key={item.uuid} node={item} headingLevel={headingLevel} />
        ))}
      </FilteredListViewClient>
    )
  }

  return (
    <Suspense fallback={<OpportunitiesListSkeleton />}>
      <PagedList
        ulProps={{className: "list-unstyled mb-40"}}
        liProps={{
          className: "border-b border-black-20 last-of-type:border-0 pb-20 last:pb-0 pt-20 first:pt-0",
        }}
        pageKey="news="
        totalPages={Math.ceil(totalItems / 30)}
        loadPage={loadPage}
      >
        {items.map(item => (
          <StanfordOpportunityListItem key={item.id} node={item} headingLevel={headingLevel} />
        ))}
      </PagedList>
    </Suspense>
  )
}

export const OpportunitiesListSkeleton = () => {
  return (
    <div>
      <div className="flex min-h-200 items-center justify-between border-b border-black-20 pb-20">
        <div className="grow">
          <div className="mb-10 h-7 w-1/4 bg-black-10" />
          <div className="mb-20 h-16 w-1/2 bg-black-10" />
          <div className="mb-10 h-7 w-2/3 bg-black-10" />
          <div className="h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-20 aspect-video shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
      <div className="flex min-h-150 items-center justify-between pt-20">
        <div className="grow">
          <div className="mb-10 h-7 w-1/4 bg-black-10" />
          <div className="mb-20 h-16 w-1/2 bg-black-10" />
          <div className="mb-10 h-7 w-2/3 bg-black-10" />
          <div className="h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-20 aspect-video shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
    </div>
  )
}

export default OpportunitiesListView
