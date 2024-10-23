import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const PageCardView = async (props: ViewDisplayProps<NodeStanfordPage>) => {
  return <CardViewGrid {...props} />
}
export default PageCardView
