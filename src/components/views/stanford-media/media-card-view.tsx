import CardViewGrid from "@components/views/card-view-grid"
import {ViewDisplayProps} from "@components/views/view"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

const MediaCardView = async ({filtered, ...props}: ViewDisplayProps) => {
  return <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.Media : undefined} filterKey="filter" />
}
export default MediaCardView
