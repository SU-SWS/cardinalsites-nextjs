import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const PersonCardView = async (props: ViewDisplayProps<NodeStanfordPerson>) => {
  return <CardViewGrid {...props} />
}
export default PersonCardView
