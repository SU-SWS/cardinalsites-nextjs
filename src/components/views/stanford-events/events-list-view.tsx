import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item"
import LoadMoreList from "@components/elements/load-more-list"
import {NodeStanfordEvent} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import {getTermFilterGroups} from "@lib/gql/gql-queries"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import FilteredListViewClient from "@components/views/filtered-list-view/filtered-list-view.client"

const ulProps = {className: "list-unstyled mb-40"}
const liProps = {className: "border-b border-black-20 last-of-type:border-0 pb-20 last:pb-0 pt-20 first:pt-0"}

const EventsListView = async ({
  items,
  headingLevel,
  totalItems,
  loadPage,
  filtered,
}: ViewDisplayProps<NodeStanfordEvent>) => {
  if (filtered) {
    const filters = await getTermFilterGroups(FilterVocabs.Events)

    return (
      <FilteredListViewClient
        ulProps={ulProps}
        liProps={liProps}
        totalItems={totalItems}
        loadPage={loadPage}
        filters={filters}
        filterKey="event_tags"
      >
        {items.map(item => (
          <StanfordEventListItem key={item.uuid} node={item} headingLevel={headingLevel} />
        ))}
      </FilteredListViewClient>
    )
  }

  return (
    <LoadMoreList
      buttonText={
        <>
          Load More<span className="sr-only">&nbsp;Events</span>
        </>
      }
      ulProps={ulProps}
      liProps={liProps}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordEventListItem key={item.uuid} node={item} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}
export default EventsListView
