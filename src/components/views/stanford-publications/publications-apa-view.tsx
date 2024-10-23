import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const PublicationsApaView = async (props: ViewDisplayProps<NodeStanfordPublication>) => {
  return <CardViewGrid {...props} />
}
export default PublicationsApaView
