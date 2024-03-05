import CardViewGrid from "@components/views/card-view-grid";
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d";

interface Props {
  headingLevel?: "h2" | "h3"
  items?: NodeStanfordPerson[]
}

const PersonCardView = async ({items = [], headingLevel}: Props) => {
  return (
    <CardViewGrid items={items} headingLevel={headingLevel}/>
  )
}
export default PersonCardView;