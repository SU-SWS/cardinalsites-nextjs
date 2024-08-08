import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d"

interface Props {
  /**
   * List of nodes to display.
   */
  items: NodeStanfordPublication[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
}

const PublicationsApaView = async ({items = [], headingLevel, totalItems}: Props) => {
  return <CardViewGrid items={items} headingLevel={headingLevel} totalItems={totalItems} />
}
export default PublicationsApaView
