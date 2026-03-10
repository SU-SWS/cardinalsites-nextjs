import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordEvent} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"

const EventsCardView = async (props: ViewDisplayProps<NodeStanfordEvent>) => {
  return <CardViewGrid {...props} />
}
export default EventsCardView
