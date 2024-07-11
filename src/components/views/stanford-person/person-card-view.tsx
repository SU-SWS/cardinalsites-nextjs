import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"

interface Props {
  /**
   * List of nodes to display.
   */
  items: NodeStanfordPerson[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
}

const PersonCardView = async ({items = [], headingLevel}: Props) => {
  return <CardViewGrid items={items} headingLevel={headingLevel} />
}
export default PersonCardView
