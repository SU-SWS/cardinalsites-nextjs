import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item"
import LoadMoreList from "@components/elements/load-more-list"
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const EventsListView = async ({items, headingLevel, totalItems, loadPage}: ViewDisplayProps<NodeStanfordEvent>) => {
  return (
    <LoadMoreList
      buttonText={
        <>
          Load More<span className="sr-only">&nbsp;Events</span>
        </>
      }
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordEventListItem key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}
export default EventsListView
