import {NodeStanfordOpportunity} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import StanfordOpportunityListItem from "@components/nodes/list-item/stanford-opportunity/stanford-opportunity-list-item"
import PagedList from "@components/elements/paged-list"
import {getTermFilterGroups} from "@lib/gql/gql-queries"
import FilteredListViewClient from "@components/views/filtered-list-view/filtered-list-view.client"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

type Props = ViewDisplayProps<NodeStanfordOpportunity>

const OpportunitiesListView = async ({items, headingLevel, totalItems, loadPage, filtered}: Props) => {
  if (filtered) {
    const filters = await getTermFilterGroups(FilterVocabs.Opportunities)

    return (
      <FilteredListViewClient
        ulProps={{className: "list-unstyled mb-20"}}
        liProps={{
          className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
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
    <PagedList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      pageKey="news="
      totalPages={Math.ceil(totalItems / 30)}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordOpportunityListItem key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </PagedList>
  )
}

export default OpportunitiesListView
