import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

const PersonCardView = async ({filtered, ...props}: ViewDisplayProps<NodeStanfordPerson>) => {
  return <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.People : undefined} filterKey="filter" />
}
export default PersonCardView
