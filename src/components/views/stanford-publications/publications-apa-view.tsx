import CardViewGrid from "@components/views/card-view-grid";
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d";

interface Props {
  /**
   * List of nodes to display.
   */
  items: NodeStanfordPublication[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
}

const PublicationsApaView = async ({items = [], headingLevel}: Props) => {
  return (
    <CardViewGrid items={items} headingLevel={headingLevel}/>
  )
}
export default PublicationsApaView;