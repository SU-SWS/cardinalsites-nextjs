import CardViewGrid from "@components/views/card-view-grid"
import {ViewDisplayProps} from "@components/views/view"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

const NewsCardView = async ({filtered, ...props}: ViewDisplayProps) => {
  return <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.News : undefined} filterKey="spotlight" />
}
export default NewsCardView
