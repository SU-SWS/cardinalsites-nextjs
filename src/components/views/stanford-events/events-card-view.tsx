import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordEvent} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

const EventsCardView = async ({filtered, ...props}: ViewDisplayProps<NodeStanfordEvent>) => {
  return <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.Events : undefined} filterKey="event_tags" />
}
export default EventsCardView
