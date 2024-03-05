import StanfordCourseListItem from "@components/nodes/list-item/stanford-course/stanford-course-list-item";
import LoadMoreList from "@components/elements/load-more-list";
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d";

interface Props {
  headingLevel?: "h2" | "h3"
  items?: NodeStanfordCourse[]
}

const CourseListView = async ({items = [], headingLevel}: Props) => {
  return (
    <LoadMoreList
      buttonText={<>Load More<span className="sr-only">&nbsp;courses</span></>}
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0"}}
    >
      {items.map(item =>
        <StanfordCourseListItem key={item.id} node={item} headingLevel={headingLevel}/>
      )}
    </LoadMoreList>
  )
}
export default CourseListView;