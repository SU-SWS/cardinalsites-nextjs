import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

const CourseCardView = async ({filtered, ...props}: ViewDisplayProps<NodeStanfordCourse>) => {
  return <CardViewGrid {...props} filteredVocab={filtered ? FilterVocabs.Courses : undefined} filterKey="filter" />
}
export default CourseCardView
