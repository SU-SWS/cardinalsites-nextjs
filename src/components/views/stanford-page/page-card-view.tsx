import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"

interface Props {
  /**
   * List of nodes to display.
   */
  items: NodeStanfordPage[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
}

const PageCardView = async ({items = [], headingLevel}: Props) => {
  return <CardViewGrid items={items} headingLevel={headingLevel} />
}
export default PageCardView
