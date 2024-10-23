import CardViewGrid from "@components/views/card-view-grid"
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const CourseCardView = async (props: ViewDisplayProps<NodeStanfordCourse>) => {
  return <CardViewGrid {...props} />
}
export default CourseCardView
