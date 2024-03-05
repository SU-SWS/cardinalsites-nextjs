import CardViewGrid from "@components/views/card-view-grid";
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d";

interface Props {
  headingLevel?: "h2" | "h3"
  items?: NodeStanfordPublication[]
}

const PublicationsApaView = async ({items = [], headingLevel}: Props) => {
  return (
    <CardViewGrid items={items} headingLevel={headingLevel}/>
  )
}
export default PublicationsApaView;