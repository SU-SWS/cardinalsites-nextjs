import {ViewDisplayProps} from "@components/views/view"
import {NodeStanfordOpportunity} from "@lib/gql/__generated__/drupal.d"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import CardViewGrid from "@components/views/card-view-grid"

type Props = ViewDisplayProps<NodeStanfordOpportunity> & {
  filtered?: boolean
}

const OpportunitiesCardView = async ({filtered, ...props}: Props) => {
  return (
    <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.Opportunities : undefined} filterKey="filters" />
  )
}

export default OpportunitiesCardView
